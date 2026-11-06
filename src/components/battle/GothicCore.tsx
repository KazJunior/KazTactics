"use client";

import React from "react";
import { BoardCore } from "@/types/game";

interface GothicCoreProps {
  core: BoardCore;
}

/**
 * Núcleo de Cristal Facetado em Pedestal de Obsidiana (Fiel à Imagem Modelo):
 * - Grande cristal multifacetado brilhante erguendo-se de uma base de rocha obsidiana com espinhos
 * - Barra de HP horizontal flutuando acima do cristal
 */
export function GothicCore({ core }: GothicCoreProps) {
  const hpRatio = Math.max(0, Math.min(1, core.currentHp / core.maxHp));
  const isPlayer = core.owner === "PLAYER";

  return (
    <div className="group relative flex flex-col items-center justify-center w-full h-full select-none">
      {/* Tooltip ao passar o mouse */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#0E0B1A]/95 border border-[#7C3AED]/60 px-2.5 py-1 rounded-lg shadow-xl flex flex-col items-center">
        <span className="text-[10px] font-gothic font-bold text-white">
          {core.name}
        </span>
        <span className="text-[9px] font-numbers font-bold text-[#F43F5E]">
          {core.currentHp} / {core.maxHp} HP
        </span>
      </div>

      {/* Barra de Vida Flutuante Acima do Cristal */}
      <div className="absolute -top-3 inset-x-1 z-30 flex flex-col items-center pointer-events-none">
        <div className="w-16 md:w-18 h-2.5 bg-[#09090B]/95 border-[1.5px] border-[#09090B] rounded-[2px] shadow-[0_2px_8px_rgba(0,0,0,0.9)] overflow-hidden p-[1px]">
          <div
            className={`h-full transition-all duration-300 ${
              isPlayer
                ? "bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#A855F7]"
                : "bg-gradient-to-r from-[#991B1B] via-[#E11D48] to-[#FB7185]"
            }`}
            style={{ width: `${Math.max(hpRatio * 100, 5)}%` }}
          />
        </div>
      </div>

      {/* Aura Luminosa no Solo */}
      <div
        className={`absolute inset-0 rounded-full blur-md pointer-events-none opacity-65 ${
          isPlayer ? "bg-[#38BDF8]/35" : "bg-[#E11D48]/45"
        }`}
      />

      {/* Cristal Facetado em Pedestal de Obsidiana */}
      <svg
        viewBox="0 0 80 84"
        className="w-18 h-18 md:w-22 md:h-22 overflow-visible relative z-10 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.85)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#0D0A14" strokeWidth="2" strokeLinejoin="round">
          {/* Base do Pedestal de Obsidiana Escura */}
          <polygon
            points="40,46 72,60 40,76 8,60"
            fill="#1E192B"
          />
          <polygon
            points="8,60 40,76 40,82 8,66"
            fill="#14101F"
          />
          <polygon
            points="72,60 40,76 40,82 72,66"
            fill="#0D0A14"
          />

          {/* Espinhos de Rocha ao Redor do Cristal */}
          <polygon points="16,58 22,40 28,56" fill="#2A233D" />
          <polygon points="64,58 58,40 52,56" fill="#181424" />
          <polygon points="24,66 28,50 34,64" fill="#231D33" />
          <polygon points="56,66 52,50 46,64" fill="#14101F" />

          {/* Brilho de Energia na Cratera do Pedestal */}
          <ellipse
            cx="40"
            cy="56"
            rx="16"
            ry="6"
            fill={isPlayer ? "#38BDF8" : "#F43F5E"}
            stroke="none"
            opacity="0.7"
          />

          {/* ======================================================== */}
          {/* GRANDE CRISTAL MULTIFACETADO CENTRAL (Fiel à Imagem)     */}
          {/* ======================================================== */}
          {/* Faceta Principal Esquerda (Mais iluminada) */}
          <polygon
            points="40,6 24,34 28,56 40,60"
            fill={isPlayer ? "#7DD3FC" : "#FDA4AF"}
          />
          {/* Faceta Principal Direita (Sombreada) */}
          <polygon
            points="40,6 56,34 52,56 40,60"
            fill={isPlayer ? "#0284C7" : "#E11D48"}
          />
          {/* Faceta Central Superior (Brilho Especular) */}
          <polygon
            points="40,6 33,30 40,44 47,30"
            fill={isPlayer ? "#E0F2FE" : "#FFE4E6"}
          />
          {/* Faceta Central Inferior */}
          <polygon
            points="33,30 40,44 47,30 40,60"
            fill={isPlayer ? "#38BDF8" : "#F43F5E"}
          />
        </g>
      </svg>
    </div>
  );
}
