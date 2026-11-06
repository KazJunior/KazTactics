import { db } from "@/db";
import { cards, users, campaignStages, decks, deckCards } from "@/db/schema";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { CardComponent } from "@/components/cards/CardComponent";
import {
  Shield,
  Zap,
  Swords,
  Footprints,
  Crosshair,
  Sparkles,
  Coins,
  MapPin,
  Layers,
  ShoppingBag,
  ArrowRight,
  Play,
  Flame,
  Info,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user = null;
  let allCards: (typeof cards.$inferSelect)[] = [];
  let stages: (typeof campaignStages.$inferSelect)[] = [];
  let activeDeckInfo = null;

  try {
    const [fetchedCards, fetchedUsers, fetchedStages, fetchedDecks] =
      await Promise.all([
        db.select().from(cards),
        db.select().from(users).limit(1),
        db.select().from(campaignStages),
        db.select().from(decks).where(eq(decks.isActive, true)).limit(1),
      ]);

    allCards = fetchedCards;
    user = fetchedUsers[0] || null;
    stages = fetchedStages;

    if (fetchedDecks[0]) {
      const d = fetchedDecks[0];
      const dCards = await db
        .select({
          card: cards,
          quantity: deckCards.quantity,
        })
        .from(deckCards)
        .innerJoin(cards, eq(deckCards.cardId, cards.id))
        .where(eq(deckCards.deckId, d.id));

      const total = dCards.reduce((acc, c) => acc + c.quantity, 0);
      const monsters = dCards
        .filter((c) => c.card.category === "MONSTRO")
        .reduce((acc, c) => acc + c.quantity, 0);
      const spells = dCards
        .filter((c) => c.card.category === "FEITICO")
        .reduce((acc, c) => acc + c.quantity, 0);

      activeDeckInfo = {
        name: d.name,
        total,
        monsters,
        spells,
        isValid: total === 30 && monsters === 20 && spells === 10,
      };
    }
  } catch (error) {
    console.error("Erro ao carregar dados do Hub:", error);
  }

  const currentStageNumber = user?.currentStage ?? 1;

  return (
    <div className="min-h-screen text-[#F8FAFC]">
      <Navbar
        gold={user?.gold ?? 500}
        username={user?.username ?? "EstrategistaKaz"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* ======================================================== */}
        {/* HERO: BOAS-VINDAS & PAINEL DE CONTROLE DO COMANDANTE */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-2xl border border-[#F59E0B]/30 bg-[#252147]/85 backdrop-blur-md p-6 md:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/10 via-transparent to-[#38BDF8]/15 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#181433] border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" /> Santuário Celeste &middot; KazTactics High Fantasy
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight leading-tight">
                Estratégia Tática &middot; Grimório Arcana &middot; Combate JRPG
              </h1>
              <p className="text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Comande suas legiões heroicas no tabuleiro tático 11x7, canalize o relicário de
                Mana Celeste (até 15), domine a Linha de Visão contra Arremessos e purgue
                os Cristais Nexus corrompidos na Campanha.
              </p>
            </div>

            {/* Ação Imediata: Jogar Próxima Batalha */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                href={`/battle?stage=${currentStageNumber}`}
                className="btn-iron-torch flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black text-sm tracking-wide cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Batalhar &middot; Fase {currentStageNumber}</span>
              </Link>

              <Link
                href="/campaign"
                className="btn-iron flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                <span>Mapa de Expedições ({stages.length} Fases)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* OS 4 PILARES DO JOGO: HUB PRINCIPAL */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F59E0B]" />
              <span>Painel Central de Comando</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Campanha PvE */}
            <Link
              href="/campaign"
              className="group relative p-6 rounded-xl border border-white/10 bg-[#252147]/80 hover:border-[#38BDF8] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-lg bg-[#181433] border border-[#38BDF8]/50 text-[#38BDF8] w-fit group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#F8FAFC] mt-4 group-hover:text-[#38BDF8] transition-colors">
                  Campanha PvE
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  5 Fases progressivas com Cristais Nexus corrompidos e recompensas em Ouro.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-[#38BDF8]">
                  Santuário {currentStageNumber}
                </span>
                <ArrowRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Meu Baralho (Deckbuilder) */}
            <Link
              href="/deckbuilder"
              className="group relative p-6 rounded-xl border border-white/10 bg-[#252147]/80 hover:border-[#F59E0B] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-lg bg-[#181433] border border-[#F59E0B]/50 text-[#F59E0B] w-fit group-hover:scale-110 transition-transform">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#F8FAFC] mt-4 group-hover:text-[#F59E0B] transition-colors">
                  Meu Baralho
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Forje seu grimório com exatamente 30 cartas (20 Monstros / 10 Feitiços).
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span
                  className={`font-numbers font-bold ${
                    activeDeckInfo?.isValid ? "text-[#34D399]" : "text-[#F59E0B]"
                  }`}
                >
                  {activeDeckInfo
                    ? `${activeDeckInfo.monsters}M / ${activeDeckInfo.spells}F (30/30)`
                    : "Configurar Grimório"}
                </span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Loja de Pacotes (Gacha) */}
            <Link
              href="/shop"
              className="group relative p-6 rounded-xl border border-white/10 bg-[#252147]/80 hover:border-[#A855F7] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-lg bg-[#181433] border border-[#A855F7]/50 text-[#C084FC] w-fit group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#F8FAFC] mt-4 group-hover:text-[#C084FC] transition-colors">
                  Tenda do Antiquário
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Abra boosters de 5 cartas raras com probabilidades ponderadas.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-numbers font-bold text-[#F59E0B] flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-[#F59E0B]" />
                  {user?.gold ?? 500} Ouro
                </span>
                <ArrowRight className="w-4 h-4 text-[#C084FC] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Campo de Batalha (Tabuleiro) */}
            <Link
              href={`/battle?stage=${currentStageNumber}`}
              className="group relative p-6 rounded-xl border border-white/10 bg-[#252147]/80 hover:border-[#F59E0B] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-lg bg-[#181433] border border-[#F59E0B]/50 text-[#F59E0B] w-fit group-hover:scale-110 transition-transform">
                  <Crosshair className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#F8FAFC] mt-4 group-hover:text-[#F59E0B] transition-colors">
                  Arena Santuário
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Grid tático com cálculo de colisão, trajetória balística e destruição de Nexus.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-[#F59E0B]">Entrar em Batalha</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* ======================================================== */}
        {/* GUIA TÁTICO: OS 8 TIPOS & LINE OF SIGHT VS ARREMESSO */}
        {/* ======================================================== */}
        <section className="space-y-6 p-6 md:p-8 rounded-2xl bg-[#252147]/85 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Manual de Táticas & Trajetórias
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Linha de Visão vs Arremesso */}
            <div className="p-5 rounded-xl bg-[#181433] border border-white/10 space-y-3">
              <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                <span>Trajetórias de Ataque (Mecânica Central)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#252147]/60 border border-white/10 flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-[#181433] border border-[#38bdf8]/40 text-[#38bdf8] shrink-0">
                    🎯
                  </div>
                  <div>
                    <strong className="text-[#38bdf8] block text-xs">
                      LINE_OF_SIGHT (Linha de Visão Direta)
                    </strong>
                    <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">
                      O projétil viaja em linha reta rente ao chão. É <strong>bloqueado por pilares (`OBSTACLE`)</strong> e por <strong>qualquer outra unidade</strong> intermediária no caminho.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#252147]/60 border border-white/10 flex items-start gap-2.5">
                  <div className="p-1.5 rounded bg-[#181433] border border-[#F59E0B]/40 text-[#F59E0B] shrink-0">
                    🏹
                  </div>
                  <div>
                    <strong className="text-[#F59E0B] block text-xs">
                      ARREMESSO (Ataque em Arco Parabólico)
                    </strong>
                    <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">
                      O ataque é desferido em arco por cima de qualquer barricada. <strong>Ignora muralhas e criaturas intermediárias</strong>, permitindo alvejar monstros abrigados atrás de obstáculos!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Os 8 Tipos de Cartas */}
            <div className="p-5 rounded-xl bg-[#181433] border border-white/10 space-y-3">
              <h3 className="font-bold text-base text-[#F8FAFC]">
                Os 8 Tipos de Cartas & Suas Doutrinas
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#34D399] block font-bold">Artrópodes</strong>
                  <span className="text-xs text-slate-300">Carapaça grossa e resistência frontal.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#F59E0B] block font-bold">Bestiais</strong>
                  <span className="text-xs text-slate-300">Alta mobilidade (até 4 casas) para flanquear.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-slate-300 block font-bold">Mortos-Vivos</strong>
                  <span className="text-xs text-slate-300">Arqueiros esqueléticos e guerreiros necróticos.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#38bdf8] block font-bold">Espíritos</strong>
                  <span className="text-xs text-slate-300">Arremessos etéreos que ignoram barreiras físicas.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#60a5fa] block font-bold">Humanóides</strong>
                  <span className="text-xs text-slate-300">Escudos de proteção e equilíbrio tático.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#fb923c] block font-bold">Mecânicos</strong>
                  <span className="text-xs text-slate-300">Artilharia de longo alcance e catapultas.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-white/10">
                  <strong className="text-[#F59E0B] block font-bold">Mitológicos</strong>
                  <span className="text-xs text-slate-300">Lendários com dano aniquilador em combate.</span>
                </div>
                <div className="p-2 rounded bg-[#252147]/60 border border-[#A855F7]/40">
                  <strong className="text-[#C084FC] block font-bold">Feitiços</strong>
                  <span className="text-xs text-slate-300">Conjuráveis a qualquer instante sem gastar turno!</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CATÁLOGO GERAL DE CARTAS */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F59E0B]" />
              <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                Compêndio Geral de Cartas & Relíquias ({allCards.length})
              </h2>
            </div>
            <Link
              href="/deckbuilder"
              className="text-xs text-[#F59E0B] hover:text-[#FBBF24] font-bold flex items-center gap-1"
            >
              <span>Forjar Grimório</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {allCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                size="md"
                interactive={true}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
