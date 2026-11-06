"use server";

import { db } from "@/db";
import { users, campaignStages } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface StageClearResult {
  success: boolean;
  error?: string;
  newGold?: number;
  newStage?: number;
  rewardEarned?: number;
}

/**
 * Concede a recompensa em ouro da fase vencida e avança o estágio do jogador no NeonDB
 */
export async function claimStageVictoryAction(
  stageNumber: number
): Promise<StageClearResult> {
  try {
    const [user] = await db.select().from(users).limit(1);
    if (!user) {
      return { success: false, error: "Jogador não encontrado." };
    }

    // Buscar a recompensa configurada da fase
    const [stage] = await db
      .select()
      .from(campaignStages)
      .where(eq(campaignStages.stageNumber, stageNumber))
      .limit(1);

    const goldReward = stage ? stage.goldReward : 100 * stageNumber;
    const nextStage = Math.max(user.currentStage, stageNumber + 1);

    const [updatedUser] = await db
      .update(users)
      .set({
        gold: sql`${users.gold} + ${goldReward}`,
        currentStage: nextStage,
      })
      .where(eq(users.id, user.id))
      .returning();

    try {
      revalidatePath("/battle");
      revalidatePath("/shop");
      revalidatePath("/");
    } catch {
      // Ignora erro fora de contexto Next.js (CLI)
    }

    return {
      success: true,
      newGold: updatedUser.gold,
      newStage: updatedUser.currentStage,
      rewardEarned: goldReward,
    };
  } catch (error) {
    console.error("Erro ao creditar recompensa da fase:", error);
    return {
      success: false,
      error: "Falha ao persistir vitória da fase no NeonDB.",
    };
  }
}

