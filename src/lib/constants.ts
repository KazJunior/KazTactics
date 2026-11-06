export const PACK_PRICES = {
  STANDARD: 100, // 100 de Ouro por 5 cartas
  MYSTIC: 250,   // 250 de Ouro (Garante no mínimo 1 Raro ou superior)
} as const;

export type PackType = keyof typeof PACK_PRICES;

