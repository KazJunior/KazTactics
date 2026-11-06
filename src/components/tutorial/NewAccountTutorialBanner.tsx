"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completeOrSkipTutorialAction } from "@/actions/tutorial";
import { Sparkles, Play, FastForward, Gift } from "lucide-react";

export function NewAccountTutorialBanner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSkipDirectly = () => {
    startTransition(async () => {
      const res = await completeOrSkipTutorialAction("SKIPPED");
      if (res.success) {
        router.push("/shop");
        router.refresh();
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#FACC15] bg-gradient-to-r from-[#2E1065] via-[#1E1B4B] to-[#3B0764] p-6 md:p-8 shadow-[0_0_35px_rgba(250,204,21,0.3)]">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#451A03] border border-[#FACC15] text-[#FEF08A] text-xs font-gothic font-black uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-[#FACC15]" /> Exclusivo para Conta Nova &bull; Recompensa: 10 Pacotes
          </div>
          <h2 className="text-2xl md:text-3xl font-gothic font-black text-white">
            Treinamento Tático de Novo Comandante Disponível!
          </h2>
          <p className="font-parchment text-sm md:text-base text-[#E2E8F0] max-w-2xl">
            Aprenda rapidamente como invocar criaturas, usar as <strong>2 ações por turno</strong>, ativar <strong>habilidades únicas</strong>, respeitar os limites de <strong>Mana (15) e Monstros (4)</strong> e destruir o Núcleo Inimigo. Ao terminar ou pular o tutorial, você ganhará{" "}
            <strong className="text-[#FACC15]">
              10 Pacotes (6 Básicos, 3 Avançados e 1 Supremo)
            </strong>!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            href="/tutorial"
            className="btn-iron-torch flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-gothic font-black text-xs tracking-wide cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Tutorial</span>
          </Link>

          <button
            type="button"
            disabled={isPending}
            onClick={handleSkipDirectly}
            className="btn-iron flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-gothic font-bold text-xs text-[#FEF08A] border-[#FACC15]/60 cursor-pointer disabled:opacity-50"
          >
            <FastForward className="w-4 h-4 text-[#FACC15]" />
            <span>
              {isPending ? "Creditando..." : "Pular e Resgatar 10 Pacotes"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

