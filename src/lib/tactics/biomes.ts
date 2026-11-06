import { BiomeType } from "@/types/game";

export interface BiomeConfig {
  id: BiomeType;
  name: string;
  shortName: string;
  emoji: string;
  description: string;
  // Fundo da Tela (Atmosfera)
  screenBgGradient: string;
  particleColor: string;
  secondaryParticleColor: string;
  // Moldura do Tabuleiro (Board Frame)
  boardBgGradient: string;
  boardLedgeColor: string;
  boardInnerBorderColor: string;
  // Piso (Tiles)
  tilePrimaryBg: string;
  tileSecondaryBg: string;
  tileTertiaryBg: string;
  tileLedgeColor: string;
  // Badge no HUD
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const BIOME_ORDER: BiomeType[] = [
  "FLORESTA",
  "DESERTO",
  "GELO",
  "VULCANICO",
  "PANTANO",
];

export const BIOME_CONFIGS: Record<BiomeType, BiomeConfig> = {
  FLORESTA: {
    id: "FLORESTA",
    name: "Floresta Ancestral",
    shortName: "Floresta",
    emoji: "🌲",
    description:
      "Clareira de grama viva, troncos frondosos, rochas com musgo e vagalumes mágicos.",
    screenBgGradient:
      "radial-gradient(circle at 20% 25%, rgba(77,124,15,0.28) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(21,128,61,0.22) 0%, transparent 55%), linear-gradient(180deg, #071D10 0%, #0B2916 50%, #041108 100%)",
    particleColor: "#BEF264",
    secondaryParticleColor: "#4D7C0F",
    boardBgGradient:
      "linear-gradient(180deg, #3E2723 0%, #2D1B14 55%, #1F120D 100%)",
    boardLedgeColor: "#160C08",
    boardInnerBorderColor: "#4D7C0F",
    tilePrimaryBg: "#4D7C0F",
    tileSecondaryBg: "#3F6212",
    tileTertiaryBg: "#365314",
    tileLedgeColor: "#3B2F2F",
    badgeBg: "#1A2E05",
    badgeText: "#BEF264",
    badgeBorder: "#65A30D",
  },
  DESERTO: {
    id: "DESERTO",
    name: "Deserto Escaldante",
    shortName: "Deserto",
    emoji: "🏜️",
    description:
      "Dunas de areia dourada, cactos gigantes, pilares em ruínas e ossadas ancestrais.",
    screenBgGradient:
      "radial-gradient(circle at 50% 15%, rgba(245,158,11,0.32) 0%, rgba(180,83,9,0.22) 40%, transparent 70%), linear-gradient(180deg, #451A03 0%, #78350F 48%, #270E02 100%)",
    particleColor: "#FDE68A",
    secondaryParticleColor: "#F59E0B",
    boardBgGradient:
      "linear-gradient(180deg, #78350F 0%, #5C280B 55%, #3B1805 100%)",
    boardLedgeColor: "#230D02",
    boardInnerBorderColor: "#F59E0B",
    tilePrimaryBg: "#D97706",
    tileSecondaryBg: "#B45309",
    tileTertiaryBg: "#92400E",
    tileLedgeColor: "#451A03",
    badgeBg: "#451A03",
    badgeText: "#FDE68A",
    badgeBorder: "#F59E0B",
  },
  GELO: {
    id: "GELO",
    name: "Tundra de Gelo",
    shortName: "Gelo",
    emoji: "❄️",
    description:
      "Placas de gelo glacial, pinheiros nevados, cristais congelados e nevasca ártica.",
    screenBgGradient:
      "radial-gradient(circle at 25% 20%, rgba(56,189,248,0.28) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(125,211,252,0.2) 0%, transparent 55%), linear-gradient(180deg, #082F49 0%, #0C4A6E 50%, #041624 100%)",
    particleColor: "#E0F2FE",
    secondaryParticleColor: "#7DD3FC",
    boardBgGradient:
      "linear-gradient(180deg, #075985 0%, #0C4A6E 55%, #082F49 100%)",
    boardLedgeColor: "#041E30",
    boardInnerBorderColor: "#7DD3FC",
    tilePrimaryBg: "#38BDF8",
    tileSecondaryBg: "#0284C7",
    tileTertiaryBg: "#7DD3FC",
    tileLedgeColor: "#0369A1",
    badgeBg: "#082F49",
    badgeText: "#E0F2FE",
    badgeBorder: "#38BDF8",
  },
  VULCANICO: {
    id: "VULCANICO",
    name: "Terra Vulcânica",
    shortName: "Vulcânico",
    emoji: "🌋",
    description:
      "Placas de rocha basáltica rachadas por rios de lava, crateras de magma e cristais de fogo.",
    screenBgGradient:
      "radial-gradient(circle at 50% 80%, rgba(234,88,12,0.35) 0%, rgba(153,27,27,0.25) 45%, transparent 75%), linear-gradient(180deg, #1C0808 0%, #2A0C0A 50%, #0D0606 100%)",
    particleColor: "#FB923C",
    secondaryParticleColor: "#FACC15",
    boardBgGradient:
      "linear-gradient(180deg, #27272A 0%, #18181B 55%, #09090B 100%)",
    boardLedgeColor: "#050507",
    boardInnerBorderColor: "#EA580C",
    tilePrimaryBg: "#27272A",
    tileSecondaryBg: "#3F3F46",
    tileTertiaryBg: "#1F1F23",
    tileLedgeColor: "#09090B",
    badgeBg: "#431407",
    badgeText: "#FDBA74",
    badgeBorder: "#EA580C",
  },
  PANTANO: {
    id: "PANTANO",
    name: "Ruínas do Pântano",
    shortName: "Pântano",
    emoji: "🧪",
    description:
      "Lajes antigas cobertas de lodo, árvores retorcidas, totens musgosos e névoa mística.",
    screenBgGradient:
      "radial-gradient(circle at 20% 70%, rgba(101,163,13,0.22) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(88,28,135,0.25) 0%, transparent 55%), linear-gradient(180deg, #111C14 0%, #1A241E 50%, #0B0F14 100%)",
    particleColor: "#A3E635",
    secondaryParticleColor: "#C084FC",
    boardBgGradient:
      "linear-gradient(180deg, #1E293B 0%, #1A2E05 55%, #0F172A 100%)",
    boardLedgeColor: "#070C12",
    boardInnerBorderColor: "#4D7C0F",
    tilePrimaryBg: "#365314",
    tileSecondaryBg: "#1E293B",
    tileTertiaryBg: "#283D19",
    tileLedgeColor: "#0F172A",
    badgeBg: "#1A2E05",
    badgeText: "#D9F99D",
    badgeBorder: "#84CC16",
  },
};

/**
 * Seleciona o bioma inicial de acordo com o número da fase (stage_number % 5)
 * Fase 1 -> FLORESTA, Fase 2 -> DESERTO, Fase 3 -> GELO, Fase 4 -> VULCANICO, Fase 5 -> PANTANO
 */
export function getBiomeForStage(stageNumber: number = 1): BiomeType {
  const index = Math.abs((stageNumber - 1) % BIOME_ORDER.length);
  return BIOME_ORDER[index];
}

export function getNextBiome(current: BiomeType): BiomeType {
  const idx = BIOME_ORDER.indexOf(current);
  return BIOME_ORDER[(idx + 1) % BIOME_ORDER.length];
}

