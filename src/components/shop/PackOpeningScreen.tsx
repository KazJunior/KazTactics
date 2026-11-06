"use client";

import { useState, useTransition } from "react";
import {
  buyPackAction,
  addTestGoldAction,
  grantSpecialSupremePackAction,
} from "@/actions/shop";
import { PACK_PRICES, PackType } from "@/lib/constants";
import { DrawnCard } from "@/types";
import { CardFlip } from "./CardFlip";
import {
  RustIronChest,
  EldritchUrn,
  SupremeAstralReliquary,
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
  Lock,
  Trophy,
} from "lucide-react";

interface PackOpeningScreenProps {
  initialGold: number;
  initialBasicPacks?: number;
  initialAdvancedPacks?: number;
  initialSupremePacks?: number;
  username: string;
}

export function PackOpeningScreen({
  initialGold,
  initialBasicPacks = 0,
  initialAdvancedPacks = 0,
  initialSupremePacks = 1,
  username,
}: PackOpeningScreenProps) {
  const [gold, setGold] = useState(initialGold);
  const [basicPacks, setBasicPacks] = useState(initialBasicPacks);
  const [advancedPacks, setAdvancedPacks] = useState(initialAdvancedPacks);
  const [supremePacks, setSupremePacks] = useState(initialSupremePacks);
  const [isOpening, setIsOpening] = useState(false);
  const [isChainsBreaking, setIsChainsBreaking] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastPackType, setLastPackType] = useState<PackType>("BASIC");
  const [ambientTorch, setAmbientTorch] = useState<
    "NORMAL" | "PURPLE" | "GOLD_CRIMSON"
  >("NORMAL");
  const [activeChime, setActiveChime] = useState<"EPICO" | "LENDARIO" | null>(
    null
  );

  const [isPending, startTransition] = useTransition();

  // Abrir pacote (Básico, Avançado ou Supremo)
  const handleBuyPack = (packType: PackType) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await buyPackAction(packType);
      if (res.success) {
        setGold(res.remainingGold);
        if (res.remainingBasicPacks !== undefined) {
          setBasicPacks(res.remainingBasicPacks);
        }
        if (res.remainingAdvancedPacks !== undefined) {
          setAdvancedPacks(res.remainingAdvancedPacks);
        }
        if (res.remainingSupremePacks !== undefined) {
          setSupremePacks(res.remainingSupremePacks);
        }
        setDrawnCards(res.cards);
        setRevealedIndices([]);
        setLastPackType(packType);
        setAmbientTorch(packType === "SUPREME" ? "GOLD_CRIMSON" : "NORMAL");
        setActiveChime(null);
        setIsChainsBreaking(true);
        setIsOpening(true);

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
      const res = await addTestGoldAction(2000);
      if (res.success && res.newGold !== undefined) {
        setGold(res.newGold);
      }
    });
  };

  // Resgatar Pacote Supremo especial (evento / conquista)
  const handleClaimSpecialSupremePack = () => {
    startTransition(async () => {
      const res = await grantSpecialSupremePackAction(1);
      if (res.success && res.newSupremePacks !== undefined) {
        setSupremePacks(res.newSupremePacks);
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

  const canRepeatLastPack =
    lastPackType === "SUPREME"
      ? supremePacks > 0
      : lastPackType === "BASIC"
      ? basicPacks > 0 || gold >= PACK_PRICES.BASIC
      : advancedPacks > 0 || gold >= PACK_PRICES.ADVANCED;

  return (
    <div className="space-y-10">
      {/* Mensagem de Erro / Alerta */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#8C1D18]/30 border-2 border-[#B82923] text-[#fecdd3] text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-[#B82923] shrink-0" />
          <span className="flex-1 font-parchment text-base">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs uppercase font-gothic font-bold text-[#fecdd3] hover:text-white cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Banner Principal: A Tenda do Antiquário */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#26232C] bg-gradient-to-r from-[#161210] via-[#09080B] to-[#161210] p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D97724]/10 via-transparent to-[#6B2D84]/15 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#09080B] border border-[#D97724]/40 text-[#F29F3D] text-xs font-gothic font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-[#D97724] animate-pulse" /> A Tenda do Antiquário &middot; 3 Graus de Relíquias
            </div>
            <h1 className="text-3xl md:text-4xl font-gothic font-black text-[#C8B99E] tracking-tight">
              Pacotes Básico, Avançado &amp; Supremo
            </h1>
            <p className="font-parchment text-base text-[#9E8C70] max-w-xl leading-relaxed">
              &ldquo;Acumule cópias para evoluir suas criaturas até o Nível 10 (+10% de status por nível). O Pacote Supremo não se curva ao ouro comum — apenas aos conquistadores!&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-[#09080B]/90 border-2 border-[#26232C] p-4 rounded-xl shadow-inner">
            {/* Saldo de Ouro */}
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

            {/* Contador de Pacotes Supremos */}
            <div className="border-l border-[#26232C] pl-4">
              <span className="text-[11px] font-gothic uppercase tracking-wider text-[#E9D5FF] block">
                Relíquias Supremas
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Crown className="w-6 h-6 text-[#FACC15]" />
                <span className="text-2xl md:text-3xl font-numbers font-black text-[#FEF08A]">
                  {supremePacks}x
                </span>
                <span className="text-xs text-[#D8B4FE] font-gothic uppercase">
                  Supremo
                </span>
              </div>
            </div>

            {/* Botões de Apoio / Recompensa */}
            <div className="flex flex-col gap-1.5 sm:border-l sm:border-[#26232C] sm:pl-3 w-full sm:w-auto">
              <button
                onClick={handleAddGold}
                disabled={isPending}
                className="btn-iron flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-gothic font-bold text-[#F29F3D] transition-all disabled:opacity-50 cursor-pointer"
                title="Adicionar ouro para testar pacotes Básico e Avançado"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+2.000 Ouro</span>
              </button>
              <button
                onClick={handleClaimSpecialSupremePack}
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E1065] hover:bg-[#3B0764] border border-[#FACC15]/60 text-xs font-gothic font-bold text-[#FEF08A] transition-all disabled:opacity-50 cursor-pointer"
                title="Resgatar 1 Pacote Supremo de Conquista Especial"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>+1 Pacote Supremo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GRID DOS 3 TIPOS DE PACOTES: BÁSICO, AVANÇADO E SUPREMO  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. PACOTE BÁSICO (Menores chances de raras: 5% Épica, 0.5% Lendária) */}
        <div className="group relative rounded-2xl border-2 border-[#26232C] bg-[#121016] p-6 flex flex-col justify-between hover:border-[#D97724] transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,119,36,0.2)]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#9E8C70] px-2.5 py-1 rounded bg-[#09080B] border border-[#26232C]">
                  Grau I &bull; Comum
                </span>
                <h2 className="text-2xl font-gothic font-black text-[#C8B99E] mt-2.5 group-hover:text-[#F29F3D] transition-colors">
                  Pacote Básico
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70] mt-1">
                  Baú de ferro oxidado com 5 cartas e cópias abundantes de raridades iniciais. Possui as menores chances de cartas raras.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#09080B] border border-[#26232C] group-hover:scale-105 transition-transform shrink-0">
                <RustIronChest />
              </div>
            </div>

            {/* Tabela de Probabilidades do Pacote Básico */}
            <div className="mt-5 space-y-1.5 text-xs">
              <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#9E8C70] block mb-1">
                Chances por Carta (Pacote Básico):
              </span>
              <div className="grid grid-cols-5 gap-1 text-center font-numbers font-bold text-[10px]">
                <div className="p-1.5 rounded bg-[#09080B] text-[#9E8C70] border border-[#26232C]">
                  Comum
                  <span className="block text-[10px] text-[#E2E8F0] font-black">55%</span>
                </div>
                <div className="p-1.5 rounded bg-[#2E8B78]/20 text-[#6EE7B7] border border-[#2E8B78]/40">
                  Incomum
                  <span className="block text-[10px] text-[#6EE7B7] font-black">25%</span>
                </div>
                <div className="p-1.5 rounded bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                  Rara
                  <span className="block text-[10px] text-[#38bdf8] font-black">14.5%</span>
                </div>
                <div className="p-1.5 rounded bg-[#6B2D84]/20 text-[#c77dff] border border-[#6B2D84]/40">
                  Épica
                  <span className="block text-[10px] text-[#c77dff] font-black">5%</span>
                </div>
                <div className="p-1.5 rounded bg-[#D97724]/20 text-[#F29F3D] border border-[#D97724]/40">
                  Lendária
                  <span className="block text-[10px] text-[#F29F3D] font-black">0.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#26232C] flex items-center justify-between gap-3">
            {basicPacks > 0 ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-gothic uppercase tracking-wider text-[#34D399]">
                  Pacotes em Posse:
                </span>
                <span className="text-base font-numbers font-black text-[#6EE7B7]">
                  🎁 {basicPacks}x Grátis
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-[#D97724] fill-[#D97724]" />
                <span className="text-xl font-numbers font-black text-[#F29F3D]">
                  {PACK_PRICES.BASIC}
                </span>
                <span className="text-xs font-gothic uppercase font-bold text-[#9E8C70]">
                  Ouro
                </span>
              </div>
            )}

            <button
              onClick={() => handleBuyPack("BASIC")}
              disabled={isPending || (basicPacks <= 0 && gold < PACK_PRICES.BASIC)}
              className="btn-iron-torch flex items-center gap-2 px-5 py-2.5 rounded-xl font-gothic font-black text-xs tracking-wide disabled:opacity-40 cursor-pointer"
            >
              <span>
                {isPending
                  ? "Abrindo..."
                  : basicPacks > 0
                  ? `Abrir Básico (${basicPacks}x)`
                  : "Comprar Básico"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. PACOTE AVANÇADO (Mais caro | Maiores chances: 10% Épica, 2% Lendária) */}
        <div className="group relative rounded-2xl border-2 border-[#6B2D84]/70 bg-[#121016] p-6 flex flex-col justify-between hover:border-[#A855F7] transition-all duration-300 hover:shadow-[0_0_35px_rgba(168,85,247,0.3)]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-gothic font-black uppercase tracking-wider text-[#c77dff] px-2.5 py-1 rounded bg-[#6B2D84]/20 border border-[#6B2D84]/40">
                  Grau II &bull; Raro Superior
                </span>
                <h2 className="text-2xl font-gothic font-black text-[#C8B99E] mt-2.5 group-hover:text-[#c77dff] transition-colors">
                  Pacote Avançado
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70] mt-1">
                  Urna lacrada de alto custo com probabilidades ampliadas para cartas raras: <strong className="text-[#D8B4FE]">10% Épica</strong> e <strong className="text-[#FACC15]">2% Lendária</strong>.
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#09080B] border border-[#6B2D84]/40 group-hover:scale-105 transition-transform shrink-0">
                <EldritchUrn />
              </div>
            </div>

            {/* Tabela de Probabilidades do Pacote Avançado */}
            <div className="mt-5 space-y-1.5 text-xs">
              <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#D8B4FE] block mb-1">
                Chances por Carta (Pacote Avançado):
              </span>
              <div className="grid grid-cols-5 gap-1 text-center font-numbers font-bold text-[10px]">
                <div className="p-1.5 rounded bg-[#09080B] text-[#9E8C70] border border-[#26232C]">
                  Comum
                  <span className="block text-[10px] text-[#E2E8F0] font-black">35%</span>
                </div>
                <div className="p-1.5 rounded bg-[#2E8B78]/20 text-[#6EE7B7] border border-[#2E8B78]/40">
                  Incomum
                  <span className="block text-[10px] text-[#6EE7B7] font-black">30%</span>
                </div>
                <div className="p-1.5 rounded bg-[#0284c7]/20 text-[#38bdf8] border border-[#0284c7]/40">
                  Rara
                  <span className="block text-[10px] text-[#38bdf8] font-black">23%</span>
                </div>
                <div className="p-1.5 rounded bg-[#6B2D84]/35 text-[#E9D5FF] border border-[#A855F7]">
                  Épica
                  <span className="block text-[11px] text-[#E9D5FF] font-black">10%</span>
                </div>
                <div className="p-1.5 rounded bg-[#D97724]/30 text-[#FEF08A] border border-[#F59E0B]">
                  Lendária
                  <span className="block text-[11px] text-[#FEF08A] font-black">2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#26232C] flex items-center justify-between gap-3">
            {advancedPacks > 0 ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-gothic uppercase tracking-wider text-[#D8B4FE]">
                  Pacotes em Posse:
                </span>
                <span className="text-base font-numbers font-black text-[#E9D5FF]">
                  🎁 {advancedPacks}x Grátis
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-[#D97724] fill-[#D97724]" />
                <span className="text-xl font-numbers font-black text-[#F29F3D]">
                  {PACK_PRICES.ADVANCED}
                </span>
                <span className="text-xs font-gothic uppercase font-bold text-[#9E8C70]">
                  Ouro
                </span>
              </div>
            )}

            <button
              onClick={() => handleBuyPack("ADVANCED")}
              disabled={
                isPending || (advancedPacks <= 0 && gold < PACK_PRICES.ADVANCED)
              }
              className="btn-iron flex items-center gap-2 px-5 py-2.5 rounded-xl font-gothic font-black text-xs tracking-wide text-[#c77dff] hover:text-white border-[#6B2D84] disabled:opacity-40 cursor-pointer"
            >
              <span>
                {isPending
                  ? "Abrindo..."
                  : advancedPacks > 0
                  ? `Abrir Avançado (${advancedPacks}x)`
                  : "Comprar Avançado"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. PACOTE SUPREMO (Especial | Não comprável com Ouro | 90% Épica e 10% Lendária) */}
        <div className="group relative rounded-2xl border-2 border-[#D49B27] bg-gradient-to-b from-[#23120B] via-[#150C1C] to-[#0E0912] p-6 flex flex-col justify-between shadow-[0_0_35px_rgba(212,155,39,0.22)] hover:shadow-[0_0_45px_rgba(212,155,39,0.45)] transition-all duration-300">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-gothic font-black uppercase tracking-wider text-[#09080B] px-2.5 py-1 rounded bg-gradient-to-r from-[#FACC15] to-[#F59E0B] border border-[#FEF08A]">
                  <Crown className="w-3 h-3" /> Grau III &bull; Relíquia Especial
                </span>
                <h2 className="text-2xl font-gothic font-black text-[#FEF08A] mt-2.5">
                  Pacote Supremo
                </h2>
                <p className="font-parchment text-sm text-[#E2E8F0]/90 mt-1">
                  Obtido exclusivamente em conquistas especiais e vitórias da Campanha. <strong className="text-[#FCA5A5]">Não pode ser comprado com Ouro.</strong>
                </p>
              </div>

              <div className="p-2 rounded-xl bg-[#09080B] border border-[#D49B27]/60 group-hover:scale-105 transition-transform shrink-0">
                <SupremeAstralReliquary />
              </div>
            </div>

            {/* Tabela de Probabilidades do Pacote Supremo (90% Épica / 10% Lendária) */}
            <div className="mt-5 space-y-2 text-xs">
              <span className="text-[10px] font-gothic font-bold uppercase tracking-wider text-[#FEF08A] block">
                Chances Exclusivas (100% Épica ou Lendária):
              </span>
              <div className="grid grid-cols-2 gap-2 text-center font-numbers font-bold">
                <div className="p-2.5 rounded-xl bg-[#3B0764]/60 text-[#E9D5FF] border-2 border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.35)]">
                  <span className="text-[11px] uppercase tracking-wider block">
                    Carta Épica
                  </span>
                  <span className="block text-xl text-[#E9D5FF] font-black mt-0.5">
                    90%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#451A03]/70 text-[#FEF08A] border-2 border-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                  <span className="text-[11px] uppercase tracking-wider block">
                    Carta Lendária
                  </span>
                  <span className="block text-xl text-[#FEF08A] font-black mt-0.5">
                    10%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#D49B27]/35 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-gothic uppercase tracking-wider text-[#D8B4FE] block">
                Em Posse Especial:
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Crown className="w-4 h-4 text-[#FACC15]" />
                <span className="text-lg font-numbers font-black text-[#FEF08A]">
                  {supremePacks}x Disponível
                </span>
              </div>
            </div>

            <button
              onClick={() => handleBuyPack("SUPREME")}
              disabled={isPending || supremePacks <= 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-gothic font-black text-xs tracking-wide border-2 transition-all ${
                supremePacks > 0
                  ? "bg-gradient-to-r from-[#D97724] via-[#F59E0B] to-[#EAB308] text-[#09080B] border-[#FEF08A] shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:brightness-110 cursor-pointer"
                  : "bg-[#18181B] text-[#71717A] border-[#27272A] opacity-60 cursor-not-allowed"
              }`}
            >
              {supremePacks > 0 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isPending ? "Abrindo..." : "Abrir Supremo"}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Apenas Especial</span>
                </>
              )}
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
                  {lastPackType === "SUPREME"
                    ? "O Relicário do Pacote Supremo foi Despertado!"
                    : lastPackType === "ADVANCED"
                    ? "A Urna do Pacote Avançado foi Rompida!"
                    : "O Baú do Pacote Básico foi Aberto!"}
                </h2>
                <p className="font-parchment text-sm text-[#9E8C70]">
                  {allRevealed
                    ? "Todas as lâminas e cópias foram adicionadas à sua coleção."
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
            <div className="flex items-center gap-4 text-xs font-numbers text-[#9E8C70]">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#D97724]" />
                <span>
                  Ouro:{" "}
                  <strong className="text-[#F29F3D]">
                    {gold.toLocaleString("pt-BR")}
                  </strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#FACC15]" />
                <span>
                  Pacotes Supremos:{" "}
                  <strong className="text-[#FEF08A]">{supremePacks}x</strong>
                </span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBuyPack(lastPackType)}
                disabled={isPending || !canRepeatLastPack}
                className="btn-iron-torch flex items-center gap-2 px-5 py-2.5 rounded-lg font-gothic font-black text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {lastPackType === "SUPREME"
                    ? `Abrir Outro Supremo (${supremePacks}x rest.)`
                    : lastPackType === "BASIC" && basicPacks > 0
                    ? `Abrir Outro Básico Grátis (${basicPacks}x rest.)`
                    : lastPackType === "ADVANCED" && advancedPacks > 0
                    ? `Abrir Outro Avançado Grátis (${advancedPacks}x rest.)`
                    : `Abrir Outro (${PACK_PRICES[lastPackType]} Ouro)`}
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
