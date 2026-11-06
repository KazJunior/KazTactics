export const PACK_PRICES = {
  BASIC: 1000,    // Pacote Básico: 1.000 de Ouro (5% Épica, 0.5% Lendária)
  ADVANCED: 4000, // Pacote Avançado: 4.000 de Ouro (10% Épica, 2% Lendária)
  SUPREME: 0,     // Pacote Supremo: Não pode ser comprado com Ouro (90% Épica, 10% Lendária)
  // Aliases de compatibilidade
  STANDARD: 1000,
  MYSTIC: 4000,
} as const;

export type PackType = "BASIC" | "ADVANCED" | "SUPREME";
export type PackTypeWithLegacy = keyof typeof PACK_PRICES;
