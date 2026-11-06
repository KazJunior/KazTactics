"use client";

import React, { useEffect } from "react";
import { BoardUnit } from "@/types/game";
import { CARD_TYPE_THEMES } from "@/lib/cardVisuals";
import { Swords, Sparkles, Flame } from "lucide-react";

export interface ActionFreezeFrameData {
  attackerName: string;
  attackerType: string;
  attackerOwner: "PLAYER" | "AI";
  damage?: number;
  targetName: string;
  isSpell?: boolean;
}

interface ActionFreezeFrameOverlayProps {
  actionData: ActionFreezeFrameData | null;
  onFinish: () => void;
}

/**
 * Action Freeze-Frame Overlay (Darkest Dungeon Classic Combat Impact)
 * - Fundo escurecido em 60%
 * - Linhas de impacto em nanquim rasgando a tela (Slash Speedlines)
 * - Pose ultra-expressiva do atacante com destaque Chiaroscuro
 * - Transição dramática rápida de 480ms
 */
export function ActionFreezeFrameOverlay({
  actionData,
  onFinish,
}: ActionFreezeFrameOverlayProps) {
  useEffect(() => {
    if (!actionData) return;
    const timer = setTimeout(() => {
      onFinish();
    }, 480);
    return () => clearTimeout(timer);
  }, [actionData, onFinish]);

  if (!actionData) return null;

  const isPlayer = actionData.attackerOwner === "PLAYER";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none select-none">
      {/* 1. Dimmer de 60% no Fundo do Tabuleiro */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] transition-opacity duration-150 animate-in fade-in" />

      {/* 2. Linhas de Impacto / Rasgo em Nanquim Preto e Branco (Slash Lines) */}
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full object-cover animate-slash-lines opacity-90"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="slashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#09080B" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#8C1D18" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Feixes Rápidos Cortando a Tela */}
        <polygon points="-50,120 850,220 850,235 -50,135" fill="url(#slashGrad)" />
        <polygon points="-50,280 850,380 850,405 -50,305" fill="#FFFFFF" />
        <polygon points="-50,420 850,520 850,535 -50,435" fill="#09080B" />
        <polygon points="120,-50 220,650 235,650 135,-50" fill="#B82923" opacity="0.6" />

        {/* Respingos de Tinta / Hachuras Rápidas */}
        <line x1="150" y1="200" x2="350" y2="250" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="450" y1="320" x2="680" y2="380" stroke="#FFFFFF" strokeWidth="4" />
        <circle cx="400" cy="300" r="12" fill="#B82923" />
        <circle cx="440" cy="280" r="6" fill="#09080B" />
      </svg>

      {/* 3. Painel Central da Ação Congelada (Action Freeze-Frame) */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 mb-2">
          {actionData.isSpell ? (
            <div className="p-2.5 rounded bg-[#6B2D84] text-[#FEF08A] border-2 border-[#09080B] shadow-[4px_4px_0px_#09080B]">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div
              className={`p-2.5 rounded border-2 border-[#09080B] shadow-[4px_4px_0px_#09080B] ${
                isPlayer
                  ? "bg-[#D97724] text-[#09080B]"
                  : "bg-[#8C1D18] text-[#FEF08A]"
              }`}
            >
              <Swords className="w-8 h-8 animate-pulse" />
            </div>
          )}
        </div>

        {/* Nome do Atacante em Tipografia Gótica Imponente */}
        <div className="px-5 py-2 bg-[#09080B] border-3 border-[#C8B99E] shadow-[6px_6px_0px_#09080B]">
          <h2 className="text-xl md:text-2xl font-gothic font-black text-[#FEF08A] tracking-wider uppercase drop-shadow-[0_2px_4px_#000]">
            {actionData.attackerName}
          </h2>
          <span className="text-xs font-parchment text-[#C8B99E] block mt-0.5">
            {actionData.isSpell
              ? "CONJURAÇÃO IMEDIATA &middot; PODER ARCANO"
              : `GOLPE FEROZ &middot; ALVO: ${actionData.targetName.toUpperCase()}`}
          </span>
        </div>

        {actionData.damage && (
          <div className="mt-2 text-2xl md:text-3xl font-numbers font-black text-[#B82923] bg-[#09080B] px-4 py-1 border-2 border-[#8C1D18] shadow-[0_0_20px_rgba(184,41,35,0.9)] animate-bounce">
            -{actionData.damage} DANO!
          </div>
        )}
      </div>
    </div>
  );
}

