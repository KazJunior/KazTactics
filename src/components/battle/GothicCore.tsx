"use client";

import React from "react";
import { BoardCore } from "@/types/game";

interface GothicCoreProps {
  core: BoardCore;
}

export function GothicCore({ core }: GothicCoreProps) {
  const hpRatio = Math.max(0, Math.min(1, core.currentHp / core.maxHp));
  const isPlayer = core.owner === "PLAYER";

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-0.5 select-none">
      {/* Estrutura 2D do Cristal Nexus */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {isPlayer ? (
          <SolarNexusCrystal hpRatio={hpRatio} />
        ) : (
          <AstralNexusCrystal hpRatio={hpRatio} />
        )}
      </div>

      {/* Nome e Barra de Vida do Núcleo */}
      <div className="w-full mt-0.5 space-y-0.5 z-10 px-0.5">
        <div className="flex items-center justify-between text-[8px] font-gothic">
          <span
            className={`font-black truncate max-w-[55px] ${
              isPlayer ? "text-[#F59E0B]" : "text-[#F43F5E]"
            }`}
          >
            {core.name}
          </span>
          <span className="font-numbers text-[#F8FAFC]">
            {core.currentHp}/{core.maxHp}
          </span>
        </div>

        {/* Barra de Vida Luminosa */}
        <div className="w-full h-1.5 bg-[#121026] border border-white/20 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isPlayer
                ? "bg-gradient-to-r from-[#38BDF8] via-[#F59E0B] to-[#FEF08A] shadow-[0_0_8px_#F59E0B]"
                : "bg-gradient-to-r from-[#9333EA] via-[#E11D48] to-[#F43F5E] shadow-[0_0_8px_#F43F5E]"
            }`}
            style={{ width: `${hpRatio * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// 1. NÚCLEO DO JOGADOR: Grande Cristal Nexus Solar/Azul sobre Círculo Mágico Dourado
function SolarNexusCrystal({ hpRatio }: { hpRatio: number }) {
  const isLow = hpRatio < 0.3;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* CÍRCULO MÁGICO DOURADO GIRATÓRIO NO CHÃO */}
      <div className="absolute bottom-2 inset-x-0 h-6 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 60 20"
          className="w-full h-full overflow-visible animate-magic-circle"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Anéis Concêntricos Dourados */}
          <ellipse cx="30" cy="10" rx="28" ry="8" fill="none" stroke="#F59E0B" strokeWidth="1.2" opacity="0.85" />
          <ellipse cx="30" cy="10" rx="22" ry="6" fill="none" stroke="#FEF08A" strokeWidth="0.8" strokeDasharray="3 2" />
          <ellipse cx="30" cy="10" rx="14" ry="4" fill="rgba(245, 158, 11, 0.15)" stroke="#38BDF8" strokeWidth="0.8" />
          {/* Runas Geométricas */}
          <line x1="2" y1="10" x2="58" y2="10" stroke="#F59E0B" strokeWidth="0.6" opacity="0.6" />
          <line x1="30" y1="2" x2="30" y2="18" stroke="#F59E0B" strokeWidth="0.6" opacity="0.6" />
        </svg>
      </div>

      {/* GRANDE CRISTAL NEXUS SOLAR/AZUL FLUTUANTE */}
      <svg
        viewBox="0 0 54 62"
        className="w-12 h-14 md:w-14 md:h-16 overflow-visible filter drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)] animate-crystal-float z-10"
      >
        <defs>
          <linearGradient id="solarBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#67E8F9" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>
          <linearGradient id="solarGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Aura de Energia Solar no Fundo */}
        <circle cx="27" cy="24" r="20" fill="url(#solarGold)" opacity={isLow ? "0.2" : "0.35"} className="animate-pulse" />

        {/* Anéis de Éter Flutuantes em Torno do Cristal */}
        <ellipse cx="27" cy="26" rx="22" ry="7" fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="5 3" transform="rotate(-15 27 26)" />
        <ellipse cx="27" cy="26" rx="22" ry="7" fill="none" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="5 3" transform="rotate(15 27 26)" />

        {/* Cristal Satélite Esquerdo (Dourado) */}
        <polygon points="12,28 16,18 18,30 14,40" fill="url(#solarGold)" stroke="#FEF08A" strokeWidth="0.8" />
        {/* Cristal Satélite Direito (Azul Celeste) */}
        <polygon points="38,30 42,20 44,32 40,42" fill="url(#solarBlue)" stroke="#E0F2FE" strokeWidth="0.8" />

        {/* GRANDE CRISTAL CENTRAL NEXUS (Octaedro Facetado) */}
        {/* Faceta Traseira */}
        <polygon points="27,4 39,24 35,46 27,52 19,46 15,24" fill="#0C4A6E" />
        {/* Faceta Esquerda Azul-Ciano */}
        <polygon points="27,4 15,24 19,46 27,52" fill="url(#solarBlue)" stroke="#BAE6FD" strokeWidth="1.2" />
        {/* Faceta Direita Ouro-Solar */}
        <polygon points="27,4 39,24 35,46 27,52" fill="url(#solarGold)" opacity="0.9" stroke="#FEF08A" strokeWidth="1.2" />
        {/* Aresta Central Brilhante */}
        <line x1="27" y1="4" x2="27" y2="52" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="27" cy="20" r="3.5" fill="#FFFFFF" />

        {/* Partículas de Luz Solar */}
        <circle cx="27" cy="4" r="2.5" fill="#FEF08A" className="animate-ping" />
        <circle cx="10" cy="18" r="1.5" fill="#38BDF8" />
        <circle cx="44" cy="16" r="1.5" fill="#FEF08A" />
      </svg>
    </div>
  );
}

