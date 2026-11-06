import { Navbar } from "@/components/Navbar";
import { getEffectiveUser } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { Metadata } from "next";
import { Sparkles, Swords, Shield, KeyRound, UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Login de Comandante - KazTactics",
  description: "Acesse sua conta para comandar suas criaturas e baralhos táticos.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getEffectiveUser();

  return (
    <div className="min-h-screen text-[#F8FAFC] flex flex-col justify-between">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "Comandante"}
        initialAvatarName={user?.avatarCardName ?? "Lobo Cinzento Caçador"}
      />

      <main className="flex-1 flex items-center justify-center p-4">
        {/* Renderiza o formulário de Login centralizado */}
        <AuthModal
          isOpen={true}
          onClose={() => {}}
          initialMode="login"
        />
      </main>

      <footer className="text-center py-4 text-xs font-parchment text-[#94A3B8]">
        KazTactics © 2026 — Jogo Tático em Turnos com Deckbuilder
      </footer>
    </div>
  );
}
