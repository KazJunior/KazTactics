"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { GameOverState } from "@/lib/tactics/endGame";
import { claimStageVictoryAction } from "@/actions/battle";
import {
  Trophy,
  Skull,
  Coins,
  RotateCcw,
  Swords,
  ArrowRight,
  Shield,
  Flame,
  CheckCircle2,
} from "lucide-react";
import {
  WarTableDagger,
  RedWaxSeal,
} from "../campaign/ExpeditionStageIcons";

interface GameOverModalProps {
  gameOverState: GameOverState;
  stageNumber: number;
  stageName: string;
  goldReward: number;
  turnNumber: number;
  onRestartBattle: () => void;
}

export function GameOverModal({
  gameOverState,
  stageNumber,
  stageName,
  goldReward,
  turnNumber,
  onRestartBattle,
}: GameOverModalProps) {
  const isVictory = gameOverState.winner === "PLAYER";
  const [claimedReward, setClaimedReward] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClaimReward = () => {
    startTransition(async () => {
      const res = await claimStageVictoryAction(stageNumber);
      if (res.success && res.rewardEarned) {
        setClaimedReward(res.rewardEarned);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Container do Pergaminho / Relatório de Batalha de Darkest Dungeon */}
      <div
        className={`w-full max-w-xl rounded-2xl border-4 p-6 md:p-8 flex flex-col items-center text-center shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden ${
          isVictory
            ? "border-[#D97724] bg-gradient-to-b from-[#1C1510] via-[#120F15] to-[#09080B] shadow-[0_0_50px_rgba(217,119,36,0.3)]"
            : "border-[#8C1D18] bg-gradient-to-b from-[#200E10] via-[#140A0D] to-[#09080B] shadow-[0_0_50px_rgba(140,29,24,0.4)]"
        }`}
      >
        {/* Iluminação de Tocha ou Sangue de Fundo */}
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 ${
            isVictory
              ? "bg-[radial-gradient(ellipse_at_top,rgba(217,119,36,0.4)_0%,transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(184,41,35,0.4)_0%,transparent_70%)]"
          }`}
        />

        {/* Adagas cravadas nas pontas do relatório */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none hidden sm:block">
          <WarTableDagger className="w-8 h-8 rotate-[-20deg]" />
        </div>
        <div className="absolute top-2 right-2 z-20 pointer-events-none hidden sm:block">
          <WarTableDagger className="w-8 h-8 rotate-[20deg] scale-x-[-1]" />
        </div>

        {/* Selo de Cera Vermelha (Vitória) */}
        {isVictory && (
          <div className="absolute top-3 right-8 z-30 pointer-events-none transform rotate-12 scale-90 sm:scale-100">
            <RedWaxSeal text="VITÓRIA" className="w-20 h-20 drop-shadow-xl" />
          </div>
        )}

        {/* Emblema Central de Darkest Dungeon */}
        <div
          className={`p-4 rounded-xl border-2 shadow-2xl relative mb-3 ${
            isVictory
              ? "bg-[#251A14] border-[#D97724] text-[#F29F3D] shadow-[#D97724]/20"
              : "bg-[#250F12] border-[#8C1D18] text-[#B82923] shadow-[#8C1D18]/30"
          }`}
        >
          {isVictory ? (
            <Trophy className="w-12 h-12 animate-pulse text-[#F29F3D]" />
          ) : (
            <Skull className="w-12 h-12 text-[#B82923]" />
          )}
        </div>

        {/* Título e Subtítulo Grimdark */}
        <span
          className={`text-[10px] font-gothic font-black uppercase tracking-widest px-3 py-1 rounded border mb-2 ${
            isVictory
              ? "bg-[#D97724]/20 border-[#D97724]/60 text-[#F29F3D]"
              : "bg-[#8C1D18]/20 border-[#8C1D18]/60 text-[#B82923]"
          }`}
        >
          {isVictory ? "EXPEDIÇÃO TRIUNFANTE" : "EXPEDIÇÃO RUÍDA"}
        </span>

        <h2 className="text-3xl md:text-4xl font-gothic font-black text-[#C8B99E] tracking-tight">
          {isVictory ? "O NÚCLEO FOI PURGADO!" : "SUA SANIDADE SE ESVAIU..."}
        </h2>

        {/* Causa da Conclusão */}
        <p className="font-parchment text-base text-[#9E8C70] mt-2 max-w-md leading-relaxed italic">
          "{gameOverState.reason}"
        </p>

        {/* Bloco de Saque de Ouro (Vitória) */}
        {isVictory && (
          <div className="my-5 w-full p-4 rounded-xl bg-[#0B090E] border-2 border-[#D97724]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#251A14] border border-[#D97724]/60 text-[#F29F3D]">
                <Coins className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#9E8C70] block">
                  Saque Pilhado das Catacumbas
                </span>
                <span className="text-2xl font-numbers font-black text-[#F29F3D] block">
                  +{goldReward} Ouro Antigo
                </span>
                <span className="text-[11px] font-gothic font-bold text-[#E9D5FF] block mt-0.5">
                  👑 +1 Pacote Supremo Especial Concedido!
                </span>
              </div>
            </div>

            {claimedReward ? (
              <span className="text-xs font-gothic font-black text-[#2E8B78] px-4 py-2 rounded bg-[#0F1B16] border border-[#2E8B78] flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#2E8B78]" /> Depositado no Baú!
              </span>
            ) : (
              <button
                onClick={handleClaimReward}
                disabled={isPending}
                className="btn-iron-torch px-5 py-2.5 rounded font-gothic font-black text-xs cursor-pointer tracking-wider uppercase whitespace-nowrap"
              >
                {isPending ? "Gravando no NeonDB..." : "Reivindicar Saque"}
              </button>
            )}
          </div>
        )}

        {/* Registro da Batalha (Estatísticas Austeras) */}
        <div className="grid grid-cols-2 gap-3 w-full my-3 text-xs">
          <div className="p-3 rounded-lg bg-[#0E0C10] border border-[#26232C]">
            <span className="text-[#9E8C70] block text-[10px] font-gothic uppercase">
              Ciclos de Turno
            </span>
            <strong className="text-[#C8B99E] text-base font-numbers font-black">
              {turnNumber} Turnos
            </strong>
          </div>

          <div className="p-3 rounded-lg bg-[#0E0C10] border border-[#26232C]">
            <span className="text-[#9E8C70] block text-[10px] font-gothic uppercase">
              Cripta Enfrentada
            </span>
            <strong className="text-[#C8B99E] text-base font-gothic font-bold truncate block">
              {stageName}
            </strong>
          </div>
        </div>

        {/* Botões de Ação de Darkest Dungeon */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-4">
          <button
            onClick={onRestartBattle}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg btn-iron text-[#C8B99E] font-gothic font-black text-xs transition-all cursor-pointer uppercase tracking-wider"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>

          {isVictory ? (
            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg btn-iron-torch font-gothic font-black text-xs transition-all cursor-pointer uppercase tracking-wider"
            >
              <span>Visitar o Antiquário</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/deckbuilder"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#381116] hover:bg-[#4D181F] text-[#F0C0B0] border border-[#8C1D18] font-gothic font-black text-xs transition-all cursor-pointer uppercase tracking-wider"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Reforçar Grimório</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
