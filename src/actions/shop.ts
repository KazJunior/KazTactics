"use server";

import { db } from "@/db";
import { cards, users, userCards, Card } from "@/db/schema";
import { getEffectiveUser } from "@/lib/auth";
import { eq, sql, inArray } from "drizzle-orm";
import { rollRarityForPack, normalizePackType } from "@/lib/gacha";
import {
  rollPackCopiesByRarity,
  applyCardLevelScaling,
} from "@/lib/cardProgression";
import { DrawnCard, PackOpeningResult, PackKind } from "@/types";
import { PACK_PRICES } from "@/lib/constants";
import { syncExpandedCardsToDb } from "@/lib/syncExpandedCards";
import { revalidatePath } from "next/cache";

async function ensureShopSchemaColumns() {
  await db.execute(
    sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "basic_packs" integer DEFAULT 0 NOT NULL;`
  );
  await db.execute(
    sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "advanced_packs" integer DEFAULT 0 NOT NULL;`
  );
  await db.execute(
    sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "supreme_packs" integer DEFAULT 1 NOT NULL;`
  );
  await db.execute(
    sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tutorial_completed" boolean DEFAULT true NOT NULL;`
  );
  await db.execute(
    sql`ALTER TABLE "user_cards" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;`
  );
  await syncExpandedCardsToDb();
}

/**
 * Retorna os dados do jogador atual para a Loja
 */
