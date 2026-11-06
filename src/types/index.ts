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
  copiesGranted?: number;
  level?: number;
}

export type PackKind = "BASIC" | "ADVANCED" | "SUPREME" | "STANDARD" | "MYSTIC";

export interface PackOpeningResult {
  success: boolean;
  error?: string;
  cards: DrawnCard[];
  remainingGold: number;
  remainingBasicPacks?: number;
  remainingAdvancedPacks?: number;
  remainingSupremePacks?: number;
  packType: PackKind;
}

