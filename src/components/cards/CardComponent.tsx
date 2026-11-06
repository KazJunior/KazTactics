"use client";

import React from "react";
import { Card } from "@/db/schema";
import { DrawnCard } from "@/types";
import { RARITY_THEMES, CARD_TYPE_THEMES } from "@/lib/cardVisuals";
import {
  ManaFlameSeal,
  BrokenSwordIcon,
  AnatomicalHeartIcon,
  ArmoredBootIcon,
  MysticSightIcon,
  LineOfSightSeal,
  HighArcLobSeal,
} from "./CardWoodcutIcons";
import { CutoutMonsterSprite } from "../battle/CutoutMonsterSprite";
import { getCreatureAbility } from "@/lib/abilities";
import {
  MAX_CARD_LEVEL,
  STAT_BONUS_PER_LEVEL,
  getUpgradeRequirement,
  ScaledCard,
} from "@/lib/cardProgression";
import {
  Sparkle,
  Plus,
  Minus,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowUpCircle,
  Coins,
} from "lucide-react";

/**
 * Emblema de Mana de Losango Roxo Estelar (Usado nos placares de HUD Superior)
 */
export function AbyssalManaDiamond({
  cost,
  size = "md",
}: {
  cost?: number;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize =
    size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6";

  return (
    <div className="inline-flex items-center gap-1.5 select-none">
      <div className={`relative flex items-center justify-center ${iconSize} shrink-0`}>
        <svg
          viewBox="0 0 28 28"
          className="w-full h-full overflow-visible filter drop-shadow-[0_0_6px_rgba(168,85,247,0.85)]"
        >
          <polygon
            points="14,2 26,14 14,26 2,14"
            fill="#3B0764"
            stroke="#C084FC"
            strokeWidth="2"
          />
          <polygon points="14,5 23,14 14,23 5,14" fill="#7E22CE" />
          <path
            d="M14,6 L16,12 L22,14 L16,16 L14,22 L12,16 L6,14 L12,12 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
      {cost !== undefined && (
        <span
          className={`font-gothic font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
            size === "sm"
              ? "text-sm"
              : size === "lg"
              ? "text-xl"
              : "text-base"
          }`}
        >
          {cost}
        </span>
      )}
    </div>
  );
}

export interface CardComponentProps {
  card: Card | DrawnCard | ScaledCard;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  deckQuantity?: number;
  ownedQuantity?: number;
  level?: number;
  copiesGranted?: number;
  playerGold?: number;
  onUpgrade?: () => void;
  isUpgrading?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  canAdd?: boolean;
  showControls?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Modelo Clássico de Carta (com Custo, Nome, Raridade, Nível, Descrição e Status Táticos)
 * integrado com o design das Criaturas Novas (CutoutMonsterSprite) e Sistema de Evolução.
 */
export function CardComponent({
  card,
  size = "md",
  interactive = false,
  isSelected = false,
  isPlayable = true,
  deckQuantity,
  ownedQuantity,
  level,
  copiesGranted,
  playerGold,
  onUpgrade,
  isUpgrading = false,
  onAdd,
  onRemove,
  canAdd = true,
  showControls = false,
  isNew = false,
  onClick,
  className = "",
}: CardComponentProps) {
  const isSpell = card.category === "FEITICO";
  const rarityTheme = RARITY_THEMES[card.rarity] || RARITY_THEMES.COMUM;
  const typeTheme = CARD_TYPE_THEMES[card.type] || CARD_TYPE_THEMES.HUMANOIDES;
  const creatureAbility = !isSpell ? getCreatureAbility(card.name, card.type) : null;

  const effectiveLevel = Math.max(
    1,
    Math.min(MAX_CARD_LEVEL, level ?? (card as ScaledCard).level ?? 1)
  );
  const statBonusPct = Math.round((effectiveLevel - 1) * STAT_BONUS_PER_LEVEL * 100);
  const upgradeReq = getUpgradeRequirement(effectiveLevel);
  const effectiveCopies =
    ownedQuantity !== undefined
      ? ownedQuantity
      : (card as DrawnCard).newQuantity;
  const effectiveCopiesGranted =
    copiesGranted ?? (card as DrawnCard).copiesGranted;

  const canUpgradeCopies =
    upgradeReq !== null &&
    effectiveCopies !== undefined &&
    effectiveCopies >= upgradeReq.copiesRequired;
  const canAffordUpgrade =
    upgradeReq !== null &&
    (playerGold === undefined || playerGold >= upgradeReq.goldCost);

  const maxAllocatableInDeck = Math.max(
    ownedQuantity ?? 0,
    effectiveLevel > 1 ? 4 : ownedQuantity ?? 0
  );

  const isFullyAllocated =
    ownedQuantity !== undefined &&
    deckQuantity !== undefined &&
    deckQuantity >= maxAllocatableInDeck;

  const isSmall = size === "sm";

  // Cor da moldura conforme raridade ou seleção (fiel ao modelo clássico da imagem 2)
  const frameBorderColor = isSelected
    ? "#0EA5E9"
    : card.rarity === "RARO"
    ? "#0EA5E9"
    : card.rarity === "LENDARIO"
    ? "#D97724"
    : card.rarity === "EPICO"
    ? "#A855F7"
    : card.rarity === "INCOMUM"
    ? "#10B981"
    : "#3A3542";

  return (
    <div
      onClick={() => {
        if (onClick && (isPlayable || isSelected)) {
          onClick();
        }
      }}
      className={`group relative select-none transition-all duration-200 flex flex-col justify-between rounded-lg bg-[#09080B] ${
        isSmall
          ? "w-44 sm:w-46 p-2 text-xs"
          : "w-full max-w-[260px] p-3 text-sm"
      } ${
        isSelected
          ? "-translate-y-3 scale-[1.03] z-30 shadow-[0_0_28px_rgba(14,165,233,0.65)]"
          : interactive && isPlayable
          ? "hover:-translate-y-2 hover:scale-[1.02] cursor-pointer z-10 hover:z-20 shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
          : !isPlayable
          ? "opacity-55 grayscale cursor-not-allowed"
          : "shadow-[0_8px_20px_rgba(0,0,0,0.85)]"
      } ${className}`}
      style={{
        border: `2px solid ${frameBorderColor}`,
      }}
    >
      {/* Moldura Dupla Interna Clássica */}
      <div
        className="absolute inset-[3px] rounded-[5px] pointer-events-none border"
        style={{
          borderColor: isSelected
            ? "rgba(56, 189, 248, 0.45)"
            : "rgba(58, 53, 66, 0.65)",
        }}
      />

      {/* Cantoneiras Góticas Internas */}
      <div
        className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l pointer-events-none"
        style={{ borderColor: frameBorderColor }}
      />
      <div
        className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r pointer-events-none"
        style={{ borderColor: frameBorderColor }}
      />
      <div
        className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l pointer-events-none"
        style={{ borderColor: frameBorderColor }}
      />
      <div
        className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r pointer-events-none"
        style={{ borderColor: frameBorderColor }}
      />

      {/* Tag de Carta Nova ou Múltiplas Cópias Recebidas (Gacha estilo Clash Royale) */}
      {(isNew || (card as DrawnCard).isNew || effectiveCopiesGranted) && (
        <div className="absolute -top-2.5 right-3 z-30 flex items-center gap-1">
          {(isNew || (card as DrawnCard).isNew) && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-lg animate-bounce">
              <Sparkle className="w-2.5 h-2.5 fill-current" /> NOVA!
            </span>
          )}
          {effectiveCopiesGranted && effectiveCopiesGranted > 0 && (
            <span className="flex items-center gap-0.5 bg-gradient-to-r from-[#10B981] to-[#34D399] text-[#09080B] font-numbers font-black text-[10px] px-2 py-0.5 rounded border border-[#09080B] shadow-[0_2px_8px_rgba(16,185,129,0.75)]">
              +{effectiveCopiesGranted}x Cópias
            </span>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. CABEÇALHO CLÁSSICO: CUSTO EM CHAMA, NOME, TIPO E RARIDADE */}
      {/* ======================================================== */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#221F2A]">
        {/* Selo Circular de Custo de Mana em Chama Âmbar */}
        <ManaFlameSeal cost={card.manaCost} />

        {/* Nome da Carta e Subtítulo (TIPO • MONSTRO/FEITIÇO) */}
        <div className="flex-1 px-1 min-w-0">
          <h3
            className="font-gothic font-bold text-[#E2E8F0] leading-tight truncate text-xs sm:text-[13px]"
            title={card.name}
          >
            {card.name}
          </h3>

          <div className="flex items-center gap-1 mt-0.5 truncate">
            <span
              className="text-[8px] font-gothic font-bold uppercase tracking-wider truncate"
              style={{ color: typeTheme.accentColor }}
            >
              {typeTheme.shortLabel}
            </span>
            <span className="text-[#64748B] text-[8px]">&bull;</span>
            <span
              className={`text-[8px] font-gothic font-bold uppercase tracking-wider shrink-0 ${
                isSpell ? "text-[#C084FC]" : "text-[#2E8B78]"
              }`}
            >
              {isSpell ? "FEITIÇO" : "MONSTRO"}
            </span>
          </div>
        </div>

        {/* Emblema Retangular de Raridade */}
        <div className="flex flex-col items-end shrink-0">
          <span
            className={`text-[7px] sm:text-[8px] font-gothic font-bold uppercase px-1.5 py-0.5 rounded-[3px] border ${
              card.rarity === "RARO"
                ? "bg-[#082F49] text-[#38BDF8] border-[#0EA5E9]"
                : card.rarity === "LENDARIO"
                ? "bg-[#27170A] text-[#F29F3D] border-[#D97724]"
                : card.rarity === "EPICO"
                ? "bg-[#2E1065] text-[#D8B4FE] border-[#A855F7]"
                : card.rarity === "INCOMUM"
                ? "bg-[#064E3B] text-[#6EE7B7] border-[#10B981]"
                : "bg-[#16141C] text-[#9E8C70] border-[#3A3542]"
            }`}
          >
            {rarityTheme.label}
          </span>
          {deckQuantity !== undefined && deckQuantity > 0 && (
            <span className="mt-1 flex items-center gap-0.5 bg-[#D97724] text-[#09080B] text-[8px] font-numbers font-black px-1.5 py-0.2 rounded shadow">
              <CheckCircle2 className="w-2.5 h-2.5" /> {deckQuantity}x
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. QUADRO CENTRAL COM O DESIGN DAS CRIATURAS NOVAS        */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 my-1.5 ${
          isSmall ? "h-22 sm:h-24" : "h-28 sm:h-32"
        } overflow-hidden bg-[#060509] border border-[#26232C] flex items-center justify-center p-1.5 shadow-inner`}
      >
        {/* Luz Radial Atmosférica de Fundo conforme o Tipo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${typeTheme.ornamentColor}28 0%, rgba(6,5,9,0.95) 75%)`,
          }}
        />

        {/* Criatura Nova em Destaque */}
        <div
          className={`relative z-10 ${
            isSmall ? "w-20 h-20 sm:w-22 sm:h-22" : "w-24 h-24 sm:w-28 sm:h-28"
          } flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
        >
          <CutoutMonsterSprite
            name={card.name}
            type={card.type}
            category={card.category}
            isEnemy={false}
            className="w-full h-full"
          />
        </div>

        {/* Badge de Nível da Carta (Estilo Clash Royale) + Bônus de +10%/Nível */}
        <div className="absolute top-1.5 left-1.5 z-20 flex items-center gap-1 pointer-events-none">
          <span
            className={`px-1.5 py-0.5 rounded text-[9px] font-numbers font-black border shadow-md ${
              effectiveLevel >= MAX_CARD_LEVEL
                ? "bg-gradient-to-r from-[#D97724] to-[#FACC15] text-[#09080B] border-[#FEF08A]"
                : effectiveLevel > 1
                ? "bg-[#1E1B4B]/95 text-[#38BDF8] border-[#38BDF8]/70"
                : "bg-[#09080B]/90 text-[#CBD5E1] border-[#3A3542]"
            }`}
          >
            Nv. {effectiveLevel}
          </span>
          {statBonusPct > 0 && (
            <span className="px-1 py-0.5 rounded bg-[#064E3B]/95 border border-[#10B981]/70 text-[#6EE7B7] text-[8px] font-numbers font-bold shadow">
              +{statBonusPct}%
            </span>
          )}
        </div>

        {/* Barra de Progresso de Cópias na Abertura de Pacotes */}
        {effectiveCopiesGranted !== undefined &&
          effectiveCopies !== undefined &&
          !showControls && (
            <div className="absolute bottom-1.5 inset-x-2 z-20 bg-[#09080B]/90 border border-[#3A3542] rounded px-1.5 py-0.5 flex items-center justify-between text-[9px] font-numbers">
              <span className="text-[#CBD5E1] font-bold">Cópias:</span>
              <span
                className={`font-black ${
                  canUpgradeCopies ? "text-[#4ADE80]" : "text-[#FACC15]"
                }`}
              >
                {upgradeReq
                  ? `${effectiveCopies} / ${upgradeReq.copiesRequired}`
                  : `${effectiveCopies} (MÁX)`}
              </span>
            </div>
          )}

        {/* Linha Fina Colorida na Base do Quadro (Fiel ao modelo antigo) */}
        <div
          className="absolute bottom-0 inset-x-0 h-[2px]"
          style={{ backgroundColor: typeTheme.ornamentColor }}
        />
      </div>

      {/* ======================================================== */}
      {/* 3. CAIXA DE DESCRIÇÃO / LORE E BOX DE HABILIDADE ÚNICA    */}
      {/* ======================================================== */}
      <div className="relative z-10 space-y-1.5 mb-2">
        <div className="px-2 py-1 bg-[#0E0D12] border border-[#221F28] rounded-[3px]">
          <p className="font-parchment italic text-[#9E8C70] leading-snug line-clamp-2 text-[10px] sm:text-[11px]">
            &ldquo;{card.description}&rdquo;
          </p>
        </div>

        {creatureAbility && (
          <div
            className="px-2 py-1.5 rounded-[4px] bg-gradient-to-br from-[#19102C] via-[#120D20] to-[#0B0914] border border-[#7C3AED]/55 shadow-[inset_0_1px_0_rgba(192,132,252,0.2)] space-y-0.5"
            title={`${creatureAbility.name} (Recarga: ${creatureAbility.cooldown} Turnos) — ${creatureAbility.description}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="flex items-center gap-1 font-gothic font-bold text-[#E9D5FF] text-[9px] sm:text-[10px] truncate">
                <Zap className="w-3 h-3 text-[#FACC15] fill-[#FACC15]/30 shrink-0" />
                <span className="truncate text-[#FDE047]">{creatureAbility.name}</span>
              </span>
              <span className="font-numbers font-bold text-[#E9D5FF] bg-[#2E1065]/90 border border-[#A855F7]/50 px-1.5 py-[1px] rounded text-[8px] shrink-0">
                ⏱️ Recarga: {creatureAbility.cooldown} Turnos
              </span>
            </div>
            <p className="font-parchment text-[#CBD5E1] text-[9px] sm:text-[10px] leading-tight line-clamp-2">
              {creatureAbility.description}
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. RODAPÉ DE STATUS TÁTICOS E TRAJETÓRIA                  */}
      {/* ======================================================== */}
      <div className="relative z-10 pt-1 border-t border-[#221F2A]">
        {isSpell ? (
          <div className="flex items-center justify-between bg-[#0E0D12] border border-[#6B2D84]/60 rounded-[3px] px-2 py-1.5">
            <div className="flex items-center gap-1 text-[10px] font-gothic font-bold text-[#C084FC]">
              <Sparkles className="w-3 h-3 text-[#9D4EDD]" />
              <span>Feitiço Instantâneo</span>
            </div>
            {card.rangeTiles ? (
              <span className="text-[10px] font-numbers font-bold text-[#38BDF8]">
                Alcance: {card.rangeTiles}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* Barra de 4 Atributos: Dano, HP, Movimento, Alcance */}
            <div className="grid grid-cols-4 gap-1 w-full text-center">
              {/* DANO */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#0E0D12] border border-[#221F28] px-1 py-0.5 rounded-[3px] min-w-0"
                title="Poder de Ataque (Dano)"
              >
                <BrokenSwordIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-numbers font-black text-[#D97724] text-[11px] truncate">
                  {card.damage ?? "-"}
                </span>
              </div>

              {/* HP */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#0E0D12] border border-[#221F28] px-1 py-0.5 rounded-[3px] min-w-0"
                title="Pontos de Vida (HP)"
              >
                <AnatomicalHeartIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-numbers font-black text-[#DC2626] text-[11px] truncate">
                  {card.hp ?? "-"}
                </span>
              </div>

              {/* MOVIMENTO */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#0E0D12] border border-[#221F28] px-1 py-0.5 rounded-[3px] min-w-0"
                title="Casas de Movimento"
              >
                <ArmoredBootIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-numbers font-bold text-[#2E8B78] text-[11px] truncate">
                  {card.movementTiles ?? "-"}
                </span>
              </div>

              {/* ALCANCE */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#0E0D12] border border-[#221F28] px-1 py-0.5 rounded-[3px] min-w-0"
                title="Casas de Alcance"
              >
                <MysticSightIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-numbers font-bold text-[#F29F3D] text-[11px] truncate">
                  {card.rangeTiles ?? "-"}
                </span>
              </div>
            </div>

            {/* Linha de Trajetória: TRAJETÓRIA: [LINHA DIRETA / ARREMESSO] */}
            {card.attackType && (
              <div className="flex items-center justify-between pt-1 border-t border-[#18161E]">
                <span className="text-[8px] font-gothic text-[#64748B] uppercase tracking-wider">
                  TRAJETÓRIA:
                </span>
                {card.attackType === "LINE_OF_SIGHT" ? (
                  <LineOfSightSeal className="w-3.5 h-3.5" />
                ) : (
                  <HighArcLobSeal className="w-3.5 h-3.5" />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. BARRA DE EVOLUÇÃO (CLASH ROYALE) E CONTROLES DO DECK  */}
      {/* ======================================================== */}
      {showControls && (
        <div className="relative z-10 mt-2 pt-2 border-t border-[#221F2A] space-y-2">
          {/* Barra de Progresso de Cópias para o Próximo Nível */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px] font-numbers">
              <span className="text-[#94A3B8] font-bold">
                {upgradeReq
                  ? `Próximo: Nv. ${upgradeReq.toLevel} (+${
                      (upgradeReq.toLevel - 1) * 5
                    }%)`
                  : "Nível Máximo Atingido"}
              </span>
              <span
                className={`font-black ${
                  !upgradeReq
                    ? "text-[#FACC15]"
                    : canUpgradeCopies
                    ? "text-[#4ADE80]"
                    : "text-[#E2E8F0]"
                }`}
              >
                {upgradeReq
                  ? `${ownedQuantity ?? 0} / ${upgradeReq.copiesRequired} cópias`
                  : "NV. 10 MÁX"}
              </span>
            </div>

            {/* Barra Visual estilo Clash Royale */}
            <div className="w-full h-2.5 bg-[#14121A] border border-[#2E2A38] rounded-full overflow-hidden p-[1px]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  !upgradeReq
                    ? "bg-gradient-to-r from-[#D97724] to-[#FACC15]"
                    : canUpgradeCopies
                    ? "bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#4ADE80] shadow-[0_0_8px_#4ADE80]"
                    : "bg-gradient-to-r from-[#0284C7] to-[#38BDF8]"
                }`}
                style={{
                  width: !upgradeReq
                    ? "100%"
                    : `${Math.min(
                        100,
                        Math.round(
                          ((ownedQuantity ?? 0) / upgradeReq.copiesRequired) *
                            100
                        )
                      )}%`,
                }}
              />
            </div>

            {/* Botão de Evoluir Carta com Ouro */}
            {upgradeReq && onUpgrade && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgrade();
                }}
                disabled={!canUpgradeCopies || !canAffordUpgrade || isUpgrading}
                className={`w-full mt-1 py-1.5 px-2 rounded-md font-gothic font-bold text-[10px] border flex items-center justify-center gap-1.5 transition-all ${
                  canUpgradeCopies && canAffordUpgrade
                    ? "bg-gradient-to-r from-[#059669] via-[#10B981] to-[#059669] hover:brightness-110 text-[#09080B] border-[#6EE7B7] shadow-[0_0_12px_rgba(16,185,129,0.5)] cursor-pointer"
                    : "bg-[#16141D] text-[#64748B] border-[#26232C] opacity-75 cursor-not-allowed"
                }`}
                title={
                  !canUpgradeCopies
                    ? `Faltam ${
                        upgradeReq.copiesRequired - (ownedQuantity ?? 0)
                      } cópia(s) para evoluir para o Nível ${upgradeReq.toLevel}`
                    : !canAffordUpgrade
                    ? `Ouro insuficiente (${upgradeReq.goldCost} necessários)`
                    : `Gastar ${upgradeReq.copiesRequired} cópias e ${upgradeReq.goldCost} de Ouro para evoluir ao Nível ${upgradeReq.toLevel} (+${Math.round(STAT_BONUS_PER_LEVEL * 100)}% de Status)`
                }
              >
                <ArrowUpCircle
                  className={`w-3.5 h-3.5 shrink-0 ${
                    canUpgradeCopies && canAffordUpgrade ? "animate-bounce" : ""
                  }`}
                />
                <span>
                  {isUpgrading
                    ? "Evoluindo..."
                    : `Evoluir Nv. ${upgradeReq.toLevel}`}
                </span>
                <span className="inline-flex items-center gap-0.5 font-numbers font-black px-1.5 py-[0.5px] rounded bg-black/25 text-[#FDE047]">
                  <Coins className="w-2.5 h-2.5 text-[#FACC15]" />
                  {upgradeReq.goldCost}
                </span>
              </button>
            )}
          </div>

          {/* Controles de Alocação no Baralho (+ / -) */}
          <div className="pt-1.5 border-t border-[#1C1924] flex items-center justify-between gap-2">
            <div className="text-[10px] font-numbers text-[#94A3B8]">
              No Deck:{" "}
              <strong className="text-[#F8FAFC]">
                {deckQuantity ?? 0}/{maxAllocatableInDeck}
              </strong>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemove) onRemove();
                }}
                disabled={deckQuantity === undefined || deckQuantity <= 0}
                className="p-1 rounded bg-[#1A1822] hover:bg-[#EF4444]/50 text-[#F8FAFC] border border-white/10 disabled:opacity-25 cursor-pointer"
                title="Remover do Baralho"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="w-5 text-center text-xs font-numbers font-black text-[#F29F3D]">
                {deckQuantity ?? 0}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAdd) onAdd();
                }}
                disabled={!canAdd || isFullyAllocated}
                className="p-1 rounded bg-[#D97724] hover:bg-[#F29F3D] text-[#09080B] font-black disabled:opacity-25 cursor-pointer"
                title="Adicionar ao Baralho"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
