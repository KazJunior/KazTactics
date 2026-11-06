import { db } from "@/db";
import { cards, users, campaignStages } from "@/db/schema";
import { Navbar } from "@/components/Navbar";
import { BattlefieldView } from "@/components/battle/BattlefieldView";
import { eq } from "drizzle-orm";
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
    const [fetchedCards, fetchedUsers, fetchedStages] = await Promise.all([
      db.select().from(cards),
      db.select().from(users).limit(1),
      db
        .select()
        .from(campaignStages)
        .where(eq(campaignStages.stageNumber, requestedStageNumber))
        .limit(1),
    ]);

    allCards = fetchedCards;
    user = fetchedUsers[0] || null;
    currentStage = fetchedStages[0] || null;

    // Fallback se a fase solicitada não existir
    if (!currentStage) {
      const fallback = await db.select().from(campaignStages).limit(1);
      currentStage = fallback[0] || null;
    }
  } catch (error) {
    console.error("Erro ao carregar dados da batalha:", error);
  }

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "EstrategistaKaz"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <BattlefieldView
          sampleCards={allCards}
          stageName={currentStage?.name}
          stageNumber={currentStage?.stageNumber}
          initialAiHp={currentStage?.aiCoreHp}
          goldReward={currentStage?.goldReward}
        />
      </main>
    </div>
  );
}
