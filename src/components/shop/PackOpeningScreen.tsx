"use client";

import { useState, useTransition, useEffect } from "react";
import { buyPackAction, addTestGoldAction } from "@/actions/shop";
import { PACK_PRICES } from "@/lib/constants";
import { DrawnCard } from "@/types";
import { CardFlip } from "./CardFlip";
import {
  RustIronChest,
  EldritchUrn,
  ChainsShatterAnim,
  CathedralBellResonance,
} from "./AntiquarianRelics";
import {
  Coins,
  Sparkles,
  ArrowRight,
  Flame,
  RotateCcw,
  PlusCircle,
  AlertCircle,
  Crown,
} from "lucide-react";

interface PackOpeningScreenProps {
  initialGold: number;
  username: string;
}

export function PackOpeningScreen({
  initialGold,
  username,
}: PackOpeningScreenProps) {
  const [gold, setGold] = useState(initialGold);
  const [isOpening, setIsOpening] = useState(false);
  const [isChainsBreaking, setIsChainsBreaking] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastPackType, setLastPackType] = useState<"STANDARD" | "MYSTIC">(
    "STANDARD"
  );
  const [ambientTorch, setAmbientTorch] = useState<
    "NORMAL" | "PURPLE" | "GOLD_CRIMSON"
  >("NORMAL");
  const [activeChime, setActiveChime] = useState<"EPICO" | "LENDARIO" | null>(
    null
  );

  const [isPending, startTransition] = useTransition();

  // Abrir pacote
  const handleBuyPack = (packType: "STANDARD" | "MYSTIC") => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await buyPackAction(packType);
      if (res.success) {
        setGold(res.remainingGold);
        setDrawnCards(res.cards);
        setRevealedIndices([]);
        setLastPackType(packType);
        setAmbientTorch("NORMAL");
        setActiveChime(null);
        setIsChainsBreaking(true);
        setIsOpening(true);

        // Termina a animação das correntes
        setTimeout(() => setIsChainsBreaking(false), 750);
      } else {
        setErrorMessage(res.error || "Erro ao abrir pacote.");
      }
    });
  };

  // Revelar uma carta individual com detecção de sino e tocha
  const handleRevealCard = (index: number) => {
    if (!revealedIndices.includes(index)) {
      setRevealedIndices((prev) => [...prev, index]);
      const card = drawnCards[index];
      if (card) {
        if (card.rarity === "LENDARIO") {
          setAmbientTorch("GOLD_CRIMSON");
          setActiveChime("LENDARIO");
          setTimeout(() => setActiveChime(null), 900);
        } else if (card.rarity === "EPICO" && ambientTorch !== "GOLD_CRIMSON") {
          setAmbientTorch("PURPLE");
          setActiveChime("EPICO");
          setTimeout(() => setActiveChime(null), 900);
        }
      }
    }
  };

  // Revelar todas as cartas
  const handleRevealAll = () => {
    setRevealedIndices([0, 1, 2, 3, 4]);
    const hasLegendary = drawnCards.some((c) => c.rarity === "LENDARIO");
    const hasEpic = drawnCards.some((c) => c.rarity === "EPICO");
    if (hasLegendary) {
      setAmbientTorch("GOLD_CRIMSON");
      setActiveChime("LENDARIO");
      setTimeout(() => setActiveChime(null), 900);
    } else if (hasEpic) {
      setAmbientTorch("PURPLE");
      setActiveChime("EPICO");
      setTimeout(() => setActiveChime(null), 900);
    }
  };

  // Adicionar ouro de teste
  const handleAddGold = () => {
    startTransition(async () => {
      const res = await addTestGoldAction(200);
      if (res.success && res.newGold !== undefined) {
        setGold(res.newGold);
      }
    });
  };

  // Fechar tela de revelação
  const handleCloseOpening = () => {
    setIsOpening(false);
    setDrawnCards([]);
    setRevealedIndices([]);
    setAmbientTorch("NORMAL");
    setActiveChime(null);
  };

  const allRevealed =
    drawnCards.length > 0 && revealedIndices.length === drawnCards.length;

  return (
    <div className="space-y-10">
      {/* Mensagem de Erro / Alerta */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#8C1D18]/30 border-2 border-[#B82923] text-[#fecdd3] text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-[#B82923] shrink-0" />
          <span className="flex-1 font-parchment text-base">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs uppercase font-gothic font-bold text-[#fecdd3] hover:text-white"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Banner Principal: A Tenda do Antiquário */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#26232C] bg-gradient-to-r from-[#161210] via-[#09080B] to-[#161210] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D97724]/10 via-transparent to-[#6B2D84]/15 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#09080B] border border-[#D97724]/40 text-[#F29F3D] text-xs font-gothic font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-[#D97724] animate-pulse" /> A Tenda do Antiquário &middot; Altar de Relíquias
            </div>
            <h1 className="text-3xl md:text-4xl font-gothic font-black text-[#C8B99E] tracking-tight">
              Troca de Ouro por Relíquias Antigas
            </h1>
            <p className="font-parchment text-base text-[#9E8C70] max-w-xl leading-relaxed">
              "Todo artefato tem seu preço em sangue ou ouro... Escolha seu fardo e quebre os selos se tiver coragem."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#09080B]/90 border-2 border-[#26232C] p-4 rounded-xl shadow-inner">
            <div>
              <span className="text-[11px] font-gothic uppercase tracking-wider text-[#9E8C70] block">
                Tesouro do Conjurador
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="w-6 h-6 text-[#D97724] fill-[#D97724]" />
                <span className="text-2xl md:text-3xl font-numbers font-black text-[#F29F3D]">
                  {gold.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-[#9E8C70] font-gothic uppercase">
                  Ouro
                </span>
              </div>
            </div>

            <div className="sm:border-l sm:border-[#26232C] sm:pl-3 pt-2 sm:pt-0 w-full sm:w-auto">
              <button
                onClick={handleAddGold}
                disabled={isPending}
                className="w-full sm:w-auto btn-iron flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-gothic font-bold text-[#F29F3D] transition-all disabled:opacity-50 cursor-pointer"
                title="Adicionar ouro para testar o sistema de abertura à vontade"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+200 Ouro</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid das Relíquias: Baú Enferrujado e Urna Lacrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Baú de Ferro Enferrujado (Pacote Padrão) */}
        <div className="group relative rounded-2xl border-2 border-[#26232C] bg-[#121016] p-6 md:p-8 flex flex-col justify-between hover:border-[#D97724] transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,36,0.2)]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-gothic font-bold uppercase tracking-wider text-[#9E8C70] px-2.5 py-1 rounded bg-[#09080B] border border-[#26232C]">
                  Relíquia de Masmorra
                </span>
                <h2 className="text-2xl font-gothic font-black text-[#C8B99E] mt-3 group-hover:text-[#F29F3D] transition-colors">
                  Baú Enferrujado de Ferro
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70] mt-1">
                  Envolto em grossas correntes oxidadas. Contém 5 cartas de criaturas e feitiços selados.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#09080B] border border-[#26232C] group-hover:scale-105 transition-transform">
                <RustIronChest />
              </div>
            </div>

            {/* Tabela de Chances do Baú */}
            <div className="mt-6 space-y-1.5 text-xs">
              <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#9E8C70] block mb-1">
                Probabilidades por Lâmina:
              </span>
              <div className="grid grid-cols-5 gap-1 text-center font-numbers font-bold text-[11px]">
                <div className="p-1.5 rounded bg-[#09080B] text-[#9E8C70] border border-[#26232C]">
                  Comum
                  <span className="block text-[10px] text-[#9E8C70]/70 font-normal">55%</span>
                </div>
                <div className="p-1.5 rounded bg-[#2E8B78]/20 text-[#2E8B78] border border-[#2E8B78]/40">
                  Incomum
                  <span className="block text-[10px] text-[#2E8B78]/80 font-normal">25%</span>
                </div>
                <div className="p-1.5 rounded bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                  Raro
                  <span className="block text-[10px] text-[#38bdf8]/80 font-normal">12%</span>
                </div>
                <div className="p-1.5 rounded bg-[#6B2D84]/20 text-[#c77dff] border border-[#6B2D84]/40">
                  Épico
                  <span className="block text-[10px] text-[#c77dff]/80 font-normal">6%</span>
                </div>
                <div className="p-1.5 rounded bg-[#D97724]/20 text-[#F29F3D] border border-[#D97724]/40">
                  Lendário
                  <span className="block text-[10px] text-[#F29F3D]/80 font-normal">2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#26232C] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-[#D97724] fill-[#D97724]" />
              <span className="text-xl font-numbers font-black text-[#F29F3D]">
                {PACK_PRICES.STANDARD}
              </span>
              <span className="text-xs font-gothic uppercase font-bold text-[#9E8C70]">
                Ouro
              </span>
            </div>

            <button
              onClick={() => handleBuyPack("STANDARD")}
              disabled={isPending || gold < PACK_PRICES.STANDARD}
              className="btn-iron-torch flex items-center gap-2 px-6 py-3 rounded-xl font-gothic font-black text-sm tracking-wide disabled:opacity-40 cursor-pointer"
            >
              <span>{isPending ? "Rompendo Correntes..." : "Romper Baú"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Urna Lacrada com Runas Eldritch (Pacote Místico) */}
        <div className="group relative rounded-2xl border-2 border-[#6B2D84]/60 bg-[#121016] p-6 md:p-8 flex flex-col justify-between hover:border-[#9d4edd] transition-all duration-300 hover:shadow-[0_0_35px_rgba(107,45,132,0.3)]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-gothic font-black uppercase tracking-wider text-[#c77dff] px-2.5 py-1 rounded bg-[#6B2D84]/20 border border-[#6B2D84]/40">
                  Altar Ocultista
                </span>
                <h2 className="text-2xl font-gothic font-black text-[#C8B99E] mt-3 group-hover:text-[#c77dff] transition-colors flex items-center gap-2">
                  <span>Urna Lacrada com Runas</span>
                  <Crown className="w-5 h-5 text-[#D97724] inline" />
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70] mt-1">
                  Urna de pedra negra selada a cera vermelha. Garantia de{" "}
                  <strong className="text-[#F29F3D]">
                    ao menos 1 carta Rara, Épica ou Lendária
                  </strong>
                  .
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#09080B] border border-[#6B2D84]/40 group-hover:scale-105 transition-transform">
                <EldritchUrn />
              </div>
            </div>

            {/* Benefício da 5ª Carta */}
            <div className="mt-6 p-3 rounded-lg bg-[#09080B] border border-[#6B2D84]/40 text-xs font-parchment text-[#C8B99E] flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#9d4edd] shrink-0" />
              <span>
                A 5ª lâmina da urna canaliza 60% de chance de Raro, 30% de Épico
                e 10% de Lendário ancestral.
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#26232C] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <Coins className="w-5 h-5 text-[#D97724] fill-[#D97724]" />
              <span className="text-xl font-numbers font-black text-[#F29F3D]">
                {PACK_PRICES.MYSTIC}
              </span>
              <span className="text-xs font-gothic uppercase font-bold text-[#9E8C70]">
                Ouro
              </span>
            </div>

            <button
              onClick={() => handleBuyPack("MYSTIC")}
              disabled={isPending || gold < PACK_PRICES.MYSTIC}
              className="btn-iron flex items-center gap-2 px-6 py-3 rounded-xl font-gothic font-black text-sm tracking-wide text-[#c77dff] hover:text-white border-[#6B2D84] disabled:opacity-40 cursor-pointer"
            >
              <span>{isPending ? "Quebrando Lacre..." : "Abrir Urna"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL EM TELA CHEIA: MESA DO ANTIQUÁRIO COM CARTAS 2D */}
      {/* ======================================================== */}
      {isOpening && drawnCards.length > 0 && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto transition-colors duration-500 ${
            ambientTorch === "GOLD_CRIMSON"
              ? "bg-[#180A04]/98 shadow-[inset_0_0_100px_rgba(212,155,39,0.35)]"
              : ambientTorch === "PURPLE"
              ? "bg-[#14061A]/98 shadow-[inset_0_0_100px_rgba(157,78,221,0.35)]"
              : "bg-[#09080B]/98"
          }`}
        >
          {/* Quebra de Correntes de Ferro ao Abrir */}
          {isChainsBreaking && <ChainsShatterAnim />}

          {/* Efeito de Sino de Catedral para Épicas e Lendárias */}
          {activeChime && <CathedralBellResonance rarity={activeChime} />}

          {/* Topo do Modal */}
          <div className="w-full max-w-7xl flex items-center justify-between pb-4 border-b border-[#26232C] z-10">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg border transition-colors ${
                  ambientTorch === "GOLD_CRIMSON"
                    ? "bg-[#2A1204] border-[#D49B27] text-[#FEF08A]"
                    : ambientTorch === "PURPLE"
                    ? "bg-[#200828] border-[#9D4EDD] text-[#e9d5ff]"
                    : "bg-[#121016] border-[#D97724]/40 text-[#F29F3D]"
                }`}
              >
                <Flame className="w-5 h-5 animate-torch" />
              </div>
              <div>
                <h2 className="text-lg font-gothic font-black text-[#C8B99E]">
                  {lastPackType === "MYSTIC"
                    ? "A Urna Lacrada foi Rompida"
                    : "O Baú Enferrujado foi Aberto"}
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70]">
                  {allRevealed
                    ? "Todas as lâminas foram reveladas e forjadas em seu grimório."
                    : "Toque nas cartas sobre a mesa para quebrar os selos arcanos."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!allRevealed && (
                <button
                  onClick={handleRevealAll}
                  className="btn-iron px-4 py-2 rounded-lg text-[#F29F3D] text-xs font-gothic font-bold transition-all cursor-pointer"
                >
                  Revelar Todas
                </button>
              )}

              <button
                onClick={handleCloseOpening}
                className="btn-iron px-4 py-2 rounded-lg text-[#C8B99E] text-xs font-gothic font-bold transition-all cursor-pointer"
              >
                Guardar Cartas
              </button>
            </div>
          </div>

          {/* Área Central: Mesa de Madeira com Velas Derretidas e Moedas Espalhadas */}
          <div className="relative my-6 w-full max-w-7xl flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#18120E] via-[#0E0B08] to-[#080605] border-3 border-[#26232C] shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Velas Derretidas e Moedas de Ouro Espalhadas nas Bordas */}
            <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none opacity-60">
              <span className="text-xs">🕯️</span>
              <span className="text-[10px] font-parchment text-[#9E8C70] italic">Cera derretida</span>
            </div>
            <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none opacity-70">
              <Coins className="w-4 h-4 text-[#D97724]" />
              <span className="text-[10px] font-numbers text-[#F29F3D]">Moedas de ouro antigo</span>
            </div>

            {/* As 5 Cartas Dispostas sobre a Mesa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full justify-items-center relative z-10">
              {drawnCards.map((card, index) => (
                <CardFlip
                  key={`${card.id}-${index}`}
                  card={card}
                  index={index}
                  isRevealed={revealedIndices.includes(index)}
                  onReveal={() => handleRevealCard(index)}
                />
              ))}
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#26232C] z-10">
            <div className="flex items-center gap-2 text-xs font-numbers text-[#9E8C70]">
              <Coins className="w-4 h-4 text-[#D97724]" />
              <span>
                Tesouro Restante:{" "}
                <strong className="text-[#F29F3D]">
                  {gold.toLocaleString("pt-BR")} Ouro
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBuyPack(lastPackType)}
                disabled={isPending || gold < PACK_PRICES[lastPackType]}
                className="btn-iron-torch flex items-center gap-2 px-5 py-2.5 rounded-lg font-gothic font-black text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  Romper Outro ({PACK_PRICES[lastPackType]} Ouro)
                </span>
              </button>

              <button
                onClick={handleCloseOpening}
                className="btn-iron px-5 py-2.5 rounded-lg text-[#C8B99E] font-gothic font-bold text-xs transition-all cursor-pointer"
              >
                Retornar à Tenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
