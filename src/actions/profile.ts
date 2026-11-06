"use server";

import { db } from "@/db";
import { cards, users, userCards, Card } from "@/db/schema";
import { getEffectiveUser } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface UnlockedCreatureAvatar {
  id: string;
  name: string;
  type: string;
  category: string;
  rarity: string;
  quantity: number;
}

export interface PlayerProfileAvatarData {
  username: string;
  gold: number;
  avatarCardName: string;
  avatarCardType: string;
  unlockedCreatures: UnlockedCreatureAvatar[];
}

let columnEnsured = false;

async function ensureAvatarColumn() {
  if (columnEnsured) return;
  try {
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_card_name" varchar(120) DEFAULT 'Lobo Cinzento Caçador' NOT NULL`
    );
    columnEnsured = true;
  } catch (err) {
    // Column already exists or minor notice
    columnEnsured = true;
  }
}

/**
 * Busca os dados de perfil do jogador e todas as criaturas (MONSTRO) desbloqueadas na sua coleção
 */
export async function getPlayerAvatarDataAction(): Promise<PlayerProfileAvatarData | null> {
  try {
    await ensureAvatarColumn();

    const user = await getEffectiveUser();
    if (!user) return null;

    const rawUnlocked = await db
      .select({
        card: cards,
        quantity: userCards.quantity,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.id))
      .where(sql`${userCards.userId} = ${user.id} AND ${userCards.quantity} > 0`);

    const unlockedCreatures: UnlockedCreatureAvatar[] = rawUnlocked
      .filter((item) => item.card.category === "MONSTRO")
      .map((item) => ({
        id: item.card.id,
        name: item.card.name,
        type: item.card.type,
        category: item.card.category,
        rarity: item.card.rarity,
        quantity: item.quantity,
      }));

    const currentAvatarName =
      user.avatarCardName ||
      unlockedCreatures[0]?.name ||
      "Lobo Cinzento Caçador";

    const matchedCreature = unlockedCreatures.find(
      (c) => c.name === currentAvatarName
    );

    return {
      username: user.username,
      gold: user.gold,
      avatarCardName: currentAvatarName,
      avatarCardType: matchedCreature?.type || "BESTIAIS",
      unlockedCreatures,
    };
  } catch (error) {
    console.error("Erro ao buscar dados de avatar do jogador:", error);
    return null;
  }
}

/**
 * Atualiza a criatura escolhida como foto de perfil do jogador (apenas criaturas desbloqueadas)
 */
export async function updatePlayerAvatarAction(cardName: string): Promise<{
  success: boolean;
  avatarCardName?: string;
  avatarCardType?: string;
  error?: string;
}> {
  try {
    await ensureAvatarColumn();

    const user = await getEffectiveUser();
    if (!user) {
      return { success: false, error: "Jogador não encontrado." };
    }

    // Verifica se a criatura existe e está desbloqueada pelo jogador em user_cards
    const unlockedMatch = await db
      .select({
        card: cards,
        quantity: userCards.quantity,
      })
      .from(userCards)
      .innerJoin(cards, eq(userCards.cardId, cards.id))
      .where(
        sql`${userCards.userId} = ${user.id} AND ${cards.name} = ${cardName} AND ${userCards.quantity} > 0`
      )
      .limit(1);

    if (unlockedMatch.length === 0) {
      return {
        success: false,
        error: "Você precisa desbloquear esta criatura antes de usá-la como foto de perfil.",
      };
    }

    const chosenCard = unlockedMatch[0].card;

    await db
      .update(users)
      .set({ avatarCardName: chosenCard.name })
      .where(eq(users.id, user.id));

    try {
      revalidatePath("/");
      revalidatePath("/battle");
      revalidatePath("/campaign");
      revalidatePath("/deckbuilder");
      revalidatePath("/shop");
    } catch {
      // Ignora fora do contexto Next.js
    }

    return {
      success: true,
      avatarCardName: chosenCard.name,
      avatarCardType: chosenCard.type,
    };
  } catch (error) {
    console.error("Erro ao atualizar foto de perfil:", error);
    return {
      success: false,
      error: "Não foi possível salvar a foto de perfil no banco de dados.",
    };
  }
}

