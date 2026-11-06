"use server";

import { db } from "@/db";
import { cards, users, userCards, decks, deckCards, Card } from "@/db/schema";
import { getEffectiveUser } from "@/lib/auth";
import { eq, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  MAX_CARD_LEVEL,
  STAT_BONUS_PER_LEVEL,
  getUpgradeRequirement,
  applyCardLevelScaling,
  ScaledCard,
} from "@/lib/cardProgression";
import { syncExpandedCardsToDb } from "@/lib/syncExpandedCards";

export interface DeckCardInput {
  cardId: string;
  quantity: number;
}

export interface UserCollectionItem {
  card: ScaledCard;
  ownedQuantity: number;
  level: number;
}

export interface DeckbuilderData {
  user: typeof users.$inferSelect;
  activeDeck: {
    id: string;
    name: string;
    isActive: boolean;
    cards: {
      card: ScaledCard;
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
    await syncExpandedCardsToDb();
    const user = await getEffectiveUser();
    if (!user) return null;

    // Garantir coluna level em user_cards
    await db.execute(
      sql`ALTER TABLE "user_cards" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;`
    );

    // 1. Obter coleção do jogador (user_cards com dados de cards e nível)
    const rawCollection = await db
      .select({
        card: cards,
        ownedQuantity: userCards.quantity,
        level: userCards.level,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.id))
      .where(eq(userCards.userId, user.id));

    const levelByCardId = new Map<string, number>();
    const scaledCollection: UserCollectionItem[] = rawCollection.map((item) => {
      const lvl = item.level || 1;
      levelByCardId.set(item.card.id, lvl);
      return {
        card: applyCardLevelScaling(item.card, lvl),
        ownedQuantity: item.ownedQuantity,
        level: lvl,
      };
    });

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
        cards: rawDeckCards.map((dc) => ({
          card: applyCardLevelScaling(
            dc.card,
            levelByCardId.get(dc.card.id) || 1
          ),
          quantity: dc.quantity,
        })),
      };
    }

    return {
      user,
      activeDeck,
      collection: scaledCollection,
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
    const user = await getEffectiveUser();
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
      // Se a carta já foi evoluída (level > 1), o jogador já investiu cópias nela e pode alocar até pelo menos 4 no deck
      const maxAllocatable = Math.max(
        uc.quantity,
        (uc.level || 1) > 1 ? 4 : uc.quantity
      );
      ownedMap.set(uc.cardId, maxAllocatable);
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

/**
 * Evolui o nível de uma carta do jogador (Nível 1 até 10) consumindo cópias e Ouro.
 * Cada nível aumenta os status da carta em +10%.
 */
export async function upgradeCardLevelAction(cardId: string) {
  try {
    const user = await getEffectiveUser();
    if (!user) {
      return { success: false, error: "Usuário não encontrado." };
    }

    await db.execute(
      sql`ALTER TABLE "user_cards" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;`
    );

    const rows = await db
      .select({
        userCard: userCards,
        card: cards,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.id))
      .where(
        sql`${userCards.userId} = ${user.id} AND ${userCards.cardId} = ${cardId}`
      )
      .limit(1);

    if (rows.length === 0) {
      return {
        success: false,
        error: "Você ainda não possui esta carta na sua coleção.",
      };
    }

    const { userCard, card } = rows[0];
    const currentLevel = userCard.level || 1;

    if (currentLevel >= MAX_CARD_LEVEL) {
      return {
        success: false,
        error: `"${card.name}" já atingiu o Nível Máximo (${MAX_CARD_LEVEL})!`,
      };
    }

    const req = getUpgradeRequirement(currentLevel);
    if (!req) {
      return {
        success: false,
        error: "Requisito de evolução não encontrado para este nível.",
      };
    }

    if (userCard.quantity < req.copiesRequired) {
      return {
        success: false,
        error: `Cópias insuficientes para evoluir "${card.name}": você possui ${userCard.quantity}/${req.copiesRequired} cópias.`,
      };
    }

    if (user.gold < req.goldCost) {
      return {
        success: false,
        error: `Ouro insuficiente! São necessários ${req.goldCost} de Ouro para evoluir para o Nível ${req.toLevel} (você possui ${user.gold} Ouro).`,
      };
    }

    // 1. Debitar Ouro atomicamente
    const updatedUsers = await db
      .update(users)
      .set({ gold: sql`${users.gold} - ${req.goldCost}` })
      .where(sql`${users.id} = ${user.id} AND ${users.gold} >= ${req.goldCost}`)
      .returning();

    if (updatedUsers.length === 0) {
      return {
        success: false,
        error: "Ouro insuficiente no momento da evolução.",
      };
    }

    const nextGold = updatedUsers[0].gold;
    const nextLevel = req.toLevel;
    const nextQuantity = Math.max(0, userCard.quantity - req.copiesRequired);

    // 2. Atualizar nível e cópias restantes em user_cards
    await db
      .update(userCards)
      .set({
        level: nextLevel,
        quantity: nextQuantity,
      })
      .where(eq(userCards.id, userCard.id));

    const updatedCard = applyCardLevelScaling(card, nextLevel);

    try {
      revalidatePath("/deckbuilder");
      revalidatePath("/battle");
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // ignora fora do ciclo Next.js
    }

    return {
      success: true,
      cardId: card.id,
      newLevel: nextLevel,
      newQuantity: nextQuantity,
      remainingGold: nextGold,
      updatedCard,
      message: `⬆️ "${card.name}" evoluiu para o Nível ${nextLevel}! (+${Math.round(
        (nextLevel - 1) * STAT_BONUS_PER_LEVEL * 100
      )}% de Status Totais)`,
    };
  } catch (error) {
    console.error("Erro ao evoluir carta:", error);
    return {
      success: false,
      error: "Erro interno ao evoluir o nível da carta.",
    };
  }
}

