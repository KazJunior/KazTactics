"use client";

import React from "react";

interface GothicObstacleProps {
  x: number;
  y: number;
  isProjectingShadow?: boolean;
}

/**
 * Obstáculos de Arena Celeste (Anime High Fantasy / JRPG)
 * 1. Cristais de Mana Flutuantes (Facetados e brilhantes em ciano/roxo)
 * 2. Pilares Élficos Dourados com runas luminosas
 * 3. Árvores Sagradas com folhagem vibrante e barreiras de éter
 */
export function GothicObstacle({ x, y, isProjectingShadow }: GothicObstacleProps) {
  const variantIndex = (x * 7 + y * 13) % 3;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Sombra Arcana Translúcida no Chão */}
      <div
        className={`absolute -bottom-1 -right-0.5 w-11 h-5 rounded-full bg-[#13102A]/80 blur-[2px] pointer-events-none transition-all duration-300 ${
          isProjectingShadow ? "scale-125 bg-[#F43F5E]/60 shadow-[0_0_12px_#F43F5E]" : ""
        }`}
      />

      {variantIndex === 0 ? (
        <FloatingManaCrystal isProjectingShadow={isProjectingShadow} />
      ) : variantIndex === 1 ? (
        <ElvenGoldenPillar isProjectingShadow={isProjectingShadow} />
      ) : (
        <SacredArcaneTree isProjectingShadow={isProjectingShadow} />
      )}
    </div>
  );
}

// 1. CRISTAIS DE MANA FLUTUANTES (Floating Mana Crystals)
function FloatingManaCrystal({ isProjectingShadow }: { isProjectingShadow?: boolean }) {
  return (
    <svg
      viewBox="0 0 50 60"
      className="w-11 h-13 md:w-13 md:h-15 overflow-visible filter drop-shadow-[0_4px_12px_rgba(56,189,248,0.5)] animate-crystal-float"
    >
      <defs>
        <linearGradient id="crystalCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#38BDF8" />
          <stop offset="80%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>
        <linearGradient id="crystalPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D0FE" />
          <stop offset="40%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
      </defs>

      {/* Círculo Mágico sob o Cristal Flutuante */}
      <ellipse cx="25" cy="52" rx="16" ry="4" fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" />

      {/* Cristal Menor Satélite Esquerdo (Roxo) */}
      <polygon points="12,32 16,22 18,34 14,44" fill="url(#crystalPurple)" stroke="#38BDF8" strokeWidth="0.8" />
      {/* Cristal Menor Satélite Direito (Ciano) */}
      <polygon points="36,36 40,26 42,38 38,46" fill="url(#crystalCyan)" stroke="#FFFFFF" strokeWidth="0.8" />

      {/* Grande Cristal Central Facetado (Ciano/Celeste) */}
      {/* Faceta Traseira / Sombra */}
      <polygon points="25,6 35,26 31,48 25,54 19,48 15,26" fill="#0C4A6E" />
      {/* Faceta Esquerda */}
      <polygon points="25,6 15,26 19,48 25,54" fill="url(#crystalCyan)" stroke="#BAE6FD" strokeWidth="1" />
      {/* Faceta Direita (Iluminada) */}
      <polygon points="25,6 35,26 31,48 25,54" fill="url(#crystalPurple)" opacity="0.85" stroke="#F5D0FE" strokeWidth="1" />
      {/* Crista Central e Brilho Especular */}
      <line x1="25" y1="6" x2="25" y2="54" stroke="#FFFFFF" strokeWidth="1.4" />
      <circle cx="25" cy="18" r="2.5" fill="#FFFFFF" opacity="0.9" />

      {/* Partículas de Éter Orbitando */}
      <circle cx="10" cy="20" r="1.5" fill="#38BDF8" className="animate-ping" />
      <circle cx="38" cy="16" r="1.2" fill="#FEF08A" />
      <circle cx="28" cy="46" r="1.5" fill="#38BDF8" />

      {/* Brilho Vermelho se estiver Bloqueando LoS */}
      {isProjectingShadow && (
        <circle cx="25" cy="30" r="18" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
      )}
    </svg>
  );
}

