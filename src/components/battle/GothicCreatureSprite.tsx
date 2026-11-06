"use client";

import React from "react";
import { BoardUnit } from "@/types/game";
import { CreatureSprite2D } from "./CreatureSprite2D";

interface GothicCreatureSpriteProps {
  unit: BoardUnit;
  isHit?: boolean;
  isDying?: boolean;
  isAttacking?: boolean;
}

export function GothicCreatureSprite({
  unit,
  isHit = false,
  isDying = false,
  isAttacking = false,
}: GothicCreatureSpriteProps) {
  const isPlayer = unit.owner === "PLAYER";
  const hpRatio = Math.max(0, Math.min(1, unit.currentHp / unit.maxHp));

  // Delay determinístico de respiração para não sincronizar todas as tropas
  const breathingDelay = `${
    ((unit.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 7) *
      0.35).toFixed(2)
  }s`;

  if (isDying) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center animate-tombstone-dissolve">
        {/* Lápide Rachada de Pedra em Nanquim (Morte) */}
        <svg viewBox="0 0 40 46" className="w-10 h-12 filter drop-shadow-[0_0_8px_#b82923]">
          <path d="M8 44V16C8 6 32 6 32 16V44H8Z" fill="#1A1820" stroke="#09080B" strokeWidth="2" />
          <path d="M16 20L24 20M20 16L20 28" stroke="#8C1D18" strokeWidth="1.8" />
          <path d="M12 28L18 34L15 44" stroke="#09080B" strokeWidth="1.5" fill="none" />
        </svg>
        <span className="text-[8px] font-gothic font-bold text-[#b82923] uppercase mt-0.5 tracking-wider">
          Abatido
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group relative w-full h-full flex flex-col items-center justify-between select-none ${
        isHit ? "animate-hit-shake z-30" : ""
      }`}
    >
      {/* ======================================================== */}
      {/* 1. TOOLTIP FLUTUANTE DE DETALHES (Hover na Criatura)    */}
      {/* ======================================================== */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#09080B]/95 border border-[#3A3542] px-2.5 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.9)] flex flex-col items-center">
        <span className="text-[10px] font-gothic font-black text-[#C8B99E] leading-tight">
          {unit.card.name}
        </span>
        <div className="flex items-center gap-1.5 text-[8px] font-parchment text-[#9E8C70]">
          <span>
            {unit.card.attackType === "LINE_OF_SIGHT"
              ? "🎯 Visão Direta"
              : "🏹 Arremesso"}
          </span>
          <span>&middot;</span>
          <span className="text-[#F29F3D] font-numbers font-bold">
            Alcance {unit.card.rangeTiles}
          </span>
          <span>&middot;</span>
          <span className="text-[#4ade80] font-numbers font-bold">
            Mov {unit.card.movementTiles}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SOMBRA OVAL DE NANQUIM & AURA SUTIL NOS PÉS           */}
      {/* ======================================================== */}
      <div className="absolute bottom-3 inset-x-0.5 h-4 pointer-events-none z-0">
        <svg viewBox="0 0 60 18" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`aura-${unit.id}`} cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={isPlayer ? "#2E8B78" : "#8C1D18"}
                stopOpacity="0.5"
              />
              <stop
                offset="60%"
                stopColor={isPlayer ? "#D97724" : "#6B2D84"}
                stopOpacity="0.25"
              />
              <stop offset="100%" stopColor="#09080B" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Aura Suave Colorida nos Pés */}
          <ellipse cx="30" cy="9" rx="27" ry="8" fill={`url(#aura-${unit.id})`} />
          {/* Sombra de Nanquim sob a Base */}
          <ellipse cx="30" cy="9" rx="20" ry="5.5" fill="#09080B" opacity="0.85" />
          <ellipse cx="30" cy="9" rx="16" ry="3.5" fill="none" stroke="#09080B" strokeWidth="0.8" />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 3. SPRITE 2D DE CORPO INTEIRO (Darkest Dungeon 2D)       */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 w-full h-[82%] flex items-center justify-center filter drop-shadow-[0_3px_5px_#09080B] ${
          !isHit ? "animate-puppet-breathing" : ""
        } ${isAttacking ? "scale-110" : ""}`}
        style={{ animationDelay: breathingDelay }}
      >
        <CreatureSprite2D card={unit.card} isPlayer={isPlayer} />

        {/* Efeito de Sangue em Caso de Dano */}
        {isHit && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#B82923]/40 blur-xs animate-ping" />
            <span className="text-[#B82923] font-black text-base absolute -top-2 animate-bounce">
              💥
            </span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. HUD MINIMALISTA NOS PÉS DA CRIATURA                   */}
      {/* ======================================================== */}
      <div className="absolute bottom-0 inset-x-0.5 z-20 flex flex-col gap-0.5 pointer-events-none select-none">
        {/* Barra de Vida Fina em Vermelho-Sangue ou Verde */}
        <div className="w-full h-1 bg-[#09080B] border border-[#26232C] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isPlayer
                ? "bg-gradient-to-r from-[#166534] via-[#22c55e] to-[#4ade80]"
                : "bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#ef4444]"
            }`}
            style={{ width: `${Math.max(hpRatio * 100, 4)}%` }}
          />
        </div>

        {/* Insígnias Compactas: Dano, Ação (MOV / ATK) e Vida */}
        <div className="flex items-center justify-between px-1 py-0.5 bg-[#09080B]/90 rounded border border-[#26232C]/80 shadow">
          {/* Dano (Ícone de Espada Quebrada + Valor) */}
          <div className="flex items-center gap-0.5 text-[#F29F3D]">
            <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
              <path d="M14.5 1.5L9.5 6.5L10.5 7.5L11.5 6.5L12 7L9 10L9.5 10.5L10.5 9.5L11 10L6.5 14.5L5 13L9.5 8.5L8.5 7.5L7.5 8.5L7 8L10 5L9.5 4.5L8.5 5.5L8 5L12.5 0.5L14.5 1.5Z" />
            </svg>
            <span className="text-[8px] font-numbers font-black leading-none">
              {unit.card.damage}
            </span>
          </div>

          {/* Pontos de Ação (MOV & ATK) */}
          <div className="flex items-center gap-1">
            {/* Movimento Disponível */}
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                !unit.hasMoved
                  ? isPlayer
                    ? "bg-[#4ade80] shadow-[0_0_4px_#4ade80]"
                    : "bg-[#a855f7] shadow-[0_0_4px_#a855f7]"
                  : "bg-[#26232C] opacity-35"
              }`}
              title={!unit.hasMoved ? "Movimento Disponível" : "Movimento Esgotado"}
            />
            {/* Ataque Disponível */}
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                !unit.hasAttacked
                  ? "bg-[#F29F3D] shadow-[0_0_4px_#F29F3D]"
                  : "bg-[#26232C] opacity-35"
              }`}
              title={!unit.hasAttacked ? "Ataque Disponível" : "Ataque Esgotado"}
            />
          </div>

          {/* Vida Atual (Ícone de Coração + Valor) */}
          <div className="flex items-center gap-0.5 text-[#B82923]">
            <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 fill-current">
              <path d="M8 14S1.5 9.5 1.5 5.25A3.75 3.75 0 0 1 8 3.125A3.75 3.75 0 0 1 14.5 5.25C14.5 9.5 8 14 8 14Z" />
            </svg>
            <span className="text-[8px] font-numbers font-black leading-none text-[#C8B99E]">
              {unit.currentHp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
