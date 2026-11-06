"use client";

import React from "react";
import { GridTile, BoardUnit, BiomeType } from "@/types/game";
import { BIOME_CONFIGS } from "@/lib/tactics/biomes";

interface GothicTileProps {
  x: number;
  y: number;
  tile: GridTile;
  biome?: BiomeType;
  isSelected: boolean;
  isMovement: boolean;
  isAttack: boolean;
  isAbility?: boolean;
  isDashAbility?: boolean;
  isAoePreview?: boolean;
  vfxEffectType?: string | null;
  isLoSShadowBlocked?: boolean;
  playerUnits: BoardUnit[];
  children?: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Casas do Tabuleiro em Estilo 2.5D Hand-Drawn Cartoon (Contorno Preto #09090B)
 * Renderiza pisos orgânicos personalizados para cada um dos 5 Biomas de Fantasia:
 * FLORESTA, DESERTO, GELO, VULCANICO e PANTANO.
 */
export function GothicTile({
  x,
  y,
  tile,
  biome = "FLORESTA",
  isSelected,
  isMovement,
  isAttack,
  isAbility = false,
  isDashAbility = false,
  isAoePreview = false,
  vfxEffectType = null,
  isLoSShadowBlocked = false,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: GothicTileProps) {
  const config = BIOME_CONFIGS[biome] || BIOME_CONFIGS.FLORESTA;
  const isAlt = (x + y) % 2 === 0;
  const detailSeed = (x * 13 + y * 19) % 5;

  // Cor de fundo da face superior do bloco conforme o bioma e padrão xadrez orgânico
  let tileBgColor = isAlt ? config.tilePrimaryBg : config.tileSecondaryBg;
  if (biome === "DESERTO" && (x * 3 + y * 5) % 4 === 0) {
    tileBgColor = config.tileTertiaryBg;
  } else if (biome === "GELO" && (x * 5 + y * 3) % 5 === 0) {
    tileBgColor = config.tileTertiaryBg;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-[84px] md:h-[84px] flex flex-col items-center justify-between p-0.5 transition-all duration-150 cursor-pointer overflow-visible rounded-[10px] border-2 border-[#09090B] ${
        isSelected
          ? "ring-3 ring-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.9),0_5px_0_#09090B] -translate-y-1 z-20"
          : isAoePreview
            ? "ring-3 ring-[#F97316] shadow-[0_0_24px_rgba(249,115,22,0.95),0_4px_0_#09090B] -translate-y-1 z-20"
            : isAbility && isDashAbility
              ? "ring-2 ring-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.9),0_4px_0_#09090B] -translate-y-0.5 z-10"
              : isAbility
                ? "ring-2 ring-[#4ADE80] shadow-[0_0_20px_rgba(192,132,252,0.88),0_4px_0_#09090B] -translate-y-0.5 z-10"
                : isMovement
                  ? "ring-2 ring-[#38BDF8] shadow-[0_0_16px_rgba(56,189,248,0.65),0_4px_0_#09090B] -translate-y-0.5 z-10"
                  : isAttack
                    ? "ring-2 ring-[#F43F5E] shadow-[0_0_18px_rgba(244,63,94,0.8),0_4px_0_#09090B] -translate-y-0.5 z-10"
                    : "hover:-translate-y-0.5 hover:brightness-110"
      }`}
      style={{
        backgroundColor: tileBgColor,
        boxShadow:
          isSelected || isMovement || isAttack || isAbility || isAoePreview
            ? undefined
            : `0 5px 0 ${config.tileLedgeColor}, 0 7px 0 #09090B, inset 0 2px 0 rgba(255,255,255,0.18)`,
      }}
    >
      {/* ================================================================= */}
      {/* TEXTURA 2D HAND-DRAWN CARTOON DE ACORDO COM O BIOMA ATUAL         */}
      {/* ================================================================= */}
      <svg
        viewBox="0 0 84 84"
        className="absolute inset-0 w-full h-full pointer-events-none select-none rounded-[8px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Borda de luz cartoon superior e sombra interna inferior */}
        <path
          d="M6 6 H78"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M4 78 H80"
          stroke={config.tileLedgeColor}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 1. BIOMA FLORESTA ANCESTRAL */}
        {biome === "FLORESTA" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Manchas orgânicas de grama mais clara/escura */}
            {isAlt ? (
              <ellipse
                cx="26"
                cy="24"
                rx="14"
                ry="8"
                fill="#65A30D"
                opacity="0.35"
              />
            ) : (
              <ellipse
                cx="56"
                cy="58"
                rx="16"
                ry="9"
                fill="#365314"
                opacity="0.45"
              />
            )}

            {/* Tufos de grama desenhados à mão com contorno #09090B */}
            {detailSeed === 0 && (
              <g stroke="#09090B" strokeWidth="2">
                <path
                  d="M14 68 L10 56 L16 62 L19 53 L22 63 L27 57 L23 68 Z"
                  fill="#84CC16"
                />
                {/* Pedrinha de caminho */}
                <ellipse cx="64" cy="20" rx="6" ry="4" fill="#78716C" />
              </g>
            )}
            {detailSeed === 1 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Folhinhas nos cantos */}
                <path
                  d="M62 66 C62 56, 74 56, 74 66 C68 68, 64 68, 62 66 Z"
                  fill="#84CC16"
                />
                <path
                  d="M56 70 C54 61, 65 59, 66 68 Z"
                  fill="#65A30D"
                />
              </g>
            )}
            {detailSeed === 2 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Rachadura de pedra / terra e tufo */}
                <path
                  d="M16 18 L24 25 L20 33"
                  fill="none"
                  stroke="#271C15"
                  strokeWidth="2.2"
                />
                <path
                  d="M58 22 L55 13 L61 18 L64 11 L66 22 Z"
                  fill="#A3E635"
                />
              </g>
            )}
            {detailSeed === 3 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Florzinha silvestre e folha */}
                <path
                  d="M12 24 C10 15, 22 15, 20 24 Z"
                  fill="#65A30D"
                />
                <circle cx="66" cy="64" r="4" fill="#FACC15" />
              </g>
            )}
            {detailSeed === 4 && (
              <g stroke="#09090B" strokeWidth="1.8">
                {/* Laje de pedra musgosa embutida na grama */}
                <polygon
                  points="14,58 28,55 32,66 18,70"
                  fill="#57534E"
                />
              </g>
            )}
          </g>
        )}

        {/* 2. BIOMA DESERTO ESCALDANTE */}
        {biome === "DESERTO" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Ondas suaves de dunas de areia */}
            <path
              d={
                isAlt
                  ? "M10 28 Q28 20 48 28 T74 26"
                  : "M10 54 Q30 46 52 54 T74 52"
              }
              fill="none"
              stroke="#FEF3C7"
              strokeWidth="2"
              opacity="0.35"
            />
            <path
              d={
                isAlt
                  ? "M12 31 Q28 23 48 31 T74 29"
                  : "M12 57 Q30 49 52 57 T74 55"
              }
              fill="none"
              stroke="#78350F"
              strokeWidth="2"
              opacity="0.45"
            />

            {/* Rachaduras de seca e pedrinhas de arenito com contorno #09090B */}
            {detailSeed === 0 && (
              <path
                d="M52 16 L60 26 L55 36 M60 26 L69 24"
                fill="none"
                stroke="#451A03"
                strokeWidth="2.2"
              />
            )}
            {detailSeed === 1 && (
              <g stroke="#09090B" strokeWidth="2">
                <polygon points="14,62 24,58 28,67 16,69" fill="#92400E" />
                <circle cx="32" cy="66" r="2.5" fill="#78350F" />
              </g>
            )}
            {detailSeed === 2 && (
              <path
                d="M18 18 L26 28 L22 38 M26 28 L35 30"
                fill="none"
                stroke="#451A03"
                strokeWidth="2.2"
              />
            )}
            {detailSeed === 3 && (
              <g stroke="#09090B" strokeWidth="2">
                <polygon points="56,60 68,57 71,66 59,69" fill="#78350F" />
              </g>
            )}
          </g>
        )}

        {/* 3. BIOMA TUNDRA DE GELO */}
        {biome === "GELO" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Reflexos brancos diagonais de gelo */}
            <polygon
              points="12,10 26,10 10,26 10,14"
              fill="#E0F2FE"
              opacity="0.55"
            />
            <polygon
              points="34,10 42,10 10,42 10,34"
              fill="#FFFFFF"
              opacity="0.35"
            />

            {/* Rachaduras glaciais e neve nos cantos com contorno #09090B */}
            {detailSeed === 0 && (
              <path
                d="M50 16 L44 28 L54 36 L48 48 M44 28 L34 32"
                fill="none"
                stroke="#082F49"
                strokeWidth="2"
              />
            )}
            {detailSeed === 1 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Montinho de neve fofa no canto */}
                <path
                  d="M8 68 Q18 54 32 64 Q40 58 46 68 Z"
                  fill="#F0F9FF"
                />
              </g>
            )}
            {detailSeed === 2 && (
              <path
                d="M20 50 L32 58 L28 68 M32 58 L44 54"
                fill="none"
                stroke="#0C4A6E"
                strokeWidth="2.2"
              />
            )}
            {detailSeed === 3 && (
              <g stroke="#09090B" strokeWidth="2">
                <path
                  d="M48 68 Q58 55 74 68 Z"
                  fill="#F0F9FF"
                />
              </g>
            )}
          </g>
        )}

        {/* 4. BIOMA TERRA VULCÂNICA */}
        {biome === "VULCANICO" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Textura de placas de rocha basáltica */}
            <polygon
              points="10,12 36,8 42,26 16,30"
              fill="#18181B"
              opacity="0.45"
            />

            {/* Fendas rachadas brilhando em lava laranja/vermelha (#EA580C) */}
            {(detailSeed === 0 || detailSeed === 2) && (
              <g>
                <path
                  d="M14 54 L30 46 L44 58 L64 50"
                  fill="none"
                  stroke="#09090B"
                  strokeWidth="6"
                />
                <path
                  d="M14 54 L30 46 L44 58 L64 50"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="3.2"
                />
                <path
                  d="M22 50 L30 46 L44 58"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="1.4"
                />
              </g>
            )}
            {(detailSeed === 1 || detailSeed === 3) && (
              <g>
                <path
                  d="M52 14 L44 30 L58 44 M44 30 L28 36"
                  fill="none"
                  stroke="#09090B"
                  strokeWidth="5.5"
                />
                <path
                  d="M52 14 L44 30 L58 44 M44 30 L28 36"
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="2.8"
                />
                <circle cx="44" cy="30" r="2" fill="#FACC15" />
              </g>
            )}
            {detailSeed === 4 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Poça pequena de magma incandescente */}
                <ellipse cx="60" cy="60" rx="10" ry="6" fill="#EA580C" />
                <ellipse
                  cx="60"
                  cy="60"
                  rx="5"
                  ry="3"
                  fill="#FACC15"
                  stroke="none"
                />
              </g>
            )}
          </g>
        )}

        {/* 5. BIOMA RUÍNAS DO PÂNTANO */}
        {biome === "PANTANO" && (
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Poças de água turva, raízes e limo */}
            {detailSeed === 0 && (
              <g stroke="#09090B" strokeWidth="2">
                <ellipse cx="28" cy="56" rx="15" ry="8" fill="#134E4A" />
                <ellipse
                  cx="26"
                  cy="55"
                  rx="8"
                  ry="4"
                  fill="#2DD4BF"
                  opacity="0.35"
                  stroke="none"
                />
              </g>
            )}
            {detailSeed === 1 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Raízes retorcidas invadindo a laje */}
                <path
                  d="M6 20 Q22 26 28 14 M18 22 Q26 32 36 28"
                  fill="none"
                  stroke="#3B2F2F"
                  strokeWidth="3.5"
                />
                <path
                  d="M6 20 Q22 26 28 14"
                  fill="none"
                  stroke="#09090B"
                  strokeWidth="1.5"
                />
              </g>
            )}
            {detailSeed === 2 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Limo verde-musgo borbulhante */}
                <path
                  d="M46 58 Q56 48 68 56 Q74 66 58 68 Q44 68 46 58 Z"
                  fill="#4D7C0F"
                />
                <circle cx="58" cy="60" r="3" fill="#A3E635" />
              </g>
            )}
            {detailSeed === 3 && (
              <g stroke="#09090B" strokeWidth="2">
                {/* Rachadura de ruína antiga com musgo */}
                <path
                  d="M18 16 L28 30 L20 44 M28 30 L42 26"
                  fill="none"
                  stroke="#09090B"
                  strokeWidth="2.5"
                />
                <circle cx="28" cy="30" r="4" fill="#65A30D" />
              </g>
            )}
          </g>
        )}

        {/* Marcação discreta de Zona de Spawn Aliada / Inimiga */}
        {tile.type === "PLAYER_SPAWN" && (
          <rect
            x="4"
            y="4"
            width="76"
            height="76"
            rx="6"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.45"
          />
        )}
        {tile.type === "AI_SPAWN" && (
          <rect
            x="4"
            y="4"
            width="76"
            height="76"
            rx="6"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.45"
          />
        )}
      </svg>

      {/* Overlay Tático de Movimento / Seleção / Ataque / Habilidade / Preview AoE */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#38BDF8]/25 rounded-[8px] pointer-events-none" />
      )}
      {isAoePreview && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/45 via-[#EF4444]/40 to-[#DC2626]/45 rounded-[8px] pointer-events-none animate-pulse" />
      )}
      {isAbility && !isAoePreview && (
        <div
          className={`absolute inset-0 rounded-[8px] pointer-events-none ${
            isDashAbility
              ? "bg-[#22D3EE]/30"
              : "bg-gradient-to-br from-[#A855F7]/32 to-[#4ADE80]/25"
          }`}
        />
      )}
      {isMovement && !isAbility && !isAoePreview && (
        <div className="absolute inset-0 bg-[#38BDF8]/20 rounded-[8px] pointer-events-none" />
      )}
      {isAttack && !isAbility && !isAoePreview && (
        <div className="absolute inset-0 bg-[#F43F5E]/28 rounded-[8px] pointer-events-none" />
      )}

      {/* Indicador de Alvo de Habilidade Ativa ou Zona de Impacto 3x3 */}
      {isAoePreview && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-7 h-7 rounded-full border-2 border-[#FACC15] bg-[#EF4444]/35 flex items-center justify-center animate-ping" />
        </div>
      )}
      {isAbility && !isAoePreview && !children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isDashAbility ? (
            <div className="w-6 h-6 rounded-full bg-[#22D3EE]/35 border-2 border-[#22D3EE] ring-2 ring-[#CFFAFE]/70 flex items-center justify-center animate-pulse">
              <div className="w-2.5 h-2.5 bg-[#ECFEFF] rounded-full" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#A855F7]/35 border-2 border-[#4ADE80] ring-2 ring-[#C084FC]/80 flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-[#4ADE80] rounded-full" />
            </div>
          )}
        </div>
      )}

      {/* ANIMAÇÕES DE IMPACTO (VFX) DE HABILIDADES NO TABULEIRO */}
      {vfxEffectType && (
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
          {vfxEffectType === "AOE_DAMAGE" && (
            <svg viewBox="0 0 84 84" className="w-full h-full overflow-visible">
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="rgba(239,68,68,0.45)"
                stroke="#F97316"
                strokeWidth="3"
                className="animate-ping"
              />
              <polygon
                points="42,6 52,28 76,22 58,42 74,64 50,56 42,78 34,56 10,64 26,42 8,22 32,28"
                fill="#F97316"
                fillOpacity="0.8"
                stroke="#FEF08A"
                strokeWidth="2"
                className="animate-pulse"
              />
              <circle cx="42" cy="42" r="14" fill="#FEF08A" fillOpacity="0.9" />
            </svg>
          )}
          {(vfxEffectType === "POISON" || vfxEffectType === "WEB_ROOT") && (
            <svg viewBox="0 0 84 84" className="w-full h-full overflow-visible">
              <circle
                cx="42"
                cy="42"
                r="34"
                fill="rgba(34,197,94,0.42)"
                stroke="#4ADE80"
                strokeWidth="2.5"
                className="animate-ping"
              />
              <circle cx="28" cy="34" r="10" fill="#22C55E" fillOpacity="0.7" />
              <circle cx="54" cy="38" r="12" fill="#16A34A" fillOpacity="0.7" />
              <circle cx="40" cy="52" r="11" fill="#4ADE80" fillOpacity="0.75" />
              <circle cx="32" cy="24" r="4" fill="#BBF7D0" />
              <circle cx="56" cy="26" r="3.5" fill="#BBF7D0" />
            </svg>
          )}
          {vfxEffectType === "DASH_JUMP" && (
            <svg viewBox="0 0 84 84" className="w-full h-full overflow-visible">
              <circle
                cx="42"
                cy="42"
                r="32"
                fill="rgba(34,211,238,0.35)"
                stroke="#22D3EE"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-ping"
              />
              <path
                d="M16 56 L42 18 L68 56"
                fill="none"
                stroke="#A5F3FC"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          )}
          {(vfxEffectType === "KNOCKBACK" || vfxEffectType === "HEAL_BUFF") && (
            <svg viewBox="0 0 84 84" className="w-full h-full overflow-visible">
              <circle
                cx="42"
                cy="42"
                r="32"
                fill={
                  vfxEffectType === "HEAL_BUFF"
                    ? "rgba(52,211,153,0.4)"
                    : "rgba(250,204,21,0.38)"
                }
                stroke={vfxEffectType === "HEAL_BUFF" ? "#34D399" : "#FACC15"}
                strokeWidth="3"
                className="animate-ping"
              />
            </svg>
          )}
        </div>
      )}

      {/* Sombra de Projeção em Bloqueio de Linha de Visão */}
      {isLoSShadowBlocked && (
        <div className="absolute inset-0 bg-[#F43F5E]/20 rounded-[8px] pointer-events-none flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#F43F5E] border border-[#09090B] animate-ping" />
        </div>
      )}

      {/* Indicador de Alcance de Movimento */}
      {isMovement && !children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-[#38BDF8]/40 border-2 border-[#09090B] ring-2 ring-[#38BDF8] flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-[#E0F2FE] rounded-full" />
          </div>
        </div>
      )}

      {/* Indicador de Alvo de Ataque */}
      {isAttack && !children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-[#F43F5E]/30 border-2 border-[#F43F5E] border-dashed flex items-center justify-center animate-spin">
            <div className="w-2 h-2 bg-[#FFE4E6] rounded-full" />
          </div>
        </div>
      )}

      {/* Conteúdo Central da Célula (Criatura, Obstáculo 2D ou Núcleo) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
