"use client";

import { Card } from "@/db/schema";
import { CardComponent } from "@/components/cards/CardComponent";
import { ScaledCard } from "@/lib/cardProgression";

interface CardItemProps {
  card: Card | ScaledCard;
  ownedQuantity: number;
  level?: number;
  playerGold?: number;
  onUpgrade?: () => void;
  isUpgrading?: boolean;
  deckQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
  canAdd: boolean;
}

export function CardItem({
  card,
  ownedQuantity,
  level = 1,
  playerGold,
  onUpgrade,
  isUpgrading = false,
  deckQuantity,
  onAdd,
  onRemove,
  canAdd,
}: CardItemProps) {
  return (
    <CardComponent
      card={card}
      ownedQuantity={ownedQuantity}
      level={level}
      playerGold={playerGold}
      onUpgrade={onUpgrade}
      isUpgrading={isUpgrading}
      deckQuantity={deckQuantity}
      onAdd={onAdd}
      onRemove={onRemove}
      canAdd={canAdd}
      showControls={true}
      interactive={false}
      size="md"
    />
  );
}
