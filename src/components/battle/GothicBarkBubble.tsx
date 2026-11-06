"use client";

import React, { useEffect } from "react";

export interface BarkData {
  id: string;
  speakerName: string;
  speakerOwner: "PLAYER" | "AI";
  text: string;
}

interface GothicBarkBubbleProps {
  bark: BarkData | null;
  onFinish: () => void;
}

/**
 * Balão de Fala Curta ("Bark") no Estilo Darkest Dungeon
 * - Balão preto angular com borda de nanquim e texto em pergaminho
 * - Disparado quando criaturas lendárias são invocadas ou núcleos estão à beira da ruína
 */
export function GothicBarkBubble({ bark, onFinish }: GothicBarkBubbleProps) {
  useEffect(() => {
    if (!bark) return;
    const timer = setTimeout(() => {
      onFinish();
    }, 2600);
    return () => clearTimeout(timer);
  }, [bark, onFinish]);

  if (!bark) return null;

  const isPlayer = bark.speakerOwner === "PLAYER";

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none animate-bark">
      <div className="relative px-5 py-2.5 bg-[#09080B] border-2 border-[#C8B99E] shadow-[4px_4px_0px_#09080B,0_0_20px_rgba(0,0,0,0.9)] max-w-sm text-center">
        {/* Ponteiro Angular do Balão de Fala */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#09080B] border-r-2 border-b-2 border-[#C8B99E] transform rotate-45" />

        {/* Nome do Orador */}
        <span
          className={`text-[9px] font-gothic font-black uppercase tracking-wider block ${
            isPlayer ? "text-[#F29F3D]" : "text-[#B82923]"
          }`}
        >
          {bark.speakerName}
        </span>

        {/* Fala Sombria em Pergaminho Clássico */}
        <p className="font-parchment text-sm md:text-base text-[#C8B99E] leading-tight italic mt-0.5">
          "{bark.text}"
        </p>
      </div>
    </div>
  );
}

