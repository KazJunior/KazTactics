import { Navbar } from "@/components/Navbar";
import { getEffectiveUser } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar Comandante - KazTactics",
  description: "Crie sua conta para receber 500 ouro e baralho inicial de 30 cartas.",
};

export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const user = await getEffectiveUser();

  return (
    <div className="min-h-screen text-[#F8FAFC] flex flex-col justify-between">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "Comandante"}
        initialAvatarName={user?.avatarCardName ?? "Lobo Cinzento Caçador"}
      />

      <main className="flex-1 flex items-center justify-center p-4">
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          initialMode="register"
        />
      </main>

      <footer className="text-center py-4 text-xs font-parchment text-[#94A3B8]">
        KazTactics © 2026 — Jogo Tático em Turnos com Deckbuilder
      </footer>
    </div>
  );
}
