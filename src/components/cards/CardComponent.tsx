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
import { CreatureSprite2D } from "../battle/CreatureSprite2D";
import { Sparkle, Plus, Minus, CheckCircle2, Sparkles, Star } from "lucide-react";

export interface CardComponentProps {
  card: Card | DrawnCard;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  isSelected?: boolean;
  isPlayable?: boolean;
  deckQuantity?: number;
  ownedQuantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  canAdd?: boolean;
  showControls?: boolean;
  isNew?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CardComponent({
  card,
  size = "md",
  interactive = false,
  isSelected = false,
  isPlayable = true,
  deckQuantity,
  ownedQuantity,
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

  const isFullyAllocated =
    ownedQuantity !== undefined &&
    deckQuantity !== undefined &&
    deckQuantity >= ownedQuantity;

  // Lógica de classes de tamanho
  const isSmall = size === "sm";

  return (
    <div
      onClick={() => {
        if (onClick && (isPlayable || isSelected)) {
          onClick();
        }
      }}
      className={`relative select-none transition-all duration-300 flex flex-col justify-between ${
        isSmall ? "w-44 p-2 text-xs" : "w-full max-w-[280px] p-3 text-sm"
      } ${
        isSelected
          ? "scale-105 z-20 shadow-[0_0_30px_rgba(242,159,61,0.6)]"
          : interactive && isPlayable
          ? "hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer"
          : !isPlayable
          ? "opacity-45 grayscale cursor-not-allowed"
          : ""
      } ${rarityTheme.outerGlow} ${className}`}
      style={{
        backgroundColor: "#181433",
      }}
    >
      {/* ======================================================== */}
      {/* 1. MOLDURA EXTERNA GACHA ANIME TCG (Shadowverse / Genshin) */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-xl ${rarityTheme.cardFrameBorder}`}
        style={{
          border: `2px solid ${
            isSelected ? "#F59E0B" : rarityTheme.borderColor
          }`,
        }}
      />

      {/* Efeito Holográfico / Arco-íris Sutil para Lendárias */}
      {rarityTheme.shimmerEffect && (
        <div
          className={`absolute inset-0 pointer-events-none rounded-xl opacity-35 mix-blend-overlay ${rarityTheme.shimmerEffect}`}
        />
      )}

      {/* Cantoneiras Estilizadas por Raridade */}
      <div
        className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none"
        style={{ borderColor: rarityTheme.borderColor }}
      />
      <div
        className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none"
        style={{ borderColor: rarityTheme.borderColor }}
      />
      <div
        className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none"
        style={{ borderColor: rarityTheme.borderColor }}
      />
      <div
        className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none"
        style={{ borderColor: rarityTheme.borderColor }}
      />

      {/* Tag de Carta Nova (Gacha) */}
      {(isNew || (card as DrawnCard).isNew) && (
        <div className="absolute -top-2.5 right-4 z-30">
          <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-lg shadow-amber-950 animate-bounce">
            <Sparkle className="w-2.5 h-2.5 fill-current" /> NOVA!
          </span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CABEÇALHO DO TCG: MANA, NOME, TIPO E ESTRELAS GACHA */}
      {/* ======================================================== */}
      <div className="relative z-10 flex items-start justify-between gap-1.5 pb-1.5 border-b border-white/10">
        {/* Selo de Custo de Mana em Chama Âmbar (Suporta custo 10 sem cortar) */}
        <ManaFlameSeal cost={card.manaCost} />

        {/* Nome da Carta & Subtítulo (Quebra em até 2 linhas para nunca cortar) */}
        <div className="flex-1 px-1 min-w-0">
          <h3
            className={`font-black text-[#F8FAFC] leading-[1.15] line-clamp-2 ${
              isSmall ? "text-[11px]" : "text-xs sm:text-[13px]"
            }`}
            title={card.name}
          >
            {card.name}
          </h3>

          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider"
              style={{ color: typeTheme.accentColor }}
            >
              {typeTheme.shortLabel}
            </span>
            <span className="text-white/30 text-[8px]">&bull;</span>
            <span
              className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${
                isSpell ? "text-[#c77dff]" : "text-[#38BDF8]"
              }`}
            >
              {card.category}
            </span>
          </div>

          {/* Estrelas de Raridade Gacha (1 a 5 estrelas) */}
          <div className="flex items-center gap-0.5 mt-0.5">
            {Array.from({ length: rarityTheme.stars }).map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 fill-current ${
                  card.rarity === "LENDARIO"
                    ? "text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]"
                    : card.rarity === "EPICO"
                    ? "text-purple-300 drop-shadow-[0_0_3px_rgba(192,132,252,0.8)]"
                    : card.rarity === "RARO"
                    ? "text-sky-300 drop-shadow-[0_0_3px_rgba(56,189,248,0.8)]"
                    : card.rarity === "INCOMUM"
                    ? "text-emerald-300 drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Emblema de Raridade Compacto Gacha */}
        <div className="flex flex-col items-end shrink-0">
          <span
            className={`text-[7px] sm:text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border shadow-sm ${rarityTheme.badgeBg} ${rarityTheme.badgeText} ${rarityTheme.badgeBorder}`}
          >
            {rarityTheme.label}
          </span>
          {deckQuantity !== undefined && deckQuantity > 0 && (
            <span className="mt-1 flex items-center gap-0.5 bg-[#F59E0B] text-[#09080B] text-[8px] font-numbers font-black px-1.5 py-0.2 rounded shadow">
              <CheckCircle2 className="w-2.5 h-2.5" /> {deckQuantity}x
            </span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ARTE CENTRAL: CENÁRIO COLORIDO POR TIPO + SPRITE CEL-SHADED */}
      {/* ======================================================== */}
      <div
        className={`relative z-10 my-1.5 rounded-lg overflow-hidden border-2 bg-gradient-to-b ${typeTheme.landscapeGradient} h-28 sm:h-32 flex items-center justify-center p-2 shadow-inner`}
        style={{ borderColor: `${rarityTheme.borderColor}70` }}
      >
        {/* Camada de Profundidade & Brilho Cel-Shading do Cenário */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(15,13,30,0.55)_100%)] pointer-events-none" />

        {/* Partículas / Motes Mágicos Flutuantes de Cenário */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200 rounded-full animate-pulse" />
        </div>

        {/* Chão com Aura Mágica nos Pés da Criatura */}
        {!isSpell && (
          <div className="absolute bottom-1 inset-x-3 h-3.5 pointer-events-none">
            <svg viewBox="0 0 60 12" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="30" cy="6" rx="26" ry="4.5" fill="#000000" opacity="0.45" />
              <ellipse cx="30" cy="6" rx="20" ry="2.5" fill={typeTheme.accentColor} opacity="0.3" />
            </svg>
          </div>
        )}

        {/* Ilustração 2D em Cel-Shading (100% Idêntica ao Tabuleiro) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          <CreatureSprite2D card={card as Card} isPlayer={true} className="w-full h-full" />
        </div>

        {/* Linha Fina em Ouro Solar / Cor do Tipo no Rodapé */}
        <div
          className="absolute bottom-0 inset-x-0 h-0.5"
          style={{ backgroundColor: typeTheme.ornamentColor }}
        />
      </div>

      {/* ======================================================== */}
      {/* 4. PERGAMINHO DE TEXTO E LORE */}
      {/* ======================================================== */}
      <div className="relative z-10 px-1 py-1 bg-[#1D183C]/90 border border-white/10 rounded mb-1.5">
        <p
          className={`font-parchment text-[#E2E8F0] leading-snug italic line-clamp-2 ${
            isSmall ? "text-[10px]" : "text-[11px] sm:text-[12px]"
          }`}
        >
          "{card.description}"
        </p>
      </div>

      {/* ======================================================== */}
      {/* 5. RODAPÉ DE STATUS TÁTICOS EM ESTILO XILOGRAVURA */}
      {/* ======================================================== */}
      <div className="relative z-10 pt-1.5 border-t border-white/10">
        {isSpell ? (
          /* Feitiço: Selo Místico Ocultista */
          <div className="flex items-center justify-between bg-[#131026] border border-[#a855f7]/50 rounded px-2 py-1 text-center">
            <div className="flex items-center gap-1 text-[10px] font-gothic font-bold text-[#c77dff]">
              <Sparkles className="w-3 h-3 text-[#9d4edd]" />
              <span>Conjurável Instantâneo</span>
            </div>
            {card.rangeTiles ? (
              <span className="text-[10px] font-numbers text-[#38BDF8]">
                Alcance: {card.rangeTiles}
              </span>
            ) : null}
          </div>
        ) : (
          /* Monstro: Dano, HP, Movimento, Alcance e Selo de Trajetória */
          <div className="space-y-1.5">
            {/* Grid 4 colunas equilibrado para que o 4º atributo NUNCA vaze com 3 dígitos de HP */}
            <div className="grid grid-cols-4 gap-1 w-full text-center">
              {/* DANO */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#131026] border border-white/10 px-0.5 py-0.5 rounded shadow-inner min-w-0"
                title="Poder de Ataque (Dano)"
              >
                <BrokenSwordIcon className="w-3 h-3 text-[#FF7A00] shrink-0" />
                <span className="font-numbers font-black text-[#FF7A00] text-[10px] sm:text-[11px] truncate">
                  {card.damage ?? "-"}
                </span>
              </div>

              {/* HP */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#131026] border border-white/10 px-0.5 py-0.5 rounded shadow-inner min-w-0"
                title="Pontos de Vida (HP)"
              >
                <AnatomicalHeartIcon className="w-3 h-3 text-[#EF4444] shrink-0" />
                <span className="font-numbers font-black text-[#F87171] text-[10px] sm:text-[11px] truncate">
                  {card.hp ?? "-"}
                </span>
              </div>

              {/* MOVIMENTO */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#131026] border border-white/10 px-0.5 py-0.5 rounded shadow-inner min-w-0"
                title="Casas de Movimento"
              >
                <ArmoredBootIcon className="w-3 h-3 text-[#10B981] shrink-0" />
                <span className="font-numbers font-bold text-[#6EE7B7] text-[10px] sm:text-[11px] truncate">
                  {card.movementTiles ?? "-"}
                </span>
              </div>

              {/* ALCANCE */}
              <div
                className="flex items-center justify-center gap-0.5 bg-[#131026] border border-white/10 px-0.5 py-0.5 rounded shadow-inner min-w-0"
                title="Casas de Alcance"
              >
                <MysticSightIcon className="w-3 h-3 text-[#38BDF8] shrink-0" />
                <span className="font-numbers font-bold text-[#38BDF8] text-[10px] sm:text-[11px] truncate">
                  {card.rangeTiles ?? "-"}
                </span>
              </div>
            </div>

            {/* Selo Diferenciador de Trajetória: LINE_OF_SIGHT vs ARREMESSO */}
            {card.attackType && (
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[8px] font-gothic text-[#94A3B8] uppercase">
                  Trajetória:
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
      {/* 6. CONTROLES DO DECKBUILDER (+ / -) */}
      {/* ======================================================== */}
      {showControls && (
        <div className="relative z-10 mt-2 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="text-[10px] font-numbers text-[#94A3B8]">
            Posse:{" "}
            <strong className="text-[#F8FAFC]">{ownedQuantity ?? 0}x</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRemove) onRemove();
              }}
              disabled={deckQuantity === undefined || deckQuantity <= 0}
              className="p-1 rounded bg-[#252147] hover:bg-[#EF4444]/50 hover:text-white text-[#F8FAFC] border border-white/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
              title="Remover do Baralho"
            >
              <Minus className="w-3 h-3" />
            </button>

            <span className="w-5 text-center text-xs font-numbers font-black text-[#F59E0B]">
              {deckQuantity ?? 0}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onAdd) onAdd();
              }}
              disabled={!canAdd || isFullyAllocated}
              className="p-1 rounded bg-[#F59E0B] hover:bg-[#FBBF24] text-[#09080B] font-black disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shadow-amber-950"
              title={
                isFullyAllocated
                  ? "Você já alocou todas as cópias que possui"
                  : !canAdd
                  ? "Limite máximo do baralho atingido"
                  : "Adicionar ao Baralho"
              }
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