// 2. NÚCLEO DA IA: Cristal Nexus Astral (Roxo/Carmesim) sobre Círculo Rúnico
function AstralNexusCrystal({ hpRatio }: { hpRatio: number }) {
  const isLow = hpRatio < 0.3;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* CÍRCULO RÚNICO ENERGÉTICO ROXO/CARMESIM */}
      <div className="absolute bottom-2 inset-x-0 h-6 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 60 20"
          className="w-full h-full overflow-visible animate-magic-circle-rev"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="30" cy="10" rx="28" ry="8" fill="none" stroke="#F43F5E" strokeWidth="1.2" opacity="0.85" />
          <ellipse cx="30" cy="10" rx="22" ry="6" fill="none" stroke="#A855F7" strokeWidth="0.8" strokeDasharray="4 2" />
          <ellipse cx="30" cy="10" rx="14" ry="4" fill="rgba(168, 85, 247, 0.2)" stroke="#F43F5E" strokeWidth="0.8" />
          <line x1="4" y1="10" x2="56" y2="10" stroke="#F43F5E" strokeWidth="0.6" opacity="0.6" />
          <line x1="30" y1="2" x2="30" y2="18" stroke="#A855F7" strokeWidth="0.6" opacity="0.6" />
        </svg>
      </div>

      {/* CRISTAL NEXUS ASTRAL FLUTUANTE (ROXO/CARMESIM) */}
      <svg
        viewBox="0 0 54 62"
        className="w-12 h-14 md:w-14 md:h-16 overflow-visible filter drop-shadow-[0_4px_16px_rgba(244,63,94,0.65)] animate-crystal-float z-10"
      >
        <defs>
          <linearGradient id="astralCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="30%" stopColor="#F43F5E" />
            <stop offset="80%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#4C0519" />
          </linearGradient>
          <linearGradient id="astralPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D0FE" />
            <stop offset="40%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#581C87" />
          </linearGradient>
        </defs>

        {/* Aura Astral Rubra/Roxa */}
        <circle cx="27" cy="24" r="20" fill="url(#astralPurple)" opacity={isLow ? "0.2" : "0.35"} className="animate-pulse" />

        {/* Anéis de Energia Astral */}
        <ellipse cx="27" cy="26" rx="22" ry="7" fill="none" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="5 3" transform="rotate(-20 27 26)" />
        <ellipse cx="27" cy="26" rx="22" ry="7" fill="none" stroke="#C084FC" strokeWidth="1.2" strokeDasharray="5 3" transform="rotate(20 27 26)" />

        {/* Cristais Satélites Orbitantes */}
        <polygon points="10,26 14,16 16,28 12,38" fill="url(#astralPurple)" stroke="#F5D0FE" strokeWidth="0.8" />
        <polygon points="40,32 44,22 46,34 42,44" fill="url(#astralCrimson)" stroke="#FFE4E6" strokeWidth="0.8" />

        {/* GRANDE CRISTAL ASTRAL CENTRAL */}
        <polygon points="27,4 39,24 35,46 27,52 19,46 15,24" fill="#3B0764" />
        {/* Faceta Esquerda Púrpura */}
        <polygon points="27,4 15,24 19,46 27,52" fill="url(#astralPurple)" stroke="#F5D0FE" strokeWidth="1.2" />
        {/* Faceta Direita Carmesim */}
        <polygon points="27,4 39,24 35,46 27,52" fill="url(#astralCrimson)" opacity="0.95" stroke="#FECDD3" strokeWidth="1.2" />
        {/* Aresta Central Brilhante */}
        <line x1="27" y1="4" x2="27" y2="52" stroke="#FFFFFF" strokeWidth="1.8" />
        <circle cx="27" cy="20" r="3.5" fill="#FFFFFF" />

        {/* Partículas de Éter Rubro */}
        <circle cx="27" cy="4" r="2.5" fill="#F43F5E" className="animate-ping" />
        <circle cx="44" cy="18" r="1.5" fill="#C084FC" />
        <circle cx="8" cy="20" r="1.5" fill="#F43F5E" />
      </svg>
    </div>
  );
}
