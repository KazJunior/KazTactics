"use client";

import React from "react";
import { GridTile, BoardUnit } from "@/types/game";

interface GothicTileProps {
  x: number;
  y: number;
  tile: GridTile;
  isSelected: boolean;
  isMovement: boolean;
  isAttack: boolean;
  isLoSShadowBlocked?: boolean;
  playerUnits: BoardUnit[];
  children?: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Lajes da Arena de Santuário Celeste (Anime High Fantasy / JRPG)
 * - Lajes de pedra arcana azul-acinzentada (#2A3252 e #323C61 em padrão xadrez sutil)
 * - Bordas suaves (border-indigo-400/25) e brilho vibrante em destaques
 */
export function GothicTile({
  x,
  y,
  tile,
  isSelected,
  isMovement,
  isAttack,
  isLoSShadowBlocked = false,
  playerUnits,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: GothicTileProps) {
  // Padrão xadrez suave de pedra arcana celeste
  const isAltSlab = (x + y) % 2 === 0;
  const slabBg = isAltSlab ? "#2A3252" : "#323C61";

  // Distância do centro para iluminação de arena
  const distToCenter = Math.hypot(x - 5, y - 3);
  const isNearCenter = distToCenter <= 3.2;

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-between p-1 transition-all duration-150 cursor-pointer overflow-visible rounded-lg border ${
        isSelected
          ? "border-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.7)] z-20 scale-105"
          : isMovement
          ? "border-[#38BDF8] shadow-[0_0_18px_rgba(56,189,248,0.65)] z-10"
          : isAttack
          ? "border-[#F43F5E] shadow-[0_0_20px_rgba(244,63,94,0.75)] z-10"
          : isLoSShadowBlocked
          ? "border-[#F43F5E]/40"
          : "border-indigo-400/25 hover:border-indigo-300/50 hover:shadow-[0_0_12px_rgba(129,140,248,0.25)]"
      }`}
      style={{
        backgroundColor: isSelected
          ? "#3C356E"
          : isMovement
          ? "#1A3254"
          : isAttack
          ? "#451B32"
          : slabBg,
      }}
    >
      {/* ======================================================== */}
      {/* 1. TEXTURA DE PEDRA ARCANA & VEIOS DOURADOS SUAVES       */}
      {/* ======================================================== */}
      <svg
        viewBox="0 0 64 64"
        className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Veios sutis de mana e moldura rúnica nos cantos */}
        <line x1="2" y1="2" x2="14" y2="2" stroke="#38BDF8" strokeWidth="1" />
        <line x1="2" y1="2" x2="2" y2="14" stroke="#38BDF8" strokeWidth="1" />
        <line x1="62" y1="2" x2="50" y2="2" stroke="#38BDF8" strokeWidth="1" />
        <line x1="62" y1="2" x2="62" y2="14" stroke="#38BDF8" strokeWidth="1" />
        <line x1="2" y1="62" x2="14" y2="62" stroke="#38BDF8" strokeWidth="1" />
        <line x1="2" y1="62" x2="2" y2="50" stroke="#38BDF8" strokeWidth="1" />
        <line x1="62" y1="62" x2="50" y2="62" stroke="#38BDF8" strokeWidth="1" />
        <line x1="62" y1="62" x2="62" y2="50" stroke="#38BDF8" strokeWidth="1" />

        {/* Ponto central rúnico */}
        <circle cx="32" cy="32" r="1.5" fill="#F59E0B" opacity="0.6" />
      </svg>

      {/* Brilho Celeste Central Suave */}
      {isNearCenter && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.12)_0%,transparent_70%)]" />
      )}

      {/* Sombra de Bloqueio de Line of Sight (Barreira Mágica) */}
      {isLoSShadowBlocked && (
        <div className="absolute inset-0 z-10 pointer-events-none bg-[#3B1528]/80 border border-[#F43F5E]/60 flex items-center justify-center rounded-lg">
          <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="0" x2="64" y2="64" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="64" y1="0" x2="0" y2="64" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
          <span className="absolute bottom-1 right-1 text-[7px] font-gothic font-bold text-[#F43F5E] bg-[#1A1128] px-1 rounded border border-[#F43F5E]/60">
            Bloqueado
          </span>
        </div>
      )}

      {/* Coordenadas e Marcadores de Ação */}
      <div className="w-full flex items-center justify-between text-[8px] font-numbers text-[#94A3B8]/60 px-0.5 z-10">
        <span>
          {x},{y}
        </span>
        {isMovement && (
          <span className="text-[#38BDF8] font-bold flex items-center gap-0.5 font-gothic">
            MOV
          </span>
        )}
        {isAttack && (
          <span className="text-[#F43F5E] font-bold flex items-center gap-0.5 font-gothic">
            ATK
          </span>
        )}
      </div>

      {/* Conteúdo da Célula (Criatura, Obstáculo, Núcleo) */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        {children}
      </div>

      <div className="w-full h-0.5" />
    </div>
  );
}
