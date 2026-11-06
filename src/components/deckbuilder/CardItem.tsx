"use client";

import { Card } from "@/db/schema";
import { CardComponent } from "@/components/cards/CardComponent";

interface CardItemProps {
  card: Card;
  ownedQuantity: number;
  deckQuantity: number;
  onAdd: () => void;
  onRemove: () => void;
  canAdd: boolean;
}

export function CardItem({
  card,
  ownedQuantity,
  deckQuantity,
  onAdd,
  onRemove,
  canAdd,
}: CardItemProps) {
  return (
    <CardComponent
      card={card}
      ownedQuantity={ownedQuantity}
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
