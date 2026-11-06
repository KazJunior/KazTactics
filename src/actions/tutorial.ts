"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getEffectiveUser } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function ensureTutorialAndPacksColumns() {
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
}

export interface TutorialCompletionResult {
  success: boolean;
  alreadyCompleted?: boolean;
  error?: string;
  grantedPacks?: {
    basic: number;
    advanced: number;
    supreme: number;
    total: number;
  };
  userPacks?: {
    basicPacks: number;
    advancedPacks: number;
    supremePacks: number;
  };
}

/**
 * Finaliza ou pula o tutorial de conta nova (pode ser executado apenas UMA única vez por conta nova)
 * e concede os 10 pacotes iniciais: 6 Básicos, 3 Avançados e 1 Supremo.
 */
export async function completeOrSkipTutorialAction(
  mode: "COMPLETED" | "SKIPPED" = "COMPLETED"
): Promise<TutorialCompletionResult> {
  try {
    await ensureTutorialAndPacksColumns();
    const user = await getEffectiveUser();

    if (!user) {
      return {
        success: false,
        error: "Nenhum comandante autenticado encontrado.",
      };
    }

    if (user.tutorialCompleted) {
      return {
        success: false,
        alreadyCompleted: true,
        error:
          "Este tutorial é exclusivo para contas novas e já foi finalizado ou pulado nesta conta.",
      };
    }

    // Atualização atômica garantindo que a recompensa de 10 pacotes só possa ser recebida 1 vez
    const updatedRows = await db
      .update(users)
      .set({
        tutorialCompleted: true,
        basicPacks: sql`${users.basicPacks} + 6`,
        advancedPacks: sql`${users.advancedPacks} + 3`,
        supremePacks: sql`${users.supremePacks} + 1`,
      })
      .where(
        sql`${users.id} = ${user.id} AND ${users.tutorialCompleted} = false`
      )
      .returning();

    if (updatedRows.length === 0) {
      return {
        success: false,
        alreadyCompleted: true,
        error: "O tutorial já foi concluído anteriormente nesta conta.",
      };
    }

    const updated = updatedRows[0];

    try {
      revalidatePath("/");
      revalidatePath("/tutorial");
      revalidatePath("/shop");
      revalidatePath("/battle");
    } catch {
      // ignore outside Next request context
    }

    return {
      success: true,
      grantedPacks: {
        basic: 6,
        advanced: 3,
        supreme: 1,
        total: 10,
      },
      userPacks: {
        basicPacks: updated.basicPacks,
        advancedPacks: updated.advancedPacks,
        supremePacks: updated.supremePacks,
      },
    };
  } catch (error) {
    console.error(`Erro ao processar tutorial (${mode}):`, error);
    return {
      success: false,
      error: "Não foi possível concluir o registro do tutorial no servidor.",
    };
  }
}

