import { Card } from "@/db/schema";
import { AttackType } from "@/types";

export type TileType = "EMPTY" | "OBSTACLE" | "PLAYER_SPAWN" | "AI_SPAWN";

export type BiomeType =
  | "FLORESTA"
  | "DESERTO"
  | "GELO"
  | "VULCANICO"
  | "PANTANO";

export interface GridTile {
  x: number;
  y: number;
  type: TileType;
}

export type UnitOwner = "PLAYER" | "AI";

export type StatusEffectType =
  | "POISON"
  | "ROOTED"
  | "WEAKENED"
  | "SLOWED"
  | "GOLDEN_SHELL";

export interface UnitStatusEffect {
  type: StatusEffectType;
  value: number;
  turnsLeft: number;
  justApplied?: boolean;
}

export const MAX_UNIT_ACTIONS_PER_TURN = 2;

export interface BoardUnit {
  id: string; // ID único da instância no tabuleiro
  card: Card;
  owner: UnitOwner;
  x: number;
  y: number;
  currentHp: number;
  maxHp: number;
  hasMoved: boolean;
  hasAttacked: boolean;
  actionsRemaining?: number; // 2 ações por rodada (Mover, Atacar ou Habilidade)
  abilityCooldown?: number; // Inicia em 0 ao ser invocada
  usedAbilityThisTurn?: boolean;
  statusEffects?: UnitStatusEffect[];
}

export interface BoardCore {
  owner: UnitOwner;
  name: string;
  x: number;
  y: number;
  currentHp: number;
  maxHp: number;
}

export interface HighlightedTiles {
  movement: { x: number; y: number }[];
  attack: { x: number; y: number }[];
}
