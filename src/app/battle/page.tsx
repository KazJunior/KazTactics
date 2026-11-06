import { db } from "@/db";
import { cards, users, userCards, campaignStages } from "@/db/schema";
import { Navbar } from "@/components/Navbar";
import { BattlefieldView } from "@/components/battle/BattlefieldView";
import { getEffectiveUser } from "@/lib/auth";
import { applyCardLevelScaling } from "@/lib/cardProgression";
import { eq, sql } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campo de Batalha Tático - KazTactics",
  description:
    "Tabuleiro tático 11x7 com cálculo de movimento, linha de visão, arremesso e destruição de núcleos.",
};

export const dynamic = "force-dynamic";

interface BattlePageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function BattlePage({ searchParams }: BattlePageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedStageNumber = resolvedSearchParams.stage
    ? parseInt(resolvedSearchParams.stage, 10)
    : 1;

  let user = null;
  let allCards: (typeof cards.$inferSelect)[] = [];
  let currentStage = null;

  try {
    const [fetchedCards, currentUser, fetchedStages] = await Promise.all([
      db.select().from(cards),
      getEffectiveUser(),
      db
        .select()
        .from(campaignStages)
        .where(eq(campaignStages.stageNumber, requestedStageNumber))
        .limit(1),
    ]);

    allCards = fetchedCards;
    user = currentUser;
    currentStage = fetchedStages[0] || null;

    if (user) {
      await db.execute(
        sql`ALTER TABLE "user_cards" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;`
      );
      const ownedRows = await db
        .select()
        .from(userCards)
        .where(eq(userCards.userId, user.id));
      const levelMap = new Map<string, number>();
      for (const row of ownedRows) {
        levelMap.set(row.cardId, row.level || 1);
      }
      allCards = fetchedCards.map((c) =>
        applyCardLevelScaling(c, levelMap.get(c.id) || 1)
      );
    }

    if (!currentStage) {
      const fallback = await db.select().from(campaignStages).limit(1);
      currentStage = fallback[0] || null;
    }
  } catch (error) {
    console.error("Erro ao carregar dados da batalha:", error);
  }

  return (
    <div className="relative min-h-screen text-[#F8FAFC] overflow-hidden bg-[#09090B]">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "EstrategistaKaz"}
        initialAvatarName={user?.avatarCardName ?? "Lobo Cinzento Caçador"}
      />

      <main className="relative z-10 max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-2 md:py-3">
        <BattlefieldView
          sampleCards={allCards}
          stageName={currentStage?.name}
          stageNumber={currentStage?.stageNumber}
          initialAiHp={currentStage?.aiCoreHp}
          goldReward={currentStage?.goldReward}
          initialAvatarName={user?.avatarCardName ?? "Lobo Cinzento Caçador"}
        />
      </main>
    </div>
  );
}
