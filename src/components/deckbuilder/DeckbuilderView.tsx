"use client";

import { useState, useTransition, useMemo } from "react";
import { Card } from "@/db/schema";
import { DeckbuilderData, saveDeckAction } from "@/actions/deck";
import { CardItem } from "./CardItem";
import { DeckSidebar } from "./DeckSidebar";
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  Swords,
  SlidersHorizontal,
  RotateCcw,
  Check,
} from "lucide-react";

interface DeckbuilderViewProps {
  initialData: DeckbuilderData;
}

const CARD_TYPES = [
  { value: "ALL", label: "Todos os Tipos" },
  { value: "ARTROPODES", label: "Artrópodes" },
  { value: "BESTIAIS", label: "Bestiais" },
  { value: "MORTOS_VIVOS", label: "Mortos-Vivos" },
  { value: "ESPIRITOS", label: "Espíritos" },
  { value: "HUMANOIDES", label: "Humanóides" },
  { value: "MECANICOS", label: "Mecânicos" },
  { value: "MITOLOGICOS", label: "Mitológicos" },
  { value: "FEITICOS", label: "Feitiços" },
];

const RARITIES = [
  { value: "ALL", label: "Todas as Raridades" },
  { value: "COMUM", label: "Comum" },
  { value: "INCOMUM", label: "Incomum" },
  { value: "RARO", label: "Raro" },
  { value: "EPICO", label: "Épico" },
  { value: "LENDARIO", label: "Lendário" },
];

