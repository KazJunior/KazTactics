import { CardType, Rarity, AttackType } from "@/types";

/**
 * Tratamento de Raridade (5 Níveis) - Estilo Anime Gacha RPG / TCG
 */
export interface RarityTheme {
  label: string;
  stars: number;
  borderColor: string;
  borderClass: string;
  outerGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  runeColor: string;
  gemColor: string;
  headerAccent: string;
  cardFrameBorder: string;
  shimmerEffect?: string;
}

export const RARITY_THEMES: Record<Rarity, RarityTheme> = {
  COMUM: {
    label: "Comum",
    stars: 1,
    borderColor: "#CBD5E1",
    borderClass: "border-slate-300",
    outerGlow: "shadow-[0_0_12px_rgba(203,213,225,0.35)]",
    badgeBg: "bg-slate-800/90",
    badgeText: "text-slate-200",
    badgeBorder: "border-slate-400",
    runeColor: "#94A3B8",
    gemColor: "#CBD5E1",
    headerAccent: "text-slate-300",
    cardFrameBorder: "border-slate-400/80 shadow-[inset_0_0_8px_rgba(203,213,225,0.25)]",
  },
  INCOMUM: {
    label: "Incomum",
    stars: 2,
    borderColor: "#10B981",
    borderClass: "border-emerald-500",
    outerGlow: "shadow-[0_0_18px_rgba(16,185,129,0.55)]",
    badgeBg: "bg-emerald-950/90",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500",
    runeColor: "#10B981",
    gemColor: "#34D399",
    headerAccent: "text-emerald-300",
    cardFrameBorder: "border-emerald-400/90 shadow-[inset_0_0_12px_rgba(16,185,129,0.35)]",
  },
  RARO: {
    label: "Raro",
    stars: 3,
    borderColor: "#0EA5E9",
    borderClass: "border-sky-500",
    outerGlow: "shadow-[0_0_24px_rgba(14,165,233,0.65)]",
    badgeBg: "bg-sky-950/90",
    badgeText: "text-sky-300",
    badgeBorder: "border-sky-400",
    runeColor: "#0EA5E9",
    gemColor: "#38BDF8",
    headerAccent: "text-sky-300",
    cardFrameBorder: "border-sky-400 shadow-[inset_0_0_14px_rgba(14,165,233,0.45)]",
  },
  EPICO: {
    label: "Épico",
    stars: 4,
    borderColor: "#A855F7",
    borderClass: "border-purple-500",
    outerGlow: "shadow-[0_0_28px_rgba(168,85,247,0.7)]",
    badgeBg: "bg-purple-950/90",
    badgeText: "text-purple-200",
    badgeBorder: "border-purple-400",
    runeColor: "#A855F7",
    gemColor: "#C084FC",
    headerAccent: "text-purple-300",
    cardFrameBorder: "border-purple-400 shadow-[inset_0_0_16px_rgba(168,85,247,0.5)]",
  },
  LENDARIO: {
    label: "Lendário",
    stars: 5,
    borderColor: "#F59E0B",
    borderClass: "border-amber-400",
    outerGlow: "shadow-[0_0_35px_rgba(245,158,11,0.85),0_0_15px_rgba(244,63,94,0.4)] animate-pulse",
    badgeBg: "bg-gradient-to-r from-amber-950 to-yellow-950",
    badgeText: "text-amber-200 font-black",
    badgeBorder: "border-amber-400",
    runeColor: "#F59E0B",
    gemColor: "#FCD34D",
    headerAccent: "text-amber-300",
    cardFrameBorder: "border-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.6)]",
    shimmerEffect: "bg-gradient-to-r from-amber-400/20 via-pink-400/15 to-cyan-400/20",
  },
};

/**
 * Identidade Visual por Tipo (8 Tipos) - Cenários Celestes e Fantasia Anime
 */
export interface CardTypeTheme {
  typeName: string;
  shortLabel: string;
  bgGradient: string;
  landscapeGradient: string;
  ornamentColor: string;
  accentColor: string;
  sigilColor: string;
  sceneryDescription: string;
}

