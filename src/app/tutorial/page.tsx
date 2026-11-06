import { db } from "@/db";
import { cards } from "@/db/schema";
import { Navbar } from "@/components/Navbar";
import { getEffectiveUser } from "@/lib/auth";
import { ensureTutorialAndPacksColumns } from "@/actions/tutorial";
import { TutorialBattleView } from "@/components/tutorial/TutorialBattleView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial Tático de Recrutas - KazTactics",
  description:
    "Aprenda a invocar criaturas, gerenciar ações, habilidades, limites de monstros e mana, e conquiste 10 pacotes iniciais.",
};

export const dynamic = "force-dynamic";

export default async function TutorialPage() {
  let user = null;
  let allCards: (typeof cards.$inferSelect)[] = [];

  try {
    await ensureTutorialAndPacksColumns();
    const [fetchedCards, currentUser] = await Promise.all([
      db.select().from(cards),
      getEffectiveUser(),
    ]);
    allCards = fetchedCards;
    user = currentUser;
  } catch (error) {
    console.error("Erro ao carregar página de tutorial:", error);
  }

  const isAlreadyCompleted = user ? Boolean(user.tutorialCompleted) : false;

  return (
    <div className="min-h-screen text-[#F8FAFC] bg-[#09090B]">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "Recruta"}
        initialAvatarName={user?.avatarCardName ?? "Lobo Cinzento Caçador"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <TutorialBattleView
          username={user?.username ?? "Recruta"}
          isAlreadyCompleted={isAlreadyCompleted}
          sampleCards={allCards}
        />
      </main>
    </div>
  );
}

