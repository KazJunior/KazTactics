import { Card } from "@/db/schema";
import { AttackType } from "@/types";

export type TileType = "EMPTY" | "OBSTACLE" | "PLAYER_SPAWN" | "AI_SPAWN";

export interface GridTile {
  x: number;
  y: number;
  type: TileType;
}

export type UnitOwner = "PLAYER" | "AI";

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