export async function getPlayerShopData() {
  try {
    await ensureShopSchemaColumns();
    const user = await getEffectiveUser();
    if (!user) {
      return null;
    }
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
export async function addTestGoldAction(amount = 2000) {
  try {
    await ensureShopSchemaColumns();
    const user = await getEffectiveUser();
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
 * Concede 1 Pacote Supremo por recompensa especial / evento
 */
export async function grantSpecialSupremePackAction(amount = 1) {
  try {
    await ensureShopSchemaColumns();
    const user = await getEffectiveUser();
    if (!user) return { success: false, error: "Usuário não encontrado" };

    const [updatedUser] = await db
      .update(users)
      .set({ supremePacks: sql`${users.supremePacks} + ${amount}` })
      .where(eq(users.id, user.id))
      .returning();

    try {
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // ignore
    }
    return {
      success: true,
      newSupremePacks: updatedUser.supremePacks,
    };
  } catch (error) {
    console.error("Erro ao conceder Pacote Supremo:", error);
    return { success: false, error: "Falha ao conceder Pacote Supremo" };
  }
}

/**
 * Processa a obtenção e abertura de um pacote de 5 cartas:
 * - BASIC: 100 Ouro (0.5% Lendária, 5% Épica)
 * - ADVANCED: 350 Ouro (2% Lendária, 10% Épica)
 * - SUPREME: Especial / Não comprável com Ouro (10% Lendária, 90% Épica)
 */
export async function buyPackAction(
  packType: PackKind = "BASIC"
): Promise<PackOpeningResult> {
  try {
    await ensureShopSchemaColumns();
    const normalizedType = normalizePackType(packType);
    const isSupreme = normalizedType === "SUPREME";
    const cost = isSupreme ? 0 : PACK_PRICES[normalizedType];

    // 1. Verificar usuário
    const user = await getEffectiveUser();
    if (!user) {
      return {
        success: false,
        error:
          "Jogador não encontrado no sistema. Por favor, execute o seed inicial.",
        cards: [],
        remainingGold: 0,
        remainingSupremePacks: 0,
        packType: normalizedType,
      };
    }

    const currentBasicPacks = user.basicPacks ?? 0;
    const currentAdvancedPacks = user.advancedPacks ?? 0;
    const currentSupremePacks = user.supremePacks ?? 0;
    const useFreeBasicPack = normalizedType === "BASIC" && currentBasicPacks > 0;
    const useFreeAdvancedPack =
      normalizedType === "ADVANCED" && currentAdvancedPacks > 0;

    // 2. Validar requisito de abertura (Pacote Supremo, Pacote Grátis do Tutorial ou Ouro)
    if (isSupreme) {
      if (currentSupremePacks <= 0) {
        return {
          success: false,
          error:
            "Você não possui Pacotes Supremos disponíveis! O Pacote Supremo não pode ser comprado com Ouro — conquiste vitórias especiais na Campanha PvE ou resgate em eventos para obtê-lo.",
          cards: [],
          remainingGold: user.gold,
          remainingBasicPacks: currentBasicPacks,
          remainingAdvancedPacks: currentAdvancedPacks,
          remainingSupremePacks: 0,
          packType: normalizedType,
        };
      }
    } else if (!useFreeBasicPack && !useFreeAdvancedPack && user.gold < cost) {
      return {
        success: false,
        error: `Ouro insuficiente! Você precisa de ${cost} de Ouro para o ${
          normalizedType === "ADVANCED" ? "Pacote Avançado" : "Pacote Básico"
        }, mas possui apenas ${user.gold}.`,
        cards: [],
        remainingGold: user.gold,
        remainingBasicPacks: currentBasicPacks,
        remainingAdvancedPacks: currentAdvancedPacks,
        remainingSupremePacks: currentSupremePacks,
        packType: normalizedType,
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
        remainingSupremePacks: currentSupremePacks,
        packType: normalizedType,
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

    // 4. Sortear 5 cartas usando a tabela de probabilidades do pacote
    const selectedCards: Card[] = [];
    for (let i = 0; i < 5; i++) {
      const rolledRarity = rollRarityForPack(normalizedType);

      let pool = cardsByRarity[rolledRarity];
      if (!pool || pool.length === 0) {
        pool = allCatalogCards;
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      selectedCards.push(pool[randomIndex]);
    }

    // 5. Débito Atômico no Banco (Pacote Grátis em Posse, SupremePacks ou Ouro)
    let updatedUser: typeof users.$inferSelect;

    if (isSupreme) {
      const updatedUsers = await db
        .update(users)
        .set({ supremePacks: sql`${users.supremePacks} - 1` })
        .where(sql`${users.id} = ${user.id} AND ${users.supremePacks} >= 1`)
        .returning();

      if (updatedUsers.length === 0) {
        return {
          success: false,
          error: "Nenhum Pacote Supremo disponível no momento da abertura.",
          cards: [],
          remainingGold: user.gold,
          remainingBasicPacks: currentBasicPacks,
          remainingAdvancedPacks: currentAdvancedPacks,
          remainingSupremePacks: 0,
          packType: normalizedType,
        };
      }
      updatedUser = updatedUsers[0];
    } else if (useFreeBasicPack) {
      const updatedUsers = await db
        .update(users)
        .set({ basicPacks: sql`${users.basicPacks} - 1` })
        .where(sql`${users.id} = ${user.id} AND ${users.basicPacks} >= 1`)
        .returning();

      if (updatedUsers.length === 0) {
        return {
          success: false,
          error: "Nenhum Pacote Básico grátis disponível no momento da abertura.",
          cards: [],
          remainingGold: user.gold,
          remainingBasicPacks: 0,
          remainingAdvancedPacks: currentAdvancedPacks,
          remainingSupremePacks: currentSupremePacks,
          packType: normalizedType,
        };
      }
      updatedUser = updatedUsers[0];
    } else if (useFreeAdvancedPack) {
      const updatedUsers = await db
        .update(users)
        .set({ advancedPacks: sql`${users.advancedPacks} - 1` })
        .where(sql`${users.id} = ${user.id} AND ${users.advancedPacks} >= 1`)
        .returning();

      if (updatedUsers.length === 0) {
        return {
          success: false,
          error: "Nenhum Pacote Avançado grátis disponível no momento da abertura.",
          cards: [],
          remainingGold: user.gold,
          remainingBasicPacks: currentBasicPacks,
          remainingAdvancedPacks: 0,
          remainingSupremePacks: currentSupremePacks,
          packType: normalizedType,
        };
      }
      updatedUser = updatedUsers[0];
    } else {
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
          remainingBasicPacks: currentBasicPacks,
          remainingAdvancedPacks: currentAdvancedPacks,
          remainingSupremePacks: currentSupremePacks,
          packType: normalizedType,
        };
      }
      updatedUser = updatedUsers[0];
    }

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

    const existingMap = new Map<string, (typeof existingUserCards)[0]>();
    for (const uc of existingUserCards) {
      existingMap.set(uc.cardId, uc);
    }

    const finalDrawnCards: DrawnCard[] = [];

    // Atualizar coleção (user_cards) com múltiplas cópias baseadas na raridade
    for (const card of selectedCards) {
      const existing = existingMap.get(card.id);
      const copiesGranted = rollPackCopiesByRarity(card.rarity, normalizedType);

      if (existing) {
        const nextQuantity = existing.quantity + copiesGranted;
        const currentLevel = existing.level || 1;
        await db
          .update(userCards)
          .set({ quantity: nextQuantity })
          .where(eq(userCards.id, existing.id));

        existing.quantity = nextQuantity;

        const scaledCard = applyCardLevelScaling(card, currentLevel);
        finalDrawnCards.push({
          ...scaledCard,
          isNew: false,
          newQuantity: nextQuantity,
          copiesGranted,
          level: currentLevel,
        });
      } else {
        const [newUserCard] = await db
          .insert(userCards)
          .values({
            userId: user.id,
            cardId: card.id,
            quantity: copiesGranted,
            level: 1,
          })
          .returning();

        existingMap.set(card.id, newUserCard);

        const scaledCard = applyCardLevelScaling(card, 1);
        finalDrawnCards.push({
          ...scaledCard,
          isNew: true,
          newQuantity: copiesGranted,
          copiesGranted,
          level: 1,
        });
      }
    }

    try {
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // Ignora erro de revalidação fora do ciclo do Next.js
    }

    return {
      success: true,
      cards: finalDrawnCards,
      remainingGold: updatedUser.gold,
      remainingBasicPacks: updatedUser.basicPacks ?? 0,
      remainingAdvancedPacks: updatedUser.advancedPacks ?? 0,
      remainingSupremePacks: updatedUser.supremePacks ?? 0,
      packType: normalizedType,
    };
  } catch (error) {
    console.error("Erro na transação de abertura de pacote:", error);
    return {
      success: false,
      error: "Ocorreu um erro ao processar a abertura do pacote no servidor.",
      cards: [],
      remainingGold: 0,
      remainingSupremePacks: 0,
      packType,
    };
  }
}
