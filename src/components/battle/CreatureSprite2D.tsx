"use client";

import React from "react";
import { Card } from "@/db/schema";
import { CutoutMonsterSprite } from "./CutoutMonsterSprite";

export interface CreatureSprite2DProps {
  card: Card;
  isPlayer?: boolean;
  className?: string;
}

/**
 * CreatureSprite2D:
 * Unificado com CutoutMonsterSprite para renderizar o Design SVG 2D Único
 * mapeado individualmente pelo `name` de cada uma das 50 cartas do seed.ts.
 */
export function CreatureSprite2D({
  card,
  isPlayer = true,
  className = "w-full h-full",
}: CreatureSprite2DProps) {
  return (
    <CutoutMonsterSprite
      name={card.name}
      type={card.type}
      category={card.category}
      isEnemy={!isPlayer}
      className={className}
    />
  );
}
