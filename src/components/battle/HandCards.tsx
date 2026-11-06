"use client";

import { Card } from "@/db/schema";
import { CardComponent } from "@/components/cards/CardComponent";
import { Sparkles } from "lucide-react";

interface HandCardsProps {
  hand: Card[];
  deckCount: number;
  currentMana: number;
  playerUnitsCount: number;
  selectedCard: Card | null;
  onSelectCard: (card: Card) => void;
  onCancelSelection: () => void;
}

export function HandCards({
  hand,
  deckCount,
  currentMana,
  playerUnitsCount,
  selectedCard,
  onSelectCard,
  onCancelSelection,
}: HandCardsProps) {
  const isFieldFull = playerUnitsCount >= 7;

  return (
    <div className="space-y-3">
      {/* Barra de Status da Mão */}
      <div className="flex items-center justify-between text-xs font-gothic px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F59E0B] animate-torch" />
          <span className="text-[#F8FAFC] font-semibold">
            Mão de Invocação ({hand.length}/7)
          </span>
          <span className="text-[#64748B]">&bull;</span>
          <span className="text-[#94A3B8] font-numbers">
            Grimório: {deckCount} cartas restantes
          </span>
        </div>

        {selectedCard && (
          <div className="flex items-center gap-2">
            <span className="text-[#F59E0B] text-[11px] animate-pulse font-gothic font-bold">
              {selectedCard.category === "FEITICO"
                ? "✨ Feitiço Ativo: Selecione o alvo no tabuleiro para disparar!"
                : "🏰 Criatura Pronta: Clique em uma casa de invocação livre!"}
            </span>
            <button
              onClick={onCancelSelection}
              className="px-3 py-1 bg-[#252147] border border-[#F43F5E]/60 hover:bg-[#3D1424] text-[#FECDD3] text-[10px] uppercase font-gothic font-bold cursor-pointer rounded-lg transition-all"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Cartas na Mão */}
      <div className="flex items-end gap-3 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar min-h-[290px]">
        {hand.length === 0 ? (
          <div className="w-full text-center py-6 text-xs text-[#94A3B8] border border-dashed border-indigo-400/25 bg-[#181433]/70 rounded-xl font-parchment italic">
            Seu grimório está temporariamente vazio. Passe o turno para canalizar novas cartas celestes.
          </div>
        ) : (
          hand.map((card, idx) => {
            const isSpell = card.category === "FEITICO";
            const hasEnoughMana = currentMana >= card.manaCost;
            const isBlockedByFieldLimit = !isSpell && isFieldFull;
            const isPlayable = hasEnoughMana && !isBlockedByFieldLimit;
            const isSelected = selectedCard?.id === card.id;

            return (
              <div key={`${card.id}-${idx}`} className="relative flex-shrink-0 flex flex-col items-center">
                <CardComponent
                  card={card}
                  size="sm"
                  interactive={true}
                  isSelected={isSelected}
                  isPlayable={isPlayable}
                  onClick={() => onSelectCard(card)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
