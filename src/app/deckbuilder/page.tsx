import { getDeckbuilderData } from "@/actions/deck";
import { Navbar } from "@/components/Navbar";
import { DeckbuilderView } from "@/components/deckbuilder/DeckbuilderView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deckbuilder Tático - KazTactics",
  description:
    "Construa e valide seus baralhos táticos de 30 cartas (20 Monstros e 10 Feitiços) integrados ao NeonDB.",
};

export const dynamic = "force-dynamic";

export default async function DeckbuilderPage() {
  const data = await getDeckbuilderData();

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-rose-400">
            Nenhum dado de jogador encontrado
          </h2>
          <p className="text-xs text-slate-400">
            Por favor, execute o seed inicial do banco para carregar a coleção.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <Navbar gold={data.user.gold} username={data.user.username} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <DeckbuilderView initialData={data} />
      </main>
    </div>
  );
}

