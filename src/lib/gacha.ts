import { Rarity } from "@/types";

export interface RarityWeight {
  rarity: "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
  weight: number;
}

export const STANDARD_PROBABILITIES: {
  rarity: "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
  chance: number;
}[] = [
  { rarity: "COMUM", chance: 0.55 },
  { rarity: "INCOMUM", chance: 0.25 },
  { rarity: "RARO", chance: 0.12 },
  { rarity: "EPICO", chance: 0.06 },
  { rarity: "LENDARIO", chance: 0.02 },
];

export function rollRarity(
  guaranteedMinRarity?: "RARO"
): "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO" {
  const rand = Math.random();

  if (guaranteedMinRarity === "RARO") {
    if (rand < 0.6) return "RARO";
    if (rand < 0.9) return "EPICO";
    return "LENDARIO";
  }

  let accumulated = 0;
  for (const item of STANDARD_PROBABILITIES) {
    accumulated += item.chance;
    if (rand <= accumulated) {
      return item.rarity;
    }
  }

  return "COMUM";
}

/**
 * Paleta Grimdark e Chiaroscuro (Darkest Dungeon) - Tarot Gótico
 */
export const RARITY_VISUALS = {
  COMUM: {
    label: "Comum",
    border: "border-[#5A5560]",
    glow: "shadow-[2px_2px_0px_#09080B]",
    cardBg: "from-[#17151C] via-[#121016] to-[#09080B]",
    accent: "text-[#9E8C70]",
    badge: "bg-[#1E1C22] text-[#C8B99E] border-[#5A5560]",
    beamColor: "#5A5560",
  },
  INCOMUM: {
    label: "Incomum",
    border: "border-[#3E6B48]",
    glow: "shadow-[0_0_20px_rgba(62,107,72,0.45)]",
    cardBg: "from-[#102217] via-[#121016] to-[#09080B]",
    accent: "text-[#4ade80]",
    badge: "bg-[#102217] text-[#6ee7b7] border-[#3E6B48]",
    beamColor: "#3E6B48",
  },
  RARO: {
    label: "Raro",
    border: "border-[#2E5A88]",
    glow: "shadow-[0_0_25px_rgba(46,90,136,0.55)]",
    cardBg: "from-[#0c1a29] via-[#121016] to-[#09080B]",
    accent: "text-[#7dd3fc]",
    badge: "bg-[#0c1a29] text-[#7dd3fc] border-[#2E5A88]",
    beamColor: "#2E5A88",
  },
  EPICO: {
    label: "Épico",
    border: "border-[#7A328C]",
    glow: "shadow-[0_0_30px_rgba(122,50,140,0.7)]",
    cardBg: "from-[#210926] via-[#121016] to-[#09080B]",
    accent: "text-[#d8b4fe]",
    badge: "bg-[#210926] text-[#e9d5ff] border-[#7A328C]",
    beamColor: "#7A328C",
  },
  LENDARIO: {
    label: "Lendário",
    border: "border-[#D49B27]",
    glow: "shadow-[0_0_35px_rgba(212,155,39,0.75),0_0_15px_rgba(158,27,27,0.85)] animate-pulse",
    cardBg: "from-[#291305] via-[#121016] to-[#09080B]",
    accent: "text-[#F29F3D]",
    badge: "bg-[#291305] text-[#fde047] border-[#D49B27]",
    beamColor: "#D49B27",
  },
} as const;
