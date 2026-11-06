"use server";

import { db } from "@/db";
import { users, campaignStages } from "@/db/schema";
import { getEffectiveUser } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface StageClearResult {
  success: boolean;
  error?: string;
  newGold?: number;
  newStage?: number;
  rewardEarned?: number;
  supremePackGranted?: boolean;
}

/**
 * Concede a recompensa em ouro da fase vencida (+1 Pacote Supremo especial) e avança o estágio do jogador no NeonDB
 */
export async function claimStageVictoryAction(
  stageNumber: number
): Promise<StageClearResult> {
  try {
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "supreme_packs" integer DEFAULT 1 NOT NULL;`
    );
    const user = await getEffectiveUser();
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
        supremePacks: sql`${users.supremePacks} + 1`,
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
      supremePackGranted: true,
    };
  } catch (error) {
    console.error("Erro ao creditar recompensa da fase:", error);
    return {
      success: false,
      error: "Falha ao persistir vitória da fase no NeonDB.",
    };
  }
}