// 2. PILAR ÉLFICO DOURADO COM RUNAS (Elven Golden Pillar)
function ElvenGoldenPillar({ isProjectingShadow }: { isProjectingShadow?: boolean }) {
  return (
    <svg
      viewBox="0 0 50 60"
      className="w-11 h-13 md:w-13 md:h-15 overflow-visible filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.45)]"
    >
      <defs>
        <linearGradient id="goldPillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Base Élfica em Mármore e Ouro */}
      <polygon points="10,54 40,54 36,48 14,48" fill="#FDE047" stroke="#78350F" strokeWidth="1" />
      <polygon points="13,48 37,48 35,44 15,44" fill="#1E293B" />

      {/* Fuste Elegante da Coluna Élfica */}
      <path d="M16 44L18 16C18 12 32 12 32 16L34 44H16Z" fill="url(#goldPillar)" stroke="#78350F" strokeWidth="1.2" />

      {/* Capitel Alado Élfico no Topo */}
      <path d="M12 16C12 10 25 8 25 8C25 8 38 10 38 16L34 20H16L12 16Z" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
      {/* Orbe de Cristal Solar no Topo */}
      <circle cx="25" cy="8" r="4.5" fill="#38BDF8" stroke="#FEF08A" strokeWidth="1.5" />
      <circle cx="25" cy="8" r="2" fill="#FFFFFF" />

      {/* Runas Élficas Luminosas Gravadas na Coluna */}
      <path d="M25 18L23 24L27 28L25 34M25 36L23 40L25 42" stroke="#38BDF8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="25" cy="28" r="1.2" fill="#FFFFFF" />

      {/* Brilho de Bloqueio */}
      {isProjectingShadow && (
        <circle cx="25" cy="30" r="18" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
      )}
    </svg>
  );
}

// 3. ÁRVORE SAGRADA & BARREIRA ARCANA (Sacred Arcane Tree)
function SacredArcaneTree({ isProjectingShadow }: { isProjectingShadow?: boolean }) {
  return (
    <svg
      viewBox="0 0 50 60"
      className="w-11 h-13 md:w-13 md:h-15 overflow-visible filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.45)]"
    >
      <defs>
        <radialGradient id="foliageGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#064E3B" />
        </radialGradient>
      </defs>

      {/* Barreira Mágica Hexagonal Translúcida */}
      <polygon
        points="25,4 43,14 43,44 25,54 7,44 7,14"
        fill="rgba(56, 189, 248, 0.08)"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeDasharray="4 2"
        opacity="0.8"
      />

      {/* Tronco de Madeira Prateada Arcana */}
      <path d="M23 52L24 36C24 30 20 26 18 24M27 52L26 36C26 30 30 26 32 24" stroke="#475569" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M21 54L29 54" stroke="#334155" strokeWidth="2" />

      {/* Folhagem Sagrada e Esferas de Éter */}
      <circle cx="25" cy="22" r="14" fill="url(#foliageGlow)" />
      <circle cx="17" cy="26" r="9" fill="#059669" opacity="0.9" />
      <circle cx="33" cy="26" r="9" fill="#34D399" opacity="0.9" />
      <circle cx="25" cy="14" r="7" fill="#A7F3D0" opacity="0.8" />

      {/* Flores / Frutos Espirituais de Sakura / Ciano */}
      <circle cx="22" cy="18" r="1.8" fill="#F472B6" />
      <circle cx="29" cy="22" r="1.6" fill="#F472B6" />
      <circle cx="18" cy="28" r="1.5" fill="#38BDF8" />
      <circle cx="31" cy="28" r="1.5" fill="#FEF08A" />

      {/* Brilho de Bloqueio */}
      {isProjectingShadow && (
        <circle cx="25" cy="30" r="18" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" className="animate-pulse" />
      )}
    </svg>
  );
}