export const CARD_TYPE_THEMES: Record<CardType, CardTypeTheme> = {
  ARTROPODES: {
    typeName: "Artrópodes",
    shortLabel: "Artrópode",
    bgGradient: "from-[#064E3B] via-[#042F2E] to-[#022C22]",
    landscapeGradient: "from-[#059669] via-[#047857] to-[#064E3B]",
    ornamentColor: "#10B981",
    accentColor: "#34D399",
    sigilColor: "#059669",
    sceneryDescription: "Floresta mágica bioluminescente em esmeralda viva com centelhas de esporos celestes",
  },
  BESTIAIS: {
    typeName: "Bestiais",
    shortLabel: "Bestial",
    bgGradient: "from-[#78350F] via-[#451A03] to-[#1C1917]",
    landscapeGradient: "from-[#D97724] via-[#B45309] to-[#78350F]",
    ornamentColor: "#F59E0B",
    accentColor: "#FBBF24",
    sigilColor: "#D97724",
    sceneryDescription: "Bosque crepuscular e savana mágica banhada pelo sol dourado do poente",
  },
  MORTOS_VIVOS: {
    typeName: "Mortos-Vivos",
    shortLabel: "Morto-Vivo",
    bgGradient: "from-[#1E1B4B] via-[#0F172A] to-[#020617]",
    landscapeGradient: "from-[#4338CA] via-[#312E81] to-[#1E1B4B]",
    ornamentColor: "#6366F1",
    accentColor: "#818CF8",
    sigilColor: "#4F46E5",
    sceneryDescription: "Necrópole espectral com chamas espirituais azuis/roxas vibrantes no estilo Manhwa",
  },
  ESPIRITOS: {
    typeName: "Espíritos",
    shortLabel: "Espírito",
    bgGradient: "from-[#0C4A6E] via-[#082F49] to-[#02131F]",
    landscapeGradient: "from-[#0284C7] via-[#0369A1] to-[#0C4A6E]",
    ornamentColor: "#38BDF8",
    accentColor: "#7DD3FC",
    sigilColor: "#0284C7",
    sceneryDescription: "Santuário etéreo com aurora boreal ciano e cristais flutuantes reluzentes",
  },
  HUMANOIDES: {
    typeName: "Humanóides",
    shortLabel: "Humanóide",
    bgGradient: "from-[#1E3A8A] via-[#1E293B] to-[#0F172A]",
    landscapeGradient: "from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]",
    ornamentColor: "#38BDF8",
    accentColor: "#60A5FA",
    sigilColor: "#2563EB",
    sceneryDescription: "Cidadela celestial sob céu azul celeste radiante com estandartes e raios de sol",
  },
  MECANICOS: {
    typeName: "Mecânicos",
    shortLabel: "Mecânico",
    bgGradient: "from-[#7C2D12] via-[#431407] to-[#18181B]",
    landscapeGradient: "from-[#EA580C] via-[#C2410C] to-[#7C2D12]",
    ornamentColor: "#F59E0B",
    accentColor: "#FB923C",
    sigilColor: "#EA580C",
    sceneryDescription: "Forja Magitek reluzente com engrenagens de latão dourado e reator de mana azul",
  },
  MITOLOGICOS: {
    typeName: "Mitológicos",
    shortLabel: "Mitológico",
    bgGradient: "from-[#581C87] via-[#2E1065] to-[#0F0728]",
    landscapeGradient: "from-[#9333EA] via-[#7E22CE] to-[#581C87]",
    ornamentColor: "#F59E0B",
    accentColor: "#FDE047",
    sigilColor: "#9333EA",
    sceneryDescription: "Olimpo Astral com nebulosa cósmica violeta e estrelas estelares douradas",
  },
  FEITICOS: {
    typeName: "Feitiços",
    shortLabel: "Feitiço",
    bgGradient: "from-[#701A75] via-[#3B0764] to-[#180326]",
    landscapeGradient: "from-[#C026D3] via-[#9333EA] to-[#6B21A8]",
    ornamentColor: "#C084FC",
    accentColor: "#E879F9",
    sigilColor: "#A855F7",
    sceneryDescription: "Círculo rúnico arcano resplandecente em magenta e púrpura com feixes de poder",
  },
};


