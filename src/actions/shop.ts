"use server";

import { db } from "@/db";
import { cards, users, userCards, Card } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { rollRarity } from "@/lib/gacha";
import { DrawnCard, PackOpeningResult } from "@/types";
import { PACK_PRICES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

/**
 * Retorna os dados do jogador atual para a Loja
 */
export async function getPlayerShopData() {
  try {
    const userList = await db.select().from(users).limit(1);
    if (userList.length === 0) {
      return null;
    }

    const user = userList[0];
    const collection = await db
      .select({ count: sql<number>`count(*)` })
      .from(userCards)
      .where(eq(userCards.userId, user.id));

    return {
      user,
      totalOwnedCards: Number(collection[0]?.count || 0),
    };
  } catch (error) {
    console.error("Erro ao obter dados da loja:", error);
    return null;
  }
}

/**
 * Adiciona ouro de demonstração para testes rápidos do jogador
 */
export async function addTestGoldAction(amount = 200) {
  try {
    const [user] = await db.select().from(users).limit(1);
    if (!user) return { success: false, error: "Usuário não encontrado" };

    const [updatedUser] = await db
      .update(users)
      .set({ gold: sql`${users.gold} + ${amount}` })
      .where(eq(users.id, user.id))
      .returning();

    try {
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // Ignora erro de revalidação fora do ciclo do Next.js (ex: scripts CLI)
    }
    return { success: true, newGold: updatedUser.gold };
  } catch (error) {
    console.error("Erro ao adicionar ouro de teste:", error);
    return { success: false, error: "Falha ao creditar ouro" };
  }
}

/**
 * Processa a compra e abertura de um pacote de 5 cartas
 */
export async function buyPackAction(
  packType: "STANDARD" | "MYSTIC" = "STANDARD"
): Promise<PackOpeningResult> {
  try {
    const cost = PACK_PRICES[packType];

    // 1. Verificar usuário
    const [user] = await db.select().from(users).limit(1);
    if (!user) {
      return {
        success: false,
        error: "Jogador não encontrado no sistema. Por favor, execute o seed inicial.",
        cards: [],
        remainingGold: 0,
        packType,
      };
    }

    // 2. Verificar saldo de ouro
    if (user.gold < cost) {
      return {
        success: false,
        error: `Ouro insuficiente! Você precisa de ${cost} de Ouro, mas possui apenas ${user.gold}. Conquiste vitórias na Campanha PvE para ganhar mais espólios!`,
        cards: [],
        remainingGold: user.gold,
        packType,
      };
    }

    // 3. Obter catálogo de cartas cadastradas
    const allCatalogCards = await db.select().from(cards);
    if (allCatalogCards.length === 0) {
      return {
        success: false,
        error: "Nenhuma carta cadastrada no catálogo do jogo.",
        cards: [],
        remainingGold: user.gold,
        packType,
      };
    }

    // Agrupar cartas por raridade
    const cardsByRarity: Record<string, Card[]> = {
      COMUM: [],
      INCOMUM: [],
      RARO: [],
      EPICO: [],
      LENDARIO: [],
    };

    for (const card of allCatalogCards) {
      if (cardsByRarity[card.rarity]) {
        cardsByRarity[card.rarity].push(card);
      }
    }

    // 4. Sortear 5 cartas
    const selectedCards: Card[] = [];
    for (let i = 0; i < 5; i++) {
      // Se for pacote místico, a 5ª carta tem garantia de no mínimo Raro
      const isGuaranteed = packType === "MYSTIC" && i === 4;
      const rolledRarity = rollRarity(isGuaranteed ? "RARO" : undefined);

      let pool = cardsByRarity[rolledRarity];
      // Fallback de segurança se uma categoria estiver vazia
      if (!pool || pool.length === 0) {
        pool = allCatalogCards;
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      selectedCards.push(pool[randomIndex]);
    }

    // 5. Execução Segura e Atômica no NeonDB (HTTP Serverless)
    // Deduz o ouro apenas se o jogador possuir saldo suficiente (proteção contra race conditions)
    const updatedUsers = await db
      .update(users)
      .set({ gold: sql`${users.gold} - ${cost}` })
      .where(sql`${users.id} = ${user.id} AND ${users.gold} >= ${cost}`)
      .returning();

    if (updatedUsers.length === 0) {
      return {
        success: false,
        error: "Falha na transação: Ouro insuficiente no momento do débito.",
        cards: [],
        remainingGold: user.gold,
        packType,
      };
    }

    const updatedUser = updatedUsers[0];

    // Buscar cartas já possuídas pelo jogador entre as selecionadas
    const drawnCardIds = selectedCards.map((c) => c.id);
    const existingUserCards = await db
      .select()
      .from(userCards)
      .where(
        sql`${userCards.userId} = ${user.id} AND ${inArray(
          userCards.cardId,
          drawnCardIds
        )}`
      );

    const existingMap = new Map<string, typeof existingUserCards[0]>();
    for (const uc of existingUserCards) {
      existingMap.set(uc.cardId, uc);
    }

    const finalDrawnCards: DrawnCard[] = [];

    // Atualizar coleção (user_cards)
    for (const card of selectedCards) {
      const existing = existingMap.get(card.id);

      if (existing) {
        const nextQuantity = existing.quantity + 1;
        await db
          .update(userCards)
          .set({ quantity: nextQuantity })
          .where(eq(userCards.id, existing.id));

        existing.quantity = nextQuantity;

        finalDrawnCards.push({
          ...card,
          isNew: false,
          newQuantity: nextQuantity,
        });
      } else {
        const [newUserCard] = await db
          .insert(userCards)
          .values({
            userId: user.id,
            cardId: card.id,
            quantity: 1,
          })
          .returning();

        existingMap.set(card.id, newUserCard);

        finalDrawnCards.push({
          ...card,
          isNew: true,
          newQuantity: 1,
        });
      }
    }

    try {
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // Ignora erro de revalidação fora do ciclo do Next.js (ex: scripts CLI)
    }

    return {
      success: true,
      cards: finalDrawnCards,
      remainingGold: updatedUser.gold,
      packType,
    };
  } catch (error) {
    console.error("Erro na transação de abertura de pacote:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao processar a abertura do pacote no servidor.",
      cards: [],
      remainingGold: 0,
      packType,
    };
  }
}

