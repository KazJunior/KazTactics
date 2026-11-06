"use client";

import React from "react";
import { BoardUnit, MAX_UNIT_ACTIONS_PER_TURN } from "@/types/game";
import { CutoutMonsterSprite } from "./CutoutMonsterSprite";
import { getCreatureAbility } from "@/lib/abilities";
import { getEffectiveUnitDamage } from "@/lib/tactics/combat";

interface GothicCreatureSpriteProps {
  unit: BoardUnit;
  isHit?: boolean;
  isDying?: boolean;
  isAttacking?: boolean;
}

/**
 * Renderização da Unidade no Tabuleiro fiel à imagem modelo:
 * - Barra de Vida flutuante limpa ACIMA da cabeça (Azul-Ciano para Jogador, Vermelho-Carmesim para Inimigo)
 * - Base de energia brilhante sob os pés
 * - Criatura de corpo inteiro sem caixas bloqueando a base
 */
export function GothicCreatureSprite({
  unit,
  isHit = false,
  isDying = false,
  isAttacking = false,
}: GothicCreatureSpriteProps) {
  const isPlayer = unit.owner === "PLAYER";
  const hpRatio = Math.max(0, Math.min(1, unit.currentHp / unit.maxHp));
  const unitLevel = (unit.card as any).level || 1;
  const ability = getCreatureAbility(unit.card.name, unit.card.type);
  const abilityCd = unit.abilityCooldown ?? 0;
  const statusEffects = unit.statusEffects || [];
  const effectiveDamage = getEffectiveUnitDamage(unit);
  const poisonEffect = statusEffects.find((s) => s.type === "POISON" && s.turnsLeft > 0);
  const rootedEffect = statusEffects.find((s) => s.type === "ROOTED" && s.turnsLeft > 0);
  const weakenedEffect = statusEffects.find((s) => s.type === "WEAKENED" && s.turnsLeft > 0);
  const isPoisoned = Boolean(poisonEffect);
  const isRooted = Boolean(rootedEffect);
  const isWeakened = Boolean(weakenedEffect);
  const actionsLeft = unit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN;
  const isAbilityReady = Boolean(ability && abilityCd === 0 && actionsLeft > 0);

  const breathingDelay = `${((unit.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 7) *
      0.35).toFixed(2)
    }s`;

  if (isDying) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center animate-tombstone-dissolve">
        <svg viewBox="0 0 40 46" className="w-10 h-12 filter drop-shadow-[0_0_10px_#e11d48]">
          <polygon points="20,4 32,22 20,42 8,22" fill="#4C0519" stroke="#F43F5E" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`group relative w-full h-full flex flex-col items-center justify-center select-none ${isHit ? "animate-hit-shake z-30" : ""
        }`}
    >
      {/* ======================================================== */}
      {/* 1. TOOLTIP FLUTUANTE DE DETALHES (Hover na Criatura)    */}
      {/* ======================================================== */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap bg-[#0E0B1A]/95 border border-[#7C3AED]/60 px-2.5 py-1.5 rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.9)] flex flex-col items-center">
        <span className="text-[10px] font-gothic font-bold text-[#F8FAFC] leading-tight">
          {unit.card.name}{" "}
          <span className="text-[#FACC15] font-numbers">Nv.{unitLevel}</span>
        </span>
        <div className="flex items-center gap-2 text-[9px] font-numbers text-[#CBD5E1] mt-0.5">
          <span className="text-[#38BDF8] font-bold">HP {unit.currentHp}/{unit.maxHp}</span>
          <span>&bull;</span>
          <span className={isWeakened ? "text-[#FACC15] font-bold" : "text-[#F43F5E] font-bold"}>
            ATK {effectiveDamage}
          </span>
          <span>&bull;</span>
          <span className="text-[#C084FC]">Alc {unit.card.rangeTiles}</span>
          <span>&bull;</span>
          <span className="text-[#4ADE80] font-bold">
            Ações {actionsLeft}/{MAX_UNIT_ACTIONS_PER_TURN}
          </span>
        </div>
        {ability && (
          <div className="flex items-center gap-1.5 text-[8px] font-gothic mt-0.5 text-[#E9D5FF]">
            <span>⚡ {ability.name}</span>
            <span
              className={`px-1 rounded font-numbers font-bold ${
                abilityCd === 0
                  ? "bg-[#10B981]/30 text-[#6EE7B7]"
                  : "bg-[#F59E0B]/30 text-[#FDE68A]"
              }`}
            >
              {abilityCd === 0 ? "PRONTA" : `CD: ${abilityCd}T`}
            </span>
          </div>
        )}
        {statusEffects.length > 0 && (
          <div className="flex items-center gap-1 mt-0.5 text-[8px] font-numbers font-bold">
            {isPoisoned && <span className="text-[#4ADE80]">☠ Veneno</span>}
            {isRooted && <span className="text-[#C084FC]">🕸 Enraizado (Mov 0)</span>}
            {isWeakened && <span className="text-[#FACC15]">⬇ Enf. (-30% ATK)</span>}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. BARRA DE VIDA HORIZONTAL E ÍCONES DE STATUS ACIMA     */}
      {/* ======================================================== */}
      <div className="absolute -top-3.5 inset-x-1 z-30 flex flex-col items-center pointer-events-none">
        {statusEffects.length > 0 && (
          <div className="flex items-center gap-0.5 mb-0.5">
            {poisonEffect && (
              <span
                className="px-1 py-[1px] rounded bg-[#052E16] border border-[#4ADE80] text-[7px] font-numbers font-black text-[#4ADE80] leading-none shadow-[0_0_6px_rgba(74,222,128,0.8)] flex items-center gap-0.5"
                title={`Envenenado (${poisonEffect.value} de dano/turno por ${poisonEffect.turnsLeft}T)`}
              >
                <span>☠</span>
                <span>{poisonEffect.turnsLeft}</span>
              </span>
            )}
            {rootedEffect && (
              <span
                className="px-1 py-[1px] rounded bg-[#2E1065] border border-[#C084FC] text-[7px] font-numbers font-black text-[#E9D5FF] leading-none shadow-[0_0_6px_rgba(192,132,252,0.8)] flex items-center gap-0.5"
                title={`Imobilizado (Movimento 0 por ${rootedEffect.turnsLeft}T)`}
              >
                <span>🕸</span>
                <span>{rootedEffect.turnsLeft}</span>
              </span>
            )}
            {weakenedEffect && (
              <span
                className="px-1 py-[1px] rounded bg-[#451A03] border border-[#FACC15] text-[7px] font-numbers font-black text-[#FDE047] leading-none shadow flex items-center gap-0.5"
                title={`Enfraquecido (-30% ATK por ${weakenedEffect.turnsLeft}T)`}
              >
                <span>⬇</span>
                <span>{weakenedEffect.turnsLeft}</span>
              </span>
            )}
          </div>
        )}
        <div className="w-14 md:w-16 h-2.5 bg-[#09090B]/95 border-[1.5px] border-[#09090B] rounded-[2px] shadow-[0_2px_6px_rgba(0,0,0,0.85)] overflow-hidden p-[1px]">
          <div
            className={`h-full transition-all duration-300 ${isPoisoned
                ? "bg-gradient-to-r from-[#15803D] via-[#4ADE80] to-[#86EFAC] shadow-[0_0_8px_#4ADE80]"
                : isPlayer
                ? "bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#7DD3FC] shadow-[0_0_8px_#38BDF8]"
                : "bg-gradient-to-r from-[#991B1B] via-[#EF4444] to-[#FB7185] shadow-[0_0_8px_#EF4444]"
              }`}
            style={{ width: `${Math.max(hpRatio * 100, 6)}%` }}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. AURA HEXAGONAL / BASE DE LUZ SOB OS PÉS DA UNIDADE    */}
      {/* ======================================================== */}
      <div className="absolute bottom-0.5 inset-x-0.5 h-6 pointer-events-none z-0 flex items-center justify-center">
        <svg viewBox="0 0 80 28" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <polygon
            points="40,2 74,10 74,20 40,26 6,20 6,10"
            fill={isPlayer ? "rgba(56,189,248,0.18)" : "rgba(239,68,68,0.18)"}
            stroke={isPlayer ? "#38BDF8" : "#EF4444"}
            strokeWidth="2"
            style={{
              filter: isPlayer
                ? "drop-shadow(0 0 6px rgba(56,189,248,0.8))"
                : "drop-shadow(0 0 6px rgba(239,68,68,0.8))",
            }}
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* 4. SPRITE DA CRIATURA DE CORPO INTEIRO (ZOOM APROXIMADO) */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 -mt-1.5 flex items-center justify-center ${
          !isHit ? "animate-puppet-breathing" : ""
        } ${isAttacking ? "scale-110" : ""}`}
        style={{ animationDelay: breathingDelay }}
      >
        <CutoutMonsterSprite
          name={unit.card.name}
          type={unit.card.type}
          category={unit.card.category}
          isEnemy={!isPlayer}
          className="w-full h-full scale-125"
        />

        {/* EFEITO VISUAL DE VENENO ATIVO: Bolhas verdes tóxicas subindo pelo sprite */}
        {isPoisoned && (
          <svg
            viewBox="0 0 80 80"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          >
            <g className="animate-bounce" style={{ animationDuration: "1.6s" }}>
              <circle
                cx="24"
                cy="52"
                r="4"
                fill="#4ADE80"
                fillOpacity="0.85"
                stroke="#052E16"
                strokeWidth="1.5"
              />
              <circle cx="23" cy="50.5" r="1.2" fill="#DCFCE7" />
              <circle
                cx="56"
                cy="42"
                r="3.5"
                fill="#22C55E"
                fillOpacity="0.85"
                stroke="#052E16"
                strokeWidth="1.5"
              />
              <circle cx="55" cy="40.8" r="1" fill="#DCFCE7" />
              <circle
                cx="38"
                cy="26"
                r="3"
                fill="#4ADE80"
                fillOpacity="0.8"
                stroke="#052E16"
                strokeWidth="1.2"
              />
              <circle
                cx="48"
                cy="58"
                r="2.5"
                fill="#86EFAC"
                fillOpacity="0.9"
                stroke="#052E16"
                strokeWidth="1.2"
              />
            </g>
          </svg>
        )}

        {/* EFEITO VISUAL DE IMOBILIZAÇÃO (ROOTED): Fios de teia e raízes prendendo a base */}
        {isRooted && (
          <svg
            viewBox="0 0 80 80"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              {/* Raízes/Teias cruzadas na base dos pés */}
              <path
                d="M10 66 Q40 50 70 66 M14 56 Q40 70 66 56 M22 72 L58 52 M58 72 L22 52"
                stroke="#09090B"
                strokeWidth="3.5"
                fill="none"
              />
              <path
                d="M10 66 Q40 50 70 66 M14 56 Q40 70 66 56 M22 72 L58 52 M58 72 L22 52"
                stroke="#E9D5FF"
                strokeWidth="1.8"
                strokeDasharray="4 2"
                fill="none"
              />
              <ellipse
                cx="40"
                cy="63"
                rx="26"
                ry="8"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1.6"
              />
            </g>
          </svg>
        )}

        {isHit && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#F43F5E]/50 blur-xs animate-ping" />
          </div>
        )}
      </div>

      {/* Indicadores nos pés da criatura: Habilidade Pronta (Estrela/Orbe) ou Recarga (⏳X) */}
      <div className="absolute bottom-0.5 inset-x-1 z-20 flex items-center justify-between pointer-events-none">
        {/* Esquerda da base: Nível da Carta + Orbe/Estrela de Habilidade Pronta ou Relógio de Cooldown */}
        <div className="flex items-center gap-0.5">
          {unitLevel > 1 && (
            <span className="px-1 py-[1px] rounded bg-[#1E1B4B]/95 border border-[#38BDF8]/80 text-[7px] font-numbers font-black text-[#38BDF8] leading-none shadow">
              Nv.{unitLevel}
            </span>
          )}
          {ability && (
            isAbilityReady ? (
              <span
                className={`px-1 py-[1px] rounded-full text-[7px] font-numbers font-black border flex items-center gap-0.5 leading-none animate-pulse ${
                  isPlayer
                    ? "bg-[#082F49]/95 border-[#38BDF8] text-[#FACC15] shadow-[0_0_8px_rgba(56,189,248,0.95)]"
                    : "bg-[#3B0764]/95 border-[#C084FC] text-[#FACC15] shadow-[0_0_8px_rgba(192,132,252,0.9)]"
                }`}
                title={`Habilidade Pronta: ${ability.name}`}
              >
                <span>✦</span>
              </span>
            ) : (
              <span
                className="px-1 py-[1px] rounded bg-[#09090B]/95 border border-[#52525B] text-[7px] font-numbers font-bold text-[#FDE68A] leading-none shadow"
                title={`Em Recarga (${abilityCd || ability.cooldown} turnos)`}
              >
                ⏳{abilityCd > 0 ? abilityCd : ability.cooldown}
              </span>
            )
          )}
        </div>

        {/* Direita da base: Indicador de Pontos de Ação Restantes no Turno (até 2 ações) */}
        <div
          className="flex items-center gap-0.5 bg-[#09090B]/90 px-1 py-[2px] rounded-full border border-white/15"
          title={`Ações disponíveis neste turno: ${actionsLeft}/${MAX_UNIT_ACTIONS_PER_TURN}`}
        >
          {Array.from({ length: MAX_UNIT_ACTIONS_PER_TURN }).map((_, idx) => {
            const isAvailable = idx < actionsLeft;
            return (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isAvailable
                    ? isPlayer
                      ? "bg-[#38BDF8] shadow-[0_0_5px_#38BDF8]"
                      : "bg-[#F43F5E] shadow-[0_0_5px_#F43F5E]"
                    : "bg-[#3F3F46] opacity-50"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
