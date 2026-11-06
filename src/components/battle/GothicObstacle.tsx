"use client";

import React from "react";
import { BiomeType } from "@/types/game";

interface GothicObstacleProps {
  x: number;
  y: number;
  biome?: BiomeType;
  isProjectingShadow?: boolean;
}

/**
 * Obstáculos 2D Hand-Drawn Cartoon com Contorno Preto Grosso (stroke="#09090B", strokeWidth="3").
 * Varia entre 3 desenhos distintos por bioma usando (x + y) % 3.
 */
export function GothicObstacle({
  x,
  y,
  biome = "FLORESTA",
  isProjectingShadow,
}: GothicObstacleProps) {
  const variant = (x + y) % 3;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Sombra Cartoon Projetada no Chão */}
      <div
        className={`absolute bottom-0.5 w-16 h-5 rounded-full bg-[#09090B]/70 transition-all duration-300 ${
          isProjectingShadow
            ? "scale-125 bg-[#F43F5E]/60 shadow-[0_0_12px_#F43F5E]"
            : ""
        }`}
      />

      <svg
        viewBox="0 0 80 80"
        className="w-18 h-18 md:w-20 md:h-20 -translate-y-1.5 overflow-visible filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.75)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="#09090B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* ============================================================== */}
          {/* BIOMA 1: FLORESTA ANCESTRAL (FLORESTA)                          */}
          {/* ============================================================== */}
          {biome === "FLORESTA" && variant === 0 && (
            <>
              {/* Tronco de Árvore Frondosa com Raízes */}
              <path
                d="M28 42 C28 54, 18 64, 14 70 L28 68 L34 62 L40 70 L48 68 L52 63 L64 69 C58 61, 50 53, 50 42 Z"
                fill="#5C3A21"
              />
              {/* Sombras e veios da madeira */}
              <path
                d="M36 45 C36 55, 33 62, 29 67 M44 46 C44 55, 47 61, 51 66"
                fill="none"
                stroke="#2E1B0E"
                strokeWidth="2.2"
              />
              {/* Copa Folhuda em Camadas Cartoon */}
              <circle cx="24" cy="34" r="15" fill="#3F6212" />
              <circle cx="56" cy="34" r="15" fill="#3F6212" />
              <circle cx="40" cy="22" r="18" fill="#4D7C0F" />
              <circle cx="32" cy="32" r="14" fill="#65A30D" />
              <circle cx="48" cy="30" r="13" fill="#65A30D" />
              {/* Brilho estilizado nas folhas */}
              <path
                d="M28 16 Q38 10 48 16"
                fill="none"
                stroke="#BEF264"
                strokeWidth="3"
              />
              <circle cx="26" cy="28" r="2.5" fill="#BEF264" stroke="none" />
              <circle cx="50" cy="24" r="2.5" fill="#FEF08A" stroke="none" />
            </>
          )}

          {biome === "FLORESTA" && variant === 1 && (
            <>
              {/* Rocha Coberta de Musgo Verde */}
              <polygon
                points="12,66 16,36 32,20 54,22 68,42 66,66 40,70"
                fill="#64748B"
              />
              {/* Face sombreada da rocha */}
              <polygon
                points="40,21 54,22 68,42 66,66 40,70"
                fill="#475569"
              />
              {/* Capa grossa de musgo verde no topo */}
              <path
                d="M15 38 L32 19 L55 21 L66 37 C58 42, 52 34, 46 42 C38 48, 34 35, 26 43 C20 46, 16 42, 15 38 Z"
                fill="#65A30D"
              />
              {/* Brilho do musgo */}
              <path
                d="M26 26 Q38 22 50 26"
                fill="none"
                stroke="#BEF264"
                strokeWidth="2.5"
              />
              {/* Pedra menor lateral e tufos de grama */}
              <polygon points="8,68 12,52 24,50 28,68" fill="#94A3B8" />
              <path
                d="M52 68 L56 56 L61 63 L66 54 L69 68 Z"
                fill="#84CC16"
              />
            </>
          )}

          {biome === "FLORESTA" && variant === 2 && (
            <>
              {/* Tronco Caído + Cogumelos Gigantes Brilhantes */}
              <path
                d="M14 68 L18 50 L62 50 L66 68 Z"
                fill="#5C3A21"
              />
              <ellipse cx="40" cy="50" rx="22" ry="6" fill="#854D0E" />
              {/* Caule do Cogumelo Principal */}
              <path
                d="M33 52 C33 38, 35 28, 35 28 L45 28 C45 28, 47 38, 47 52 Z"
                fill="#FEF3C7"
              />
              {/* Chapéu do Cogumelo Gigante Brilhante */}
              <path
                d="M16 32 C16 12, 64 12, 64 32 C54 36, 26 36, 16 32 Z"
                fill="#E11D48"
              />
              {/* Pintas luminosas do cogumelo */}
              <circle cx="30" cy="23" r="4.5" fill="#FEF08A" />
              <circle cx="44" cy="19" r="3.5" fill="#FEF08A" />
              <circle cx="52" cy="26" r="4" fill="#FEF08A" />
              {/* Cogumelo menor lateral */}
              <path d="M19 54 L21 42 L27 42 L29 54 Z" fill="#FEF3C7" />
              <path
                d="M12 44 C12 33, 36 33, 36 44 Z"
                fill="#F43F5E"
              />
              <circle cx="24" cy="39" r="2.5" fill="#FEF08A" stroke="none" />
              {/* Musgo na base */}
              <path
                d="M12 68 Q26 60 40 68 Q54 60 68 68 Z"
                fill="#65A30D"
              />
            </>
          )}

          {/* ============================================================== */}
          {/* BIOMA 2: DESERTO ESCALDANTE (DESERTO)                          */}
          {/* ============================================================== */}
          {biome === "DESERTO" && variant === 0 && (
            <>
              {/* Cacto Gigante Cartunesco com Espinhos */}
              {/* Duna de areia na base */}
              <ellipse cx="40" cy="67" rx="26" ry="7" fill="#D97706" />
              {/* Braço esquerdo do cacto */}
              <path
                d="M32 46 H20 C15 46, 14 42, 14 36 V26 C14 21, 22 21, 22 26 V36 H32 Z"
                fill="#16A34A"
              />
              {/* Braço direito do cacto */}
              <path
                d="M48 40 H60 C65 40, 66 36, 66 30 V22 C66 17, 58 17, 58 22 V30 H48 Z"
                fill="#15803D"
              />
              {/* Tronco central do cacto */}
              <rect
                x="31"
                y="14"
                width="18"
                height="53"
                rx="9"
                fill="#22C55E"
              />
              {/* Listras verticais do cacto */}
              <line
                x1="40"
                y1="17"
                x2="40"
                y2="65"
                stroke="#15803D"
                strokeWidth="2"
              />
              {/* Flor do Deserto no topo */}
              <circle cx="40" cy="12" r="6" fill="#F43F5E" />
              <circle cx="40" cy="12" r="2.5" fill="#FACC15" stroke="none" />
              {/* Espinhos brancos cartunescos */}
              <line x1="29" y1="24" x2="25" y2="22" stroke="#FEF3C7" strokeWidth="2" />
              <line x1="51" y1="28" x2="55" y2="26" stroke="#FEF3C7" strokeWidth="2" />
              <line x1="29" y1="54" x2="25" y2="52" stroke="#FEF3C7" strokeWidth="2" />
              <line x1="51" y1="50" x2="55" y2="48" stroke="#FEF3C7" strokeWidth="2" />
            </>
          )}

          {biome === "DESERTO" && variant === 1 && (
            <>
              {/* Formação Rochosa de Cânion Avermelhado & Pilar de Arenito Quebrado */}
              <polygon
                points="10,68 16,32 34,24 44,68"
                fill="#C2410C"
              />
              <polygon
                points="26,68 34,24 46,34 48,68"
                fill="#9A3412"
              />
              {/* Pilar de Arenito Antigo Quebrado */}
              <polygon
                points="42,68 46,20 66,26 64,68"
                fill="#F59E0B"
              />
              {/* Topo e frisos entalhados do pilar */}
              <rect x="43" y="16" width="25" height="7" rx="2" fill="#FBBF24" />
              <line x1="50" y1="26" x2="48" y2="64" stroke="#B45309" strokeWidth="2.2" />
              <line x1="58" y1="28" x2="56" y2="64" stroke="#B45309" strokeWidth="2.2" />
              {/* Base de areia dourada */}
              <path
                d="M8 68 Q28 58 46 66 Q60 58 72 68 Z"
                fill="#D97706"
              />
            </>
          )}

          {biome === "DESERTO" && variant === 2 && (
            <>
              {/* Crânio de Criatura Gigante na Areia */}
              <ellipse cx="40" cy="66" rx="28" ry="8" fill="#D97706" />
              {/* Chifres curvados gigantes */}
              <path
                d="M24 36 C10 32, 6 18, 16 12 C14 22, 18 26, 28 28 Z"
                fill="#A8A29E"
              />
              <path
                d="M56 36 C70 32, 74 18, 64 12 C66 22, 62 26, 52 28 Z"
                fill="#78716C"
              />
              {/* Crânio ósseo estilizado */}
              <path
                d="M24 30 C24 16, 56 16, 56 30 L60 48 L48 64 L32 64 L20 48 Z"
                fill="#FEF3C7"
              />
              {/* Órbitas oculares e cavidade nasal */}
              <circle cx="32" cy="40" r="5.5" fill="#09090B" />
              <circle cx="48" cy="40" r="5.5" fill="#09090B" />
              <polygon points="40,47 36,56 44,56" fill="#09090B" />
              {/* Rachadura no crânio */}
              <path
                d="M40 20 L37 28 L42 33"
                fill="none"
                stroke="#09090B"
                strokeWidth="2.2"
              />
            </>
          )}

          {/* ============================================================== */}
          {/* BIOMA 3: TUNDRA DE GELO (GELO)                                 */}
          {/* ============================================================== */}
          {biome === "GELO" && variant === 0 && (
            <>
              {/* Cristais / Estalagmites de Gelo Pontiagudos */}
              <ellipse cx="40" cy="67" rx="26" ry="7" fill="#E0F2FE" />
              {/* Cristal Esquerdo */}
              <polygon
                points="14,66 18,30 28,18 34,66"
                fill="#38BDF8"
              />
              {/* Cristal Direito */}
              <polygon
                points="46,66 52,22 64,34 66,66"
                fill="#0284C7"
              />
              {/* Cristal Central Maior */}
              <polygon
                points="26,68 32,16 40,8 48,16 54,68"
                fill="#7DD3FC"
              />
              {/* Faceta luminosa central */}
              <polygon
                points="40,11 46,18 43,65 40,65"
                fill="#E0F2FE"
                stroke="none"
              />
              {/* Reflexo branco */}
              <line
                x1="35"
                y1="20"
                x2="33"
                y2="46"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </>
          )}

          {biome === "GELO" && variant === 1 && (
            <>
              {/* Pinheiro Coberto de Neve Pesada */}
              <rect x="34" y="52" width="12" height="16" fill="#451A03" />
              {/* Camadas do Pinheiro e Neve */}
              <polygon points="12,56 40,28 68,56" fill="#065F46" />
              <path
                d="M16 52 L40 28 L64 52 Q52 46 40 52 Q28 46 16 52 Z"
                fill="#F0F9FF"
              />
              <polygon points="16,42 40,16 64,42" fill="#047857" />
              <path
                d="M20 38 L40 16 L60 38 Q50 33 40 38 Q30 33 20 38 Z"
                fill="#F0F9FF"
              />
              <polygon points="22,26 40,8 58,26" fill="#F0F9FF" />
              {/* Base de neve */}
              <path
                d="M16 68 Q40 58 64 68 Z"
                fill="#E0F2FE"
              />
            </>
          )}

          {biome === "GELO" && variant === 2 && (
            <>
              {/* Rochas Congeladas com Crosta de Neve */}
              <polygon
                points="10,66 16,36 36,22 60,26 70,46 66,66"
                fill="#334155"
              />
              <polygon
                points="36,22 60,26 70,46 66,66 38,66"
                fill="#1E293B"
              />
              {/* Capa de neve congelada e pingentes de gelo */}
              <path
                d="M14 38 L36 20 L61 25 L68 40 L58 42 L54 52 L48 41 L38 44 L32 54 L26 40 Z"
                fill="#E0F2FE"
              />
              {/* Cristais laterais */}
              <polygon points="8,68 14,48 24,52 22,68" fill="#38BDF8" />
            </>
          )}

          {/* ============================================================== */}
          {/* BIOMA 4: TERRA VULCÂNICA (VULCANICO)                           */}
          {/* ============================================================== */}
          {biome === "VULCANICO" && variant === 0 && (
            <>
              {/* Pilar de Rocha Vulcânica Soltando Fumaça */}
              {/* Nuvens de fumaça vulcânica no topo */}
              <circle cx="44" cy="14" r="9" fill="#52525B" />
              <circle cx="34" cy="18" r="7" fill="#71717A" />
              {/* Pilar de basalto */}
              <polygon
                points="18,68 24,24 38,20 54,24 62,68"
                fill="#27272A"
              />
              <polygon
                points="38,20 54,24 62,68 38,68"
                fill="#18181B"
              />
              {/* Veios de lava incandescente na rocha */}
              <path
                d="M38 24 L34 40 L44 50 L38 66 M34 40 L24 48"
                fill="none"
                stroke="#EA580C"
                strokeWidth="3.5"
              />
              <path
                d="M38 24 L34 40 L44 50"
                fill="none"
                stroke="#FACC15"
                strokeWidth="1.5"
              />
            </>
          )}

          {biome === "VULCANICO" && variant === 1 && (
            <>
              {/* Pequeno Vulcão / Cratera de Magma Borbulhante */}
              <polygon
                points="8,68 24,26 56,26 72,68"
                fill="#27272A"
              />
              <polygon
                points="40,26 56,26 72,68 40,68"
                fill="#18181B"
              />
              {/* Boca de lava na cratera */}
              <ellipse cx="40" cy="26" rx="16" ry="6" fill="#EA580C" />
              <ellipse
                cx="40"
                cy="26"
                rx="10"
                ry="3.5"
                fill="#FACC15"
                stroke="none"
              />
              {/* Rios de magma escorrendo pelo cone */}
              <path
                d="M32 30 C30 42, 24 50, 26 64 M46 30 C48 44, 52 48, 50 60"
                fill="none"
                stroke="#EA580C"
                strokeWidth="4.5"
              />
              <circle cx="36" cy="18" r="3.5" fill="#FB923C" />
              <circle cx="46" cy="14" r="2.5" fill="#FACC15" />
            </>
          )}

          {biome === "VULCANICO" && variant === 2 && (
            <>
              {/* Cristais de Fogo Laranja */}
              <ellipse cx="40" cy="66" rx="26" ry="7" fill="#18181B" />
              <polygon
                points="14,66 18,32 30,22 36,66"
                fill="#EA580C"
              />
              <polygon
                points="44,66 50,24 62,34 66,66"
                fill="#C2410C"
              />
              <polygon
                points="26,68 34,14 40,8 46,14 54,68"
                fill="#F97316"
              />
              <polygon
                points="40,11 45,16 42,64 40,64"
                fill="#FEF08A"
                stroke="none"
              />
            </>
          )}

          {/* ============================================================== */}
          {/* BIOMA 5: RUÍNAS DO PÂNTANO (PANTANO)                           */}
          {/* ============================================================== */}
          {biome === "PANTANO" && variant === 0 && (
            <>
              {/* Árvore Seca Retorcida com Cipós */}
              <path
                d="M16 68 C24 58, 30 46, 30 32 L14 20 L18 14 L32 24 L36 10 L44 12 L42 26 L58 14 L64 20 L46 34 C46 48, 52 58, 62 68 L46 66 L40 58 L32 66 Z"
                fill="#3B281E"
              />
              {/* Cavidade escura no tronco */}
              <ellipse cx="38" cy="44" rx="5" ry="7" fill="#09090B" />
              {/* Cipós e musgo pendente */}
              <path
                d="M20 22 V38 M56 20 V36 M36 12 V24"
                fill="none"
                stroke="#65A30D"
                strokeWidth="3"
              />
              {/* Poça de lama na base */}
              <ellipse cx="40" cy="68" rx="24" ry="5" fill="#365314" />
            </>
          )}

          {biome === "PANTANO" && variant === 1 && (
            <>
              {/* Totem de Pedra Rachado com Musgo */}
              <polygon
                points="22,68 20,18 32,12 48,12 60,18 58,68"
                fill="#475569"
              />
              <polygon
                points="40,12 48,12 60,18 58,68 40,68"
                fill="#334155"
              />
              {/* Rosto rúnico antigo entalhado no totem */}
              <polygon points="27,30 36,33 29,37" fill="#A3E635" />
              <polygon points="53,30 44,33 51,37" fill="#A3E635" />
              <rect x="30" y="46" width="20" height="6" rx="2" fill="#09090B" />
              {/* Capa de musgo pantanoso no topo */}
              <path
                d="M19 20 L32 11 L48 11 L61 20 C52 26, 44 18, 38 25 C30 28, 24 22, 19 20 Z"
                fill="#4D7C0F"
              />
            </>
          )}

          {biome === "PANTANO" && variant === 2 && (
            <>
              {/* Caldeirão / Rochas Pantanosas Borbulhantes */}
              <polygon
                points="10,66 16,38 34,30 62,34 70,50 66,66"
                fill="#334155"
              />
              {/* Poço/caldeirão de lodo ácido no centro */}
              <ellipse cx="40" cy="42" rx="20" ry="9" fill="#1A2E05" />
              <ellipse cx="40" cy="42" rx="15" ry="6" fill="#65A30D" />
              {/* Bolhas de gás tóxico */}
              <circle cx="34" cy="40" r="4" fill="#BEF264" />
              <circle cx="46" cy="43" r="3" fill="#BEF264" />
              <circle cx="40" cy="26" r="4.5" fill="#A3E635" />
              <circle cx="48" cy="18" r="3" fill="#BEF264" />
              {/* Musgo nas bordas */}
              <path
                d="M14 66 Q28 56 42 66 Q56 56 68 66 Z"
                fill="#365314"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
