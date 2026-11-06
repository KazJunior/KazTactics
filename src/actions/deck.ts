"use server";

import { db } from "@/db";
import { cards, users, userCards, decks, deckCards, Card } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface DeckCardInput {
  cardId: string;
  quantity: number;
}

export interface UserCollectionItem {
  card: Card;
  ownedQuantity: number;
}

export interface DeckbuilderData {
  user: typeof users.$inferSelect;
  activeDeck: {
    id: string;
    name: string;
    isActive: boolean;
    cards: {
      card: Card;
      quantity: number;
    }[];
  } | null;
  collection: UserCollectionItem[];
}

/**
 * Obtém a coleção do jogador e o deck ativo atual
 */
export async function getDeckbuilderData(): Promise<DeckbuilderData | null> {
  try {
    const [user] = await db.select().from(users).limit(1);
    if (!user) return null;

    // 1. Obter coleção do jogador (user_cards com dados de cards)
    const rawCollection = await db
      .select({
        card: cards,
        ownedQuantity: userCards.quantity,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.id))
      .where(eq(userCards.userId, user.id));

    // 2. Obter deck ativo
    const activeDeckList = await db
      .select()
      .from(decks)
      .where(sql`${decks.userId} = ${user.id} AND ${decks.isActive} = true`)
      .limit(1);

    let activeDeck = null;

    if (activeDeckList.length > 0) {
      const d = activeDeckList[0];
      const rawDeckCards = await db
        .select({
          card: cards,
          quantity: deckCards.quantity,
        })
        .from(deckCards)
        .innerJoin(cards, eq(deckCards.cardId, cards.id))
        .where(eq(deckCards.deckId, d.id));

      activeDeck = {
        id: d.id,
        name: d.name,
        isActive: d.isActive,
        cards: rawDeckCards,
      };
    }

    return {
      user,
      activeDeck,
      collection: rawCollection,
    };
  } catch (error) {
    console.error("Erro ao carregar dados do Deckbuilder:", error);
    return null;
  }
}

/**
 * Valida rigorosamente e salva o baralho no NeonDB
 */
export async function saveDeckAction(payload: {
  deckId?: string;
  name: string;
  cards: DeckCardInput[];
}) {
  try {
    const [user] = await db.select().from(users).limit(1);
    if (!user) {
      return { success: false, error: "Usuário não encontrado." };
    }

    if (!payload.name || payload.name.trim().length === 0) {
      return { success: false, error: "O nome do baralho não pode estar vazio." };
    }

    // 1. Obter detalhes das cartas enviadas
    const cardIds = payload.cards.map((c) => c.cardId);
    if (cardIds.length === 0) {
      return { success: false, error: "O baralho não contém cartas." };
    }

    const fetchedCards = await db
      .select()
      .from(cards)
      .where(inArray(cards.id, cardIds));

    const cardMap = new Map<string, Card>();
    for (const c of fetchedCards) {
      cardMap.set(c.id, c);
    }

    // 2. Obter quantidade que o usuário possui na coleção para validação estrita
    const userOwnedCards = await db
      .select()
      .from(userCards)
      .where(
        sql`${userCards.userId} = ${user.id} AND ${inArray(
          userCards.cardId,
          cardIds
        )}`
      );

    const ownedMap = new Map<string, number>();
    for (const uc of userOwnedCards) {
      ownedMap.set(uc.cardId, uc.quantity);
    }

    // 3. Validação das Regras Estritas do Jogo
    let totalCardsCount = 0;
    let monsterCardsCount = 0;
    let spellCardsCount = 0;

    for (const item of payload.cards) {
      if (item.quantity <= 0) continue;

      const card = cardMap.get(item.cardId);
      if (!card) {
        return {
          success: false,
          error: `Carta inválida ou inexistente no catálogo (ID: ${item.cardId}).`,
        };
      }

      const owned = ownedMap.get(item.cardId) || 0;
      if (item.quantity > owned) {
        return {
          success: false,
          error: `Quantidade inválida para "${card.name}": você possui ${owned} cópia(s), mas tentou alocar ${item.quantity}.`,
        };
      }

      totalCardsCount += item.quantity;
      if (card.category === "MONSTRO") {
        monsterCardsCount += item.quantity;
      } else if (card.category === "FEITICO") {
        spellCardsCount += item.quantity;
      }
    }

    // Validação estrita: 30 no total, 20 monstros, 10 feitiços
    if (totalCardsCount !== 30) {
      return {
        success: false,
        error: `Regra violada: O baralho deve conter EXATAMENTE 30 cartas (atual: ${totalCardsCount}/30).`,
      };
    }

    if (monsterCardsCount !== 20) {
      return {
        success: false,
        error: `Regra violada: O baralho deve conter EXATAMENTE 20 Monstros (atual: ${monsterCardsCount}/20).`,
      };
    }

    if (spellCardsCount !== 10) {
      return {
        success: false,
        error: `Regra violada: O baralho deve conter EXATAMENTE 10 Feitiços (atual: ${spellCardsCount}/10).`,
      };
    }

    // 4. Salvar no NeonDB
    let targetDeckId = payload.deckId;

    if (targetDeckId) {
      // Atualizar nome do deck existente
      await db
        .update(decks)
        .set({ name: payload.name.trim() })
        .where(eq(decks.id, targetDeckId));
    } else {
      // Criar novo deck e definir como ativo
      const [newDeck] = await db
        .insert(decks)
        .values({
          userId: user.id,
          name: payload.name.trim(),
          isActive: true,
        })
        .returning();
      targetDeckId = newDeck.id;
    }

    // Atualizar as cartas do deck (apaga as anteriores e insere as novas)
    await db.delete(deckCards).where(eq(deckCards.deckId, targetDeckId));

    const insertDeckCardsPayload = payload.cards
      .filter((c) => c.quantity > 0)
      .map((c) => ({
        deckId: targetDeckId!,
        cardId: c.cardId,
        quantity: c.quantity,
      }));

    if (insertDeckCardsPayload.length > 0) {
      await db.insert(deckCards).values(insertDeckCardsPayload);
    }

    try {
      revalidatePath("/deckbuilder");
      revalidatePath("/");
    } catch {
      // Ignora erro fora de contexto Next.js (scripts CLI)
    }

    return {
      success: true,
      deckId: targetDeckId,
      message: `Baralho "${payload.name.trim()}" salvo e validado com sucesso! (30 cartas: 20 Monstros e 10 Feitiços)`,
    };
  } catch (error) {
    console.error("Erro ao salvar baralho:", error);
    return {
      success: false,
      error: "Ocorreu uma falha no servidor ao persistir o baralho no NeonDB.",
    };
  }
}

