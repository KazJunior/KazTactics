"use client";

import { Card } from "@/db/schema";
import {
  Swords,
  Sparkles,
  Layers,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface DeckEntry {
  card: Card;
  quantity: number;
}

interface DeckSidebarProps {
  deckName: string;
  onDeckNameChange: (name: string) => void;
  deckCards: DeckEntry[];
  onRemoveCard: (cardId: string) => void;
  onClearDeck: () => void;
  onSaveDeck: () => void;
  isSaving: boolean;
  saveMessage: { type: "success" | "error"; text: string } | null;
}

export function DeckSidebar({
  deckName,
  onDeckNameChange,
  deckCards,
  onRemoveCard,
  onClearDeck,
  onSaveDeck,
  isSaving,
  saveMessage,
}: DeckSidebarProps) {
  // Contadores
  const totalCards = deckCards.reduce((acc, c) => acc + c.quantity, 0);
  const totalMonsters = deckCards
    .filter((c) => c.card.category === "MONSTRO")
    .reduce((acc, c) => acc + c.quantity, 0);
  const totalSpells = deckCards
    .filter((c) => c.card.category === "FEITICO")
    .reduce((acc, c) => acc + c.quantity, 0);

  // Status de Validação
  const isTotalValid = totalCards === 30;
  const isMonstersValid = totalMonsters === 20;
  const isSpellsValid = totalSpells === 10;
  const isDeckValid = isTotalValid && isMonstersValid && isSpellsValid;

  // Curva de Mana (Custos de 1 a 10)
  const manaCurve: number[] = new Array(10).fill(0);
  for (const item of deckCards) {
    const cost = Math.min(Math.max(item.card.manaCost, 1), 10);
    manaCurve[cost - 1] += item.quantity;
  }
  const maxManaCount = Math.max(...manaCurve, 1);

  // Ordenar cartas do deck por Custo de Mana crescente e depois Nome
  const sortedDeckCards = [...deckCards].sort((a, b) => {
    if (a.card.manaCost !== b.card.manaCost) {
      return a.card.manaCost - b.card.manaCost;
    }
    return a.card.name.localeCompare(b.card.name);
  });

  return (
    <div className="bg-[#121016]/95 border-2 border-[#26232C] rounded-2xl p-5 md:p-6 backdrop-blur-xl flex flex-col justify-between h-full space-y-6 shadow-2xl relative overflow-hidden">
      {/* Vinheta sutil de fundo do painel */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D97724]/5 via-transparent to-black pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Título & Nome do Baralho */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-gothic text-[11px] font-black uppercase tracking-wider text-[#F29F3D]">
              Grimório Ativo
            </span>
            {deckCards.length > 0 && (
              <button
                onClick={onClearDeck}
                className="text-[11px] font-bold text-[#9E8C70] hover:text-[#B82923] flex items-center gap-1 transition-colors"
                title="Limpar todas as cartas do baralho"
              >
                <Trash2 className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>

          <input
            type="text"
            value={deckName}
            onChange={(e) => onDeckNameChange(e.target.value)}
            placeholder="Nome do Grimório..."
            className="w-full bg-[#09080B] border-2 border-[#26232C] rounded-lg px-3.5 py-2 text-sm font-gothic font-bold text-[#C8B99E] placeholder-[#9E8C70]/50 focus:outline-none focus:border-[#D97724] transition-colors"
          />
        </div>

        {/* ======================================================== */}
        {/* CONTADORES VISUAIS EM TEMPO REAL */}
        {/* ======================================================== */}
        <div className="space-y-3 p-4 rounded-xl bg-[#09080B] border border-[#26232C]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#C8B99E] flex items-center gap-1.5 font-gothic text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#D97724]" /> Total de Cartas
            </span>
            <span
              className={`px-2 py-0.5 rounded font-numbers font-black text-xs ${
                isTotalValid
                  ? "bg-[#2E8B78]/20 text-[#2E8B78] border border-[#2E8B78]/50"
                  : "bg-[#1A1821] text-[#C8B99E] border border-[#26232C]"
              }`}
            >
              {totalCards} / 30
            </span>
          </div>

          {/* Barra de Progresso Total com Luz de Tocha / Sangue */}
          <div className="w-full h-2 rounded-full bg-[#1A1821] overflow-hidden border border-[#26232C]">
            <div
              className={`h-full transition-all duration-300 ${
                isTotalValid
                  ? "bg-[#2E8B78]"
                  : totalCards > 30
                  ? "bg-[#B82923]"
                  : "bg-gradient-to-r from-[#D97724] to-[#F29F3D]"
              }`}
              style={{ width: `${Math.min((totalCards / 30) * 100, 100)}%` }}
            />
          </div>

          {/* Sub-contadores: Monstros e Feitiços */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#26232C] text-xs">
            {/* Monstros: X / 20 */}
            <div
              className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isMonstersValid
                  ? "bg-[#2E8B78]/15 border-[#2E8B78]/40 text-[#2E8B78]"
                  : "bg-[#121016] border-[#26232C] text-[#C8B99E]"
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-gothic text-[#9E8C70]">
                <Swords className="w-3 h-3 text-[#D97724]" />
                <span>Monstros</span>
              </div>
              <span className="text-base font-numbers font-black mt-1">
                {totalMonsters}{" "}
                <span className="text-xs font-normal text-[#9E8C70]">/ 20</span>
              </span>
            </div>

            {/* Feitiços: Y / 10 */}
            <div
              className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isSpellsValid
                  ? "bg-[#6B2D84]/20 border-[#6B2D84]/50 text-[#c77dff]"
                  : "bg-[#121016] border-[#26232C] text-[#C8B99E]"
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-gothic text-[#9E8C70]">
                <Sparkles className="w-3 h-3 text-[#9d4edd]" />
                <span>Feitiços</span>
              </div>
              <span className="text-base font-numbers font-black mt-1">
                {totalSpells}{" "}
                <span className="text-xs font-normal text-[#9E8C70]">/ 10</span>
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GRÁFICO DA CURVA DE MANA (CUSTOS 1 A 10) */}
        {/* ======================================================== */}
        <div className="p-4 rounded-xl bg-[#09080B] border border-[#26232C] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#C8B99E]">
            <span className="flex items-center gap-1.5 font-gothic text-[11px]">
              <Zap className="w-3.5 h-3.5 text-[#F29F3D]" /> Curva de Mana
            </span>
            <span className="text-[10px] font-numbers text-[#9E8C70]">Custos 1 a 10</span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-20 pt-4 px-1">
            {manaCurve.map((count, idx) => {
              const heightPercent =
                count > 0 ? Math.max((count / maxManaCount) * 100, 15) : 4;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative"
                >
                  {/* Tooltip com quantidade */}
                  {count > 0 && (
                    <span className="text-[9px] font-numbers font-black text-[#F29F3D]">
                      {count}
                    </span>
                  )}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      count > 0
                        ? "bg-gradient-to-t from-[#D97724] to-[#F29F3D] group-hover:brightness-125 shadow-sm shadow-[#D97724]/40"
                        : "bg-[#26232C]/40"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] font-numbers font-bold text-[#9E8C70]">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* LISTA DAS CARTAS NO BARALHO */}
        {/* ======================================================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-gothic font-bold text-[#9E8C70]">
            <span>Composição do Grimório ({sortedDeckCards.length} tipos)</span>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
            {sortedDeckCards.length === 0 ? (
              <div className="text-center py-8 text-xs font-parchment text-[#9E8C70] border border-dashed border-[#26232C] rounded-lg">
                Nenhuma relíquia ou criatura adicionada.
                <span className="block mt-1 text-[11px] text-[#9E8C70]/70">
                  Adicione cartas do seu acervo à esquerda.
                </span>
              </div>
            ) : (
              sortedDeckCards.map(({ card, quantity }) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#09080B] border border-[#26232C] hover:border-[#3A3542] transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-5 h-5 rounded bg-[#1A1821] border border-[#D97724]/40 text-[#F29F3D] text-[10px] font-numbers font-black flex items-center justify-center shrink-0">
                      {card.manaCost}
                    </span>
                    <span className="text-xs font-gothic font-semibold text-[#C8B99E] truncate">
                      {card.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-numbers font-black text-[#F29F3D] px-1.5 py-0.5 rounded bg-[#121016] border border-[#26232C]">
                      {quantity}x
                    </span>
                    <button
                      onClick={() => onRemoveCard(card.id)}
                      className="text-[#9E8C70] hover:text-[#B82923] p-1 rounded hover:bg-[#1A1821] transition-colors"
                      title="Remover uma cópia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MENSAGEM DE VALIDAÇÃO & BOTÃO SALVAR */}
      {/* ======================================================== */}
      <div className="relative z-10 pt-4 border-t border-[#26232C] space-y-3">
        {saveMessage && (
          <div
            className={`p-3 rounded-lg text-xs font-medium flex items-start gap-2 ${
              saveMessage.type === "success"
                ? "bg-[#2E8B78]/20 border border-[#2E8B78]/60 text-[#a7f3d0]"
                : "bg-[#8C1D18]/30 border border-[#B82923]/60 text-[#fecdd3]"
            }`}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#2E8B78] shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#B82923] shrink-0 mt-0.5" />
            )}
            <span className="font-parchment text-sm">{saveMessage.text}</span>
          </div>
        )}

        <button
          onClick={onSaveDeck}
          disabled={!isDeckValid || isSaving}
          className="w-full btn-iron-torch flex items-center justify-center gap-2 py-3.5 rounded-xl font-gothic font-black text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>
            {isSaving
              ? "Gravando no NeonDB..."
              : isDeckValid
              ? "Selar Baralho (30 Cartas)"
              : `Incompleto (${totalCards}/30 cartas)`}
          </span>
        </button>

        {!isDeckValid && (
          <p className="font-parchment text-xs text-center text-[#9E8C70] leading-tight">
            Para selar o grimório, requer-se exatamente{" "}
            <strong className="text-[#F29F3D]">20 Monstros</strong> e{" "}
            <strong className="text-[#c77dff]">10 Feitiços</strong> (Total: 30).
          </p>
        )}
      </div>
    </div>
  );
}
