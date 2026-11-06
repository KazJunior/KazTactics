"use client";

import React, { useEffect } from "react";

interface IronCrownSpellBannerProps {
  spellName: string | null;
  onFinish: () => void;
}

/**
 * Coroa de Ferro / Símbolo de Aflição de Darkest Dungeon
 * - O clássico arco pontiagudo com raios de ferro em nanquim
 * - Título garrafal em tipografia gótica ancestral
 */
export function IronCrownSpellBanner({
  spellName,
  onFinish,
}: IronCrownSpellBannerProps) {
  useEffect(() => {
    if (!spellName) return;
    const timer = setTimeout(() => {
      onFinish();
    }, 1250);
    return () => clearTimeout(timer);
  }, [spellName, onFinish]);

  if (!spellName) return null;

  return (
    <div className="fixed top-20 inset-x-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none animate-iron-crown">
      {/* Símbolo do Arco Pontiagudo da Coroa de Ferro (Iron Crown of Stress / Affliction) */}
      <div className="relative w-36 h-24 flex items-center justify-center">
        <svg
          viewBox="0 0 120 70"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(184,41,35,0.85)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arco Base de Ferro Espesso */}
          <path
            d="M15 55C30 25 90 25 105 55"
            fill="none"
            stroke="#09080B"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M15 55C30 25 90 25 105 55"
            fill="none"
            stroke="#B82923"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Espigões / Pontas Radiantes de Ferro (Spikes of the Crown) */}
          {/* Espigão Central Superior */}
          <polygon points="60,2 55,25 65,25" fill="#09080B" />
          <polygon points="60,4 57,25 63,25" fill="#FEF08A" />

          {/* Espigões Intermediários Esquerdos */}
          <polygon points="40,10 37,32 46,30" fill="#09080B" />
          <polygon points="40,12 39,31 44,30" fill="#D97724" />
          <polygon points="25,24 23,43 32,40" fill="#09080B" />
          <polygon points="25,26 24,42 30,40" fill="#B82923" />

          {/* Espigões Intermediários Direitos */}
          <polygon points="80,10 74,30 83,32" fill="#09080B" />
          <polygon points="80,12 76,30 81,31" fill="#D97724" />
          <polygon points="95,24 88,40 97,43" fill="#09080B" />
          <polygon points="95,26 90,40 96,42" fill="#B82923" />

          {/* Círculo Central Rúnico */}
          <circle cx="60" cy="38" r="7" fill="#09080B" stroke="#B82923" strokeWidth="2" />
          <circle cx="60" cy="38" r="3.5" fill="#FEF08A" />
        </svg>
      </div>

      {/* Faixa / Letras Garrafais Góticas do Feitiço */}
      <div className="relative -mt-2 px-6 py-2 bg-[#09080B] border-3 border-[#B82923] shadow-[0_0_30px_rgba(184,41,35,0.8),8px_8px_0px_#09080B] text-center">
        <span className="text-[10px] font-gothic font-bold uppercase tracking-widest text-[#D97724] block">
          Feitiço Arcano Desencadeado
        </span>
        <h1 className="text-2xl md:text-3xl font-gothic font-black text-[#FEF08A] tracking-wider uppercase drop-shadow-[0_2px_4px_#000]">
          {spellName}
        </h1>
      </div>
    </div>
  );
}