export function DeckbuilderView({ initialData }: DeckbuilderViewProps) {
  // Estado do Baralho
  const [deckName, setDeckName] = useState(
    initialData.activeDeck?.name || "Meu Baralho Tático"
  );
  const [deckId, setDeckId] = useState<string | undefined>(
    initialData.activeDeck?.id
  );

  // Mapeamento { [cardId]: { card, quantity } }
  const [deckCardsMap, setDeckCardsMap] = useState<
    Map<string, { card: Card; quantity: number }>
  >(() => {
    const map = new Map<string, { card: Card; quantity: number }>();
    if (initialData.activeDeck) {
      for (const item of initialData.activeDeck.cards) {
        map.set(item.card.id, { card: item.card, quantity: item.quantity });
      }
    }
    return map;
  });

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "ALL" | "MONSTRO" | "FEITICO"
  >("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRarity, setSelectedRarity] = useState<string>("ALL");
  const [selectedMana, setSelectedMana] = useState<number | null>(null);

  // Estado de Salvar
  const [isSaving, startSaving] = useTransition();
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Array do Baralho para passar aos componentes
  const deckCardsArray = useMemo(() => {
    return Array.from(deckCardsMap.values());
  }, [deckCardsMap]);

  const totalCardsInDeck = useMemo(() => {
    return deckCardsArray.reduce((acc, c) => acc + c.quantity, 0);
  }, [deckCardsArray]);

  // Manipulação do Baralho
  const handleAddCard = (card: Card) => {
    if (totalCardsInDeck >= 30) return;

    setSaveMessage(null);
    setDeckCardsMap((prev) => {
      const next = new Map(prev);
      const current = next.get(card.id);
      if (current) {
        next.set(card.id, { card, quantity: current.quantity + 1 });
      } else {
        next.set(card.id, { card, quantity: 1 });
      }
      return next;
    });
  };

  const handleRemoveCard = (cardId: string) => {
    setSaveMessage(null);
    setDeckCardsMap((prev) => {
      const next = new Map(prev);
      const current = next.get(cardId);
      if (!current) return prev;

      if (current.quantity > 1) {
        next.set(cardId, { card: current.card, quantity: current.quantity - 1 });
      } else {
        next.delete(cardId);
      }
      return next;
    });
  };

  const handleClearDeck = () => {
    setSaveMessage(null);
    setDeckCardsMap(new Map());
  };

  // Salvar no NeonDB
  const handleSaveDeck = () => {
    setSaveMessage(null);
    startSaving(async () => {
      const cardsPayload = deckCardsArray.map((c) => ({
        cardId: c.card.id,
        quantity: c.quantity,
      }));

      const res = await saveDeckAction({
        deckId,
        name: deckName,
        cards: cardsPayload,
      });

      if (res.success) {
        if (res.deckId) setDeckId(res.deckId);
        setSaveMessage({
          type: "success",
          text: res.message || "Baralho salvo com sucesso!",
        });
      } else {
        setSaveMessage({
          type: "error",
          text: res.error || "Erro ao validar e salvar baralho.",
        });
      }
    });
  };

  // Resetar Filtros
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedType("ALL");
    setSelectedRarity("ALL");
    setSelectedMana(null);
  };

  // Filtragem da Coleção
  const filteredCollection = useMemo(() => {
    return initialData.collection.filter(({ card }) => {
      // Busca por nome
      if (
        searchQuery &&
        !card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !card.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Categoria
      if (selectedCategory !== "ALL" && card.category !== selectedCategory) {
        return false;
      }

      // Tipo
      if (selectedType !== "ALL" && card.type !== selectedType) {
        return false;
      }

      // Raridade
      if (selectedRarity !== "ALL" && card.rarity !== selectedRarity) {
        return false;
      }

      // Custo de Mana
      if (selectedMana !== null && card.manaCost !== selectedMana) {
        return false;
      }

      return true;
    });
  }, [
    initialData.collection,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedRarity,
    selectedMana,
  ]);

  return (
    <div className="space-y-8">
      {/* Topo: Apresentação e Boas-Vindas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4" /> Construção de Baralhos & Coleção
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            Deckbuilder Tático
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monte seu baralho com exatamente 30 cartas (20 Monstros e 10
            Feitiços) para disputar as batalhas da Campanha PvE.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-xs">
          <span className="text-slate-400">Coleção Total:</span>
          <strong className="text-amber-300 font-black">
            {initialData.collection.length} tipos de cartas
          </strong>
        </div>
      </div>

      {/* Grid Principal: Coleção (Esquerda) + Barra Lateral (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* COLUNA ESQUERDA: FILTROS & COLEÇÃO (8 colunas) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Painel de Filtros */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl space-y-4">
            {/* Linha 1: Campo de Busca e Categoria */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Busca por texto */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou efeito..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Botões de Categoria: Todos / Monstros / Feitiços */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === "ALL"
                      ? "bg-slate-800 text-amber-300 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedCategory("MONSTRO")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === "MONSTRO"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Monstros
                </button>
                <button
                  onClick={() => setSelectedCategory("FEITICO")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === "FEITICO"
                      ? "bg-purple-950 text-purple-300 border border-purple-600/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Feitiços
                </button>
              </div>
            </div>

            {/* Linha 2: Filtros por Tipo e Raridade */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Dropdown de Tipo */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                {CARD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              {/* Dropdown de Raridade */}
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                {RARITIES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Resetar Filtros */}
              {(searchQuery ||
                selectedCategory !== "ALL" ||
                selectedType !== "ALL" ||
                selectedRarity !== "ALL" ||
                selectedMana !== null) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>

            {/* Linha 3: Filtro Rápido por Custo de Mana (1 a 10) */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0">
                Mana:
              </span>
              <button
                onClick={() => setSelectedMana(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedMana === null
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                Todos
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cost) => (
                <button
                  key={cost}
                  onClick={() =>
                    setSelectedMana(selectedMana === cost ? null : cost)
                  }
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                    selectedMana === cost
                      ? "bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20"
                      : "bg-slate-950 text-slate-300 hover:border-slate-600 border border-slate-800"
                  }`}
                >
                  {cost}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Cartas da Coleção */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Exibindo <strong>{filteredCollection.length}</strong> de{" "}
                {initialData.collection.length} cartas
              </span>
            </div>

            {filteredCollection.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/60">
                <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">
                  Nenhuma carta encontrada com esses filtros.
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Tente alterar ou limpar os filtros de busca para encontrar mais
                  cartas da sua coleção.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-colors"
                >
                  Restaurar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredCollection.map(({ card, ownedQuantity }) => {
                  const deckEntry = deckCardsMap.get(card.id);
                  const deckQuantity = deckEntry ? deckEntry.quantity : 0;

                  return (
                    <CardItem
                      key={card.id}
                      card={card}
                      ownedQuantity={ownedQuantity}
                      deckQuantity={deckQuantity}
                      onAdd={() => handleAddCard(card)}
                      onRemove={() => handleRemoveCard(card.id)}
                      canAdd={totalCardsInDeck < 30}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUNA DIREITA: SIDEBAR DO BARALHO ATIVO (4 colunas) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 sticky top-20">
          <DeckSidebar
            deckName={deckName}
            onDeckNameChange={setDeckName}
            deckCards={deckCardsArray}
            onRemoveCard={handleRemoveCard}
            onClearDeck={handleClearDeck}
            onSaveDeck={handleSaveDeck}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />
        </div>
      </div>
    </div>
  );
}

