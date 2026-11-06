"use client";

import { Card } from "@/db/schema";
import { CardComponent } from "@/components/cards/CardComponent";
import { Menu, FastForward, X } from "lucide-react";

interface HandCardsProps {
  hand: Card[];
  deckCount: number;
  currentMana: number;
  playerUnitsCount: number;
  selectedCard: Card | null;
  onSelectCard: (card: Card) => void;
  onCancelSelection: () => void;
  onEndTurn?: () => void;
  isAiTurn?: boolean;
  onRestartBattle?: () => void;
}

/**
 * Barra Inferior de Batalha com o Modelo Clássico de Carta Completo (Custo, Nome, Descrição, Status e Trajetória)
 * + Indicador "Falta X Mana" nas cartas bloqueadas, fiel à imagem de referência.
 */
export function HandCards({
  hand,
  deckCount,
  currentMana,
  playerUnitsCount,
  selectedCard,
  onSelectCard,
  onCancelSelection,
  onEndTurn,
  isAiTurn = false,
  onRestartBattle,
}: HandCardsProps) {
  const isFieldFull = playerUnitsCount >= 7;

  return (
    <div className="relative w-full flex flex-col items-center space-y-2 pt-1 select-none">
      {/* Aviso flutuante caso uma carta esteja selecionada para invocação */}
      {selectedCard && (
        <div className="flex items-center gap-3 px-4 py-1.5 bg-[#1B1430]/95 border border-[#0EA5E9] rounded-full shadow-[0_0_20px_rgba(14,165,233,0.45)] animate-pulse">
          <span className="text-[#E0F2FE] text-xs font-gothic font-bold">
            {selectedCard.category === "FEITICO"
              ? `✦ Conjurando "${selectedCard.name}": Clique no alvo no tabuleiro`
              : `✦ Invocando "${selectedCard.name}": Clique em uma casa livre`}
          </span>
          <button
            onClick={onCancelSelection}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#1E293B] hover:bg-[#F43F5E] text-white text-[10px] uppercase font-gothic font-bold rounded-full cursor-pointer transition-colors"
          >
            <X className="w-3 h-3" /> Cancelar
          </button>
        </div>
      )}

      {/* Linha Inferior Principal: Menu (Esq) + Mão de Cartas (Centro) + Finalizar Turno (Dir) */}
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-4 px-2">
        {/* 1. Botão Hexagonal Esquerdo (Menu / Reiniciar Batalha) */}
        <div className="flex items-center gap-3 self-start xl:self-end mb-4">
          <button
            onClick={onRestartBattle}
            title={`Reiniciar Batalha • Grimório: ${deckCount} cartas restantes • Tropas: ${playerUnitsCount}/7`}
            className="group relative w-14 h-14 flex items-center justify-center bg-[#2D2644] hover:bg-[#7C3AED] transition-all duration-200 cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,0.85)]"
            style={{
              clipPath:
                "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
            }}
          >
            <div
              className="w-[calc(100%-4px)] h-[calc(100%-4px)] bg-[#141122] group-hover:bg-[#1E1836] flex items-center justify-center transition-colors"
              style={{
                clipPath:
                  "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
              }}
            >
              <Menu className="w-5 h-5 text-[#CBD5E1] group-hover:text-white" />
            </div>
          </button>
        </div>

        {/* 2. Pedestal Central com as Cartas Completas da Mão */}
        <div className="relative flex-1 flex flex-col items-center justify-end max-w-5xl w-full">
          {/* Base Sombria sob as Cartas */}
          <div className="absolute bottom-0 inset-x-4 h-20 bg-gradient-to-t from-[#09080B] via-[#120F1D]/90 to-transparent border-t border-[#26232C]/70 pointer-events-none rounded-t-2xl" />

          <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-4 overflow-x-auto pb-3 pt-4 px-4 max-w-full custom-scrollbar">
            {hand.length === 0 ? (
              <div className="px-8 py-6 text-xs text-[#94A3B8] border border-[#3E355B]/50 bg-[#141022]/85 rounded-xl font-parchment italic">
                Sem cartas na mão. Finalize o turno para comprar novas cartas.
              </div>
            ) : (
              hand.map((card, idx) => {
                const isSpell = card.category === "FEITICO";
                const hasEnoughMana = currentMana >= card.manaCost;
                const isBlockedByFieldLimit = !isSpell && isFieldFull;
                const isPlayable = hasEnoughMana && !isBlockedByFieldLimit;
                const isSelected = selectedCard?.id === card.id;
                const missingMana = Math.max(0, card.manaCost - currentMana);

                return (
                  <div
                    key={`${card.id}-${idx}`}
                    className="relative flex-shrink-0 flex flex-col items-center"
                  >
                    <CardComponent
                      card={card}
                      size="sm"
                      interactive={true}
                      isSelected={isSelected}
                      isPlayable={isPlayable}
                      onClick={() => onSelectCard(card)}
                    />

                    {/* Etiqueta "Falta X Mana" / "Campo Cheio" abaixo da carta bloqueada (Idêntico à Imagem 2) */}
                    {!hasEnoughMana ? (
                      <div className="mt-1.5 px-3 py-0.5 rounded bg-[#0E0C10] border border-[#26232C] text-[10px] font-parchment text-[#9E8C70] shadow-md">
                        Falta {missingMana} Mana
                      </div>
                    ) : isBlockedByFieldLimit ? (
                      <div className="mt-1.5 px-3 py-0.5 rounded bg-[#1F0913] border border-[#881337] text-[10px] font-parchment text-[#FDA4AF] shadow-md">
                        Campo Cheio (7/7)
                      </div>
                    ) : (
                      <div className="h-[22px]" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. Botão Hexagonal Direito "Finalizar Turno" */}
        {onEndTurn && (
          <div className="self-end mb-4">
            <button
              onClick={onEndTurn}
              disabled={isAiTurn}
              className="group relative h-16 px-8 flex items-center justify-center bg-gradient-to-r from-[#5B4B8A] via-[#7C3AED] to-[#4C3D75] hover:from-[#38BDF8] hover:via-[#A855F7] hover:to-[#EC4899] disabled:opacity-45 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-[0_8px_28px_rgba(0,0,0,0.9)]"
              style={{
                clipPath:
                  "polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)",
              }}
            >
              <div
                className="w-[calc(100%-4px)] h-[calc(100%-4px)] px-6 bg-gradient-to-b from-[#1E1936] to-[#110E20] group-hover:from-[#272046] group-hover:to-[#16122B] flex items-center justify-center gap-3 transition-colors"
                style={{
                  clipPath:
                    "polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)",
                }}
              >
                <FastForward className="w-5 h-5 text-[#C084FC] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                <div className="flex flex-col items-center leading-tight">
                  <span className="font-gothic font-bold text-sm sm:text-base text-[#F8FAFC] tracking-wide">
                    {isAiTurn ? "Turno Inimigo..." : "Finalizar"}
                  </span>
                  {!isAiTurn && (
                    <span className="font-gothic font-bold text-sm sm:text-base text-[#F8FAFC] tracking-wide">
                      Turno
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
