import { db } from "@/db";
import { campaignStages, users } from "@/db/schema";
import { Navbar } from "@/components/Navbar";
import { CampaignMap } from "@/components/campaign/CampaignMap";
import { getEffectiveUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campanha PvE - KazTactics",
  description:
    "Mapa de fases da campanha PvE com progressão contínua, núcleos da IA e recompensas em ouro integradas ao NeonDB.",
};

export const dynamic = "force-dynamic";

export default async function CampaignPage() {
  let user = null;
  let stages: (typeof campaignStages.$inferSelect)[] = [];

  try {
    const [fetchedStages, currentUser] = await Promise.all([
      db.select().from(campaignStages),
      getEffectiveUser(),
    ]);

    stages = fetchedStages;
    user = currentUser;
  } catch (error) {
    console.error("Erro ao carregar estágios da campanha:", error);
  }

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "EstrategistaKaz"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <CampaignMap
          stages={stages}
          currentStage={user?.currentStage ?? 1}
          userGold={user?.gold ?? 500}
        />
      </main>
    </div>
  );
}

