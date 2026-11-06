"use client";

import { useMemo } from "react";
import { BoardUnit, GridTile } from "@/types/game";
import {
  checkLineOfSight,
  checkArremesso,
  FloatingDamage,
} from "@/lib/tactics/combat";
import { AbilityVfxData } from "@/lib/abilities";
import { ShieldAlert, Skull, Flame, Droplets, Sparkles, Zap } from "lucide-react";

interface CombatOverlayProps {
  attacker: BoardUnit | null;
  targetCoord: { x: number; y: number } | null;
  grid: GridTile[][];
  units: BoardUnit[];
  floatingDamages: FloatingDamage[];
  activeAbilityVfx?: AbilityVfxData | null;
}

export function CombatOverlay({
  attacker,
  targetCoord,
  grid,
  units,
  floatingDamages,
  activeAbilityVfx = null,
}: CombatOverlayProps) {
  const cellStride = 90;
  const halfCell = 45;

  const trajectory = useMemo(() => {
    if (!attacker || !targetCoord) return null;
    if (attacker.x === targetCoord.x && attacker.y === targetCoord.y) return null;

    const range = attacker.card.rangeTiles || 1;
    const distance = Math.max(
      Math.abs(targetCoord.x - attacker.x),
      Math.abs(targetCoord.y - attacker.y)
    );

    if (distance > range) return null;

    const attackType = attacker.card.attackType || "LINE_OF_SIGHT";

    if (attackType === "LINE_OF_SIGHT") {
      const los = checkLineOfSight(
        attacker.x,
        attacker.y,
        targetCoord.x,
        targetCoord.y,
        grid,
        units
      );
      return {
        type: "LINE_OF_SIGHT" as const,
        isBlocked: los.isBlocked,
        blockedAt: los.blockedAt,
        x1: attacker.x * cellStride + halfCell,
        y1: attacker.y * cellStride + halfCell,
        x2: targetCoord.x * cellStride + halfCell,
        y2: targetCoord.y * cellStride + halfCell,
      };
    } else {
      const arremesso = checkArremesso(
        attacker.x,
        attacker.y,
        targetCoord.x,
        targetCoord.y,
        range
      );
      if (!arremesso.isPossible) return null;

      const x1 = attacker.x * cellStride + halfCell;
      const y1 = attacker.y * cellStride + halfCell;
      const x2 = targetCoord.x * cellStride + halfCell;
      const y2 = targetCoord.y * cellStride + halfCell;

      // Cálculo do ápice parabólico por cima das coberturas
      const midX = (x1 + x2) / 2;
      const midY = Math.min(y1, y2) - 75;

      return {
        type: "ARREMESSO" as const,
        isBlocked: false,
        x1,
        y1,
        x2,
        y2,
        midX,
        midY,
      };
    }
  }, [attacker, targetCoord, grid, units]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Camada SVG para as Trajetórias */}
      {trajectory && (
        <svg className="w-full h-full absolute inset-0 overflow-visible">
          <defs>
            {/* Gradiente de Luz de Tocha Incandescente para o Arco de Arremesso */}
            <linearGradient id="torchArcGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97724" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FEF08A" stopOpacity="1" />
              <stop offset="100%" stopColor="#F29F3D" stopOpacity="0.9" />
            </linearGradient>

            {/* Gradiente de Tiro Direto */}
            <linearGradient id="directShot" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2e8b78" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="1" />
            </linearGradient>
          </defs>

          {trajectory.type === "LINE_OF_SIGHT" ? (
            trajectory.isBlocked ? (
              // Linha Tracejada Sangrenta de Bloqueio
              <g>
                <line
                  x1={trajectory.x1}
                  y1={trajectory.y1}
                  x2={trajectory.x2}
                  y2={trajectory.y2}
                  stroke="#b82923"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
                {trajectory.blockedAt && (
                  <circle
                    cx={trajectory.blockedAt.x * cellStride + halfCell}
                    cy={trajectory.blockedAt.y * cellStride + halfCell}
                    r="16"
                    fill="#8c1d18"
                    fillOpacity="0.45"
                    stroke="#b82923"
                    strokeWidth="2.5"
                    className="animate-ping"
                  />
                )}
              </g>
            ) : (
              // Linha Desobstruída
              <line
                x1={trajectory.x1}
                y1={trajectory.y1}
                x2={trajectory.x2}
                y2={trajectory.y2}
                stroke="url(#directShot)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_10px_rgba(74,222,128,0.7)]"
              />
            )
          ) : (
            // Curva Parabólica Iluminada de Arremesso por Cima do Obstáculo
            <g>
              {/* Sombra suave do arco no chão */}
              <line
                x1={trajectory.x1}
                y1={trajectory.y1}
                x2={trajectory.x2}
                y2={trajectory.y2}
                stroke="#09080B"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* Arco Pontilhado Iluminado Passando por Cima do Sarcófago/Pilar */}
              <path
                d={`M ${trajectory.x1} ${trajectory.y1} Q ${trajectory.midX} ${trajectory.midY} ${trajectory.x2} ${trajectory.y2}`}
                fill="none"
                stroke="url(#torchArcGold)"
                strokeWidth="4"
                strokeDasharray="6 4"
                className="drop-shadow-[0_0_14px_rgba(242,159,61,0.95)] animate-pulse"
              />

              {/* Orbe / Projétil Incandescente no Ápice da Trajetória */}
              <circle
                cx={trajectory.midX}
                cy={trajectory.midY}
                r="6"
                fill="#FEF08A"
                stroke="#D97724"
                strokeWidth="2"
                className="animate-torch filter drop-shadow-[0_0_8px_#F29F3D]"
              />
              <circle cx={trajectory.midX} cy={trajectory.midY} r="2.5" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      )}

      {/* Ícone de Bloqueio se a Linha de Visão estiver Obstruída */}
      {trajectory?.type === "LINE_OF_SIGHT" && trajectory.isBlocked && trajectory.blockedAt && (
        <div
          className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-[#1a0808] border-2 border-[#b82923] text-[#fca5a5] p-1.5 shadow-[0_0_20px_rgba(184,41,35,0.85)]"
          style={{
            left: `${trajectory.blockedAt.x * cellStride + halfCell}px`,
            top: `${trajectory.blockedAt.y * cellStride + halfCell}px`,
          }}
          title={
            trajectory.blockedAt.reason === "OBSTACLE"
              ? "Tiro bloqueado pelo obstáculo gótico!"
              : "Tiro bloqueado por outra criatura no caminho!"
          }
        >
          <ShieldAlert className="w-5 h-5 text-[#b82923] animate-bounce" />
        </div>
      )}

      {/* Destaque no Alvo para Arremesso */}
      {trajectory?.type === "ARREMESSO" && (
        <div
          className="absolute z-40 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${trajectory.x2}px`,
            top: `${trajectory.y2}px`,
          }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#D97724] bg-[#D97724]/20 animate-ping" />
        </div>
      )}

      {/* Rastro de Velocidade para Habilidade DASH_JUMP */}
      {activeAbilityVfx?.effectType === "DASH_JUMP" &&
        activeAbilityVfx.origin &&
        activeAbilityVfx.destination && (
          <svg className="w-full h-full absolute inset-0 overflow-visible z-40">
            <line
              x1={activeAbilityVfx.origin.x * cellStride + halfCell}
              y1={activeAbilityVfx.origin.y * cellStride + halfCell}
              x2={activeAbilityVfx.destination.x * cellStride + halfCell}
              y2={activeAbilityVfx.destination.y * cellStride + halfCell}
              stroke="#22D3EE"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.45"
              className="animate-pulse"
            />
            <line
              x1={activeAbilityVfx.origin.x * cellStride + halfCell}
              y1={activeAbilityVfx.origin.y * cellStride + halfCell}
              x2={activeAbilityVfx.destination.x * cellStride + halfCell}
              y2={activeAbilityVfx.destination.y * cellStride + halfCell}
              stroke="#ECFEFF"
              strokeWidth="3"
              strokeDasharray="10 6"
              strokeLinecap="round"
            />
          </svg>
        )}

      {/* Floating Damage & Status Numbers (Sangue, Veneno, Cura & Habilidade) */}
      {floatingDamages.map((fd) => {
        const isPoison = fd.variant === "POISON";
        const isHeal = fd.variant === "HEAL";
        const isAbility = fd.variant === "ABILITY";

        return (
          <div
            key={fd.id}
            className="absolute z-50 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-floating-damage whitespace-nowrap"
            style={{
              left: `${fd.x * cellStride + halfCell}px`,
              top: `${fd.y * cellStride + halfCell - 20}px`,
            }}
          >
            <div
              className={`px-3 py-1 border-3 shadow-[6px_6px_0px_#09080B] flex items-center gap-1.5 ${
                isPoison
                  ? "bg-[#052E16] border-[#4ADE80] shadow-[0_0_20px_rgba(74,222,128,0.9)]"
                  : isHeal
                  ? "bg-[#064E3B] border-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.9)]"
                  : isAbility
                  ? "bg-[#1E1B4B] border-[#A855F7] shadow-[0_0_22px_rgba(168,85,247,0.9)]"
                  : fd.isFatal
                  ? "bg-[#09080B] border-[#B82923] shadow-[0_0_25px_rgba(184,41,35,0.95)]"
                  : "bg-[#140809] border-[#8C1D18] shadow-[0_0_15px_rgba(140,29,24,0.7)]"
              }`}
            >
              {isPoison ? (
                <Droplets className="w-4 h-4 text-[#4ADE80] animate-bounce shrink-0" />
              ) : isHeal ? (
                <Sparkles className="w-4 h-4 text-[#34D399] animate-pulse shrink-0" />
              ) : isAbility ? (
                <Zap className="w-4 h-4 text-[#C084FC] animate-pulse shrink-0" />
              ) : fd.isFatal ? (
                <Skull className="w-5 h-5 text-[#B82923] animate-pulse shrink-0" />
              ) : (
                <Flame className="w-4 h-4 text-[#F29F3D] animate-torch shrink-0" />
              )}
              <span
                className={`font-gothic font-black text-xl md:text-2xl tracking-wider drop-shadow-[0_2px_4px_#000] ${
                  isPoison
                    ? "text-[#4ADE80]"
                    : isHeal
                    ? "text-[#6EE7B7]"
                    : isAbility
                    ? "text-[#E9D5FF]"
                    : "text-[#FEF08A]"
                }`}
              >
                {fd.label ? fd.label : isHeal ? `+${fd.damage}` : `-${fd.damage}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
