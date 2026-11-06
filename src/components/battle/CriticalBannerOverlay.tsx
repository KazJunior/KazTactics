"use client";

import React, { useEffect } from "react";
import { Skull, ShieldAlert } from "lucide-react";

export interface CriticalBannerData {
  text: string;
  type: "FATAL" | "BLOCKED" | "CRITICAL";
}

interface CriticalBannerOverlayProps {
  bannerData: CriticalBannerData | null;
  onFinish: () => void;
}

/**
 * Letreiros de Combate:
 * - Para Ações Bloqueadas / Fora de Alcance: Notificação compacta, discreta e ágil (450ms) no topo do grid.
 * - Para Golpes Críticos e Fatais: Banner de impacto dramático (750ms).
 */
export function CriticalBannerOverlay({
  bannerData,
  onFinish,
}: CriticalBannerOverlayProps) {
  useEffect(() => {
    if (!bannerData) return;
    // Duração rápida e ágil para bloqueios e avisos (450ms em vez de demorar mais de 1s)
    const duration = bannerData.type === "BLOCKED" ? 450 : 750;
    const timer = setTimeout(() => {
      onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [bannerData, onFinish]);

  if (!bannerData) return null;

  const isBlocked = bannerData.type === "BLOCKED";

  // Se for bloqueio por obstáculo ou fora de alcance: pill compacto e rápido no topo do tabuleiro
  if (isBlocked) {
    return (
      <div className="absolute top-4 inset-x-0 z-50 flex items-center justify-center pointer-events-none select-none animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="px-4 py-1.5 bg-[#140607]/95 border-2 border-[#B82923] text-[#fca5a5] shadow-[0_4px_16px_rgba(184,41,35,0.7)] flex items-center gap-2 rounded">
          <ShieldAlert className="w-4 h-4 text-[#B82923] shrink-0" />
          <span className="text-xs font-gothic font-black uppercase tracking-wider text-[#FEF08A]">
            {bannerData.text}
          </span>
        </div>
      </div>
    );
  }

  // Banner para Finalizações / Golpes Fatais
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none select-none animate-in zoom-in-90 duration-150">
      <div className="relative px-6 py-3 border-3 flex items-center gap-3 shadow-[6px_6px_0px_#09080B] bg-[#290809] border-[#D97724] text-[#FEF08A] shadow-[0_0_30px_rgba(184,41,35,0.85)]">
        <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-[#09080B]" />
        <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#09080B]" />
        <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-[#09080B]" />
        <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-[#09080B]" />

        <Skull className="w-6 h-6 text-[#FEF08A] animate-pulse shrink-0" />

        <div>
          <span className="text-[9px] font-gothic font-bold uppercase tracking-widest text-[#C8B99E] block">
            Execução Implacável
          </span>
          <h2 className="text-xl md:text-2xl font-gothic font-black tracking-widest uppercase drop-shadow-[0_2px_4px_#000]">
            {bannerData.text}
          </h2>
        </div>
      </div>
    </div>
  );
}
