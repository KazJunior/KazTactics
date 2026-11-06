import { Card, User } from "@/db/schema";

export type Rarity = "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
export type CardCategory = "MONSTRO" | "FEITICO";
export type CardType =
  | "ARTROPODES"
  | "BESTIAIS"
  | "MORTOS_VIVOS"
  | "ESPIRITOS"
  | "HUMANOIDES"
  | "MECANICOS"
  | "MITOLOGICOS"
  | "FEITICOS";
export type AttackType = "LINE_OF_SIGHT" | "ARREMESSO";

export interface DrawnCard extends Card {
  isNew: boolean;
  newQuantity: number;
}

export interface PackOpeningResult {
  success: boolean;
  error?: string;
  cards: DrawnCard[];
  remainingGold: number;
  packType: "STANDARD" | "MYSTIC";
}

