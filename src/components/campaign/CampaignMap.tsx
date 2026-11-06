"use client";

import Link from "next/link";
import { CampaignStage } from "@/db/schema";
import {
  Shield,
  Coins,
  Crown,
  Lock,
  Flame,
  Play,
  Skull,
  Scroll,
  RotateCcw,
} from "lucide-react";
import {
  WarTableDagger,
  RedWaxSeal,
  getStagePenIcon,
} from "./ExpeditionStageIcons";

interface CampaignMapProps {
  stages: CampaignStage[];
  currentStage: number;
  userGold: number;
}

export function CampaignMap({
  stages,
  currentStage,
  userGold,
}: CampaignMapProps) {
  // Ordenar estágios por número crescente (1 a 5)
  const sortedStages = [...stages].sort(
    (a, b) => a.stageNumber - b.stageNumber
  );

  return (
    <div className="space-y-8">
      {/* Topo / Cabeçalho da Carta de Expedição */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-[#26232C]">
        <div>
          <div className="flex items-center gap-2 text-[#D97724] text-xs font-gothic font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-[#D97724]" /> Mesa de Guerra &middot; Carta de Expedição
          </div>
          <h1 className="text-3xl md:text-5xl font-gothic font-black text-[#C8B99E] tracking-tight drop-shadow-md">
            Catacumbas Corrompidas
          </h1>
          <p className="font-parchment text-lg text-[#9E8C70] mt-1 max-w-2xl leading-relaxed">
            Consulte a rota de batalha rascunhada a nanquim. Rompa as defesas dos Núcleos
            e reivindique os saques de ouro para negociar relíquias no Antiquário.
          </p>
        </div>

        {/* Status de Expedição e Ouro */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#0E0C10] border-2 border-[#26232C] px-5 py-3 rounded-lg shadow-lg">
            <div className="text-right">
              <span className="text-[10px] uppercase font-gothic font-bold text-[#9E8C70] block">
                Profundidade
              </span>
              <span className="text-lg font-numbers font-black text-[#F29F3D]">
                Estágio {currentStage} / {sortedStages.length}
              </span>
            </div>
            <div className="p-2 rounded bg-[#18151D] text-[#D97724] border border-[#D97724]/40">
              <Crown className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0E0C10] border-2 border-[#26232C] px-5 py-3 rounded-lg shadow-lg">
            <div className="text-right">
              <span className="text-[10px] uppercase font-gothic font-bold text-[#9E8C70] block">
                Ouro no Baú
              </span>
              <span className="text-lg font-numbers font-black text-[#F29F3D]">
                {userGold}
              </span>
            </div>
            <div className="p-2 rounded bg-[#18151D] text-[#D97724] border border-[#D97724]/40">
              <Coins className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* A MESA DE GUERRA (Dark Oak War Table) & CARTA DE EXPEDIÇÃO EM PERGAMINHO */}
      <div className="relative rounded-2xl bg-[#0B090D] border-4 border-[#26232C] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Textura de Madeira de Carvalho da Mesa */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C8B99E_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Iluminação de Tocha Central da Mesa */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(217,119,36,0.12)_0%,rgba(9,8,11,0.85)_80%)]" />

        {/* PERGAMINHO RASGADO DA CARTA */}
        <div className="relative rounded-xl bg-[#161214] border-2 border-[#3A3542] p-6 md:p-8 shadow-2xl">
          {/* Adagas cravadas nos cantos da carta */}
          <div className="absolute -top-4 -left-4 z-20 pointer-events-none hidden md:block">
            <WarTableDagger className="w-10 h-10 rotate-[-15deg] drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)]" />
          </div>
          <div className="absolute -top-4 -right-4 z-20 pointer-events-none hidden md:block">
            <WarTableDagger className="w-10 h-10 rotate-[25deg] scale-x-[-1] drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)]" />
          </div>
          <div className="absolute -bottom-4 -left-4 z-20 pointer-events-none hidden md:block">
            <WarTableDagger className="w-10 h-10 rotate-[-45deg] drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)]" />
          </div>
          <div className="absolute -bottom-4 -right-4 z-20 pointer-events-none hidden md:block">
            <WarTableDagger className="w-10 h-10 rotate-[45deg] scale-x-[-1] drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)]" />
          </div>

          {/* Rota Pontilhada de Nanquim (Trilha de Expedição) */}
          <div className="mb-8 hidden lg:block">
            <div className="flex items-center justify-between px-10 relative">
              {/* Linha guia pontilhada */}
              <div className="absolute left-16 right-16 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#3A3542] z-0" />

              {sortedStages.map((stage) => {
                const isUnlocked = stage.stageNumber <= currentStage;
                const isCompleted = stage.stageNumber < currentStage;
                const isCurrent = stage.stageNumber === currentStage;

                return (
                  <div key={stage.id} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-[#211710] border-[#D97724] shadow-[0_0_20px_rgba(217,119,36,0.6)] scale-110"
                          : isCompleted
                          ? "bg-[#101B17] border-[#2E8B78] text-[#2E8B78]"
                          : "bg-[#0E0C10] border-[#26232C] text-[#9E8C70]/40 opacity-60"
                      }`}
                    >
                      {getStagePenIcon(stage.stageNumber, "w-6 h-6")}
                    </div>
                    <span
                      className={`text-[10px] font-gothic font-bold uppercase mt-2 ${
                        isCurrent
                          ? "text-[#F29F3D]"
                          : isCompleted
                          ? "text-[#2E8B78]"
                          : "text-[#9E8C70]/50"
                      }`}
                    >
                      Fase {stage.stageNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid com os Cartões de Cada Estágio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStages.map((stage) => {
              const isUnlocked = stage.stageNumber <= currentStage;
              const isCompleted = stage.stageNumber < currentStage;
              const isCurrent = stage.stageNumber === currentStage;

              const layout = stage.boardLayoutJson as Record<string, any> | null;
              const deckInfo = stage.aiDeckJson as Record<string, any> | null;

              return (
                <div
                  key={stage.id}
                  className={`group relative rounded-xl border-2 p-6 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                    isCurrent
                      ? "border-[#D97724] bg-gradient-to-b from-[#1E1715] via-[#120F14] to-[#0A080C] shadow-[0_0_35px_rgba(217,119,36,0.25)] scale-[1.02]"
                      : isCompleted
                      ? "border-[#2E8B78]/40 bg-gradient-to-b from-[#111A16] via-[#0E1311] to-[#09080B]"
                      : "border-[#26232C] bg-[#09080B]/70 opacity-55"
                  }`}
                >
                  {/* Selo de Cera Vermelha Carimbado (Fases Concluídas) */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 z-20 pointer-events-none transform rotate-12">
                      <RedWaxSeal text="PURGADO" className="w-16 h-16 drop-shadow-lg" />
                    </div>
                  )}

                  <div>
                    {/* Header: Ícone a Bico de Pena & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-lg border-2 ${
                            isCurrent
                              ? "bg-[#251A14] border-[#D97724] shadow-[0_0_15px_rgba(217,119,36,0.4)]"
                              : isCompleted
                              ? "bg-[#111C18] border-[#2E8B78]/60"
                              : "bg-[#131117] border-[#26232C]"
                          }`}
                        >
                          {getStagePenIcon(stage.stageNumber, "w-7 h-7")}
                        </div>

                        <div>
                          <span className="text-[10px] font-numbers font-bold text-[#9E8C70] tracking-wider block">
                            EXPEDIÇÃO 0{stage.stageNumber}
                          </span>
                          <span
                            className={`text-[9px] font-gothic font-black uppercase tracking-wider px-2 py-0.5 rounded border inline-block ${
                              isCurrent
                                ? "bg-[#D97724] text-[#09080B] border-[#F29F3D] animate-pulse"
                                : isCompleted
                                ? "bg-[#2E8B78]/20 text-[#2E8B78] border-[#2E8B78]/50"
                                : "bg-[#1A1821] text-[#9E8C70] border-[#26232C]"
                            }`}
                          >
                            {isCurrent
                              ? "ALVO ATUAL"
                              : isCompleted
                              ? "CONCLUÍDO"
                              : "TRANCADO"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nome & Descrição Temática de Darkest Dungeon */}
                    <div className="mt-4">
                      <h3 className="text-xl font-gothic font-black text-[#C8B99E] group-hover:text-[#F29F3D] transition-colors leading-tight">
                        {stage.name}
                      </h3>
                      <p className="font-parchment text-base text-[#9E8C70] mt-2 line-clamp-3 leading-relaxed italic">
                        "{layout?.description ||
                          "Destrua o Núcleo da IA adversária para avançar nas profundezas."}"
                      </p>
                    </div>

                    {/* Atributos: Núcleo Inimigo & Saque de Ouro */}
                    <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#26232C] text-xs">
                      {/* HP do Núcleo Inimigo */}
                      <div className="p-2.5 rounded bg-[#09080B] border border-[#26232C]">
                        <span className="text-[10px] text-[#9E8C70] font-gothic uppercase block">
                          Núcleo Inimigo
                        </span>
                        <span className="text-[#B82923] font-numbers font-black flex items-center gap-1.5 mt-0.5 text-sm">
                          <Shield className="w-3.5 h-3.5" />
                          {stage.aiCoreHp} HP
                        </span>
                      </div>

                      {/* Saque em Ouro */}
                      <div className="p-2.5 rounded bg-[#09080B] border border-[#26232C]">
                        <span className="text-[10px] text-[#9E8C70] font-gothic uppercase block">
                          Saque Pilhado
                        </span>
                        <span className="text-[#F29F3D] font-numbers font-black flex items-center gap-1.5 mt-0.5 text-sm">
                          <Coins className="w-3.5 h-3.5" />
                          +{stage.goldReward} Ouro
                        </span>
                      </div>
                    </div>

                    {/* Arquétipo Tático da IA */}
                    {deckInfo?.archetype && (
                      <div className="mt-3 text-[10px] text-[#9E8C70] flex items-center justify-between px-1">
                        <span className="font-gothic uppercase">Arquétipo Hostil:</span>
                        <span className="font-bold text-[#C8B99E]">
                          {deckInfo.archetype}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ação de Marcha / Batalha */}
                  <div className="mt-6 pt-4 border-t border-[#26232C]">
                    {isUnlocked ? (
                      <Link
                        href={`/battle?stage=${stage.stageNumber}`}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded font-gothic font-black text-xs tracking-wider transition-all uppercase ${
                          isCurrent
                            ? "btn-iron-torch cursor-pointer shadow-lg"
                            : "btn-iron text-[#C8B99E] cursor-pointer hover:border-[#2E8B78]"
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {isCompleted ? "Revisitar Cripta" : "Iniciar Marcha"}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-3 rounded bg-[#09080B] border border-[#26232C] text-[#9E8C70]/40 font-gothic font-bold text-xs select-none uppercase">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Requer Fase {stage.stageNumber - 1}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
