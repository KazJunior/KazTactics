"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/db/schema";
import { completeOrSkipTutorialAction } from "@/actions/tutorial";
import { CutoutMonsterSprite } from "@/components/battle/CutoutMonsterSprite";
import { AbyssalManaDiamond, CardComponent } from "@/components/cards/CardComponent";
import { getCreatureAbility } from "@/lib/abilities";
import {
  RustIronChest,
  EldritchUrn,
  SupremeAstralReliquary,
} from "@/components/shop/AntiquarianRelics";
import {
  Sparkles,
  FastForward,
  CheckCircle2,
  Swords,
  Footprints,
  Zap,
  Shield,
  Crown,
  ArrowRight,
  Lock,
  ShoppingBag,
  Home,
  HelpCircle,
  Trophy,
  Flame,
} from "lucide-react";

interface TutorialBattleViewProps {
  username: string;
  isAlreadyCompleted: boolean;
  sampleCards: Card[];
}

type TutorialStep = 1 | 2 | 3 | 4 | 5;

export function TutorialBattleView({
  username,
  isAlreadyCompleted,
  sampleCards,
}: TutorialBattleViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Controle de etapa do tutorial (1 a 5)
  const [step, setStep] = useState<TutorialStep>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado simulado interativo do Tabuleiro de Treinamento
  const [mana, setMana] = useState<number>(6);
  const [selectedHandCard, setSelectedHandCard] = useState<Card | null>(null);
  const [summonedUnit, setSummonedUnit] = useState<{
    card: Card;
    x: number;
    y: number;
    actionsRemaining: number;
    abilityCooldown: number;
  } | null>(null);
  const [isAimingAbility, setIsAimingAbility] = useState<boolean>(false);
  const [dummyHp, setDummyHp] = useState<number>(80);
  const [enemyCoreHp, setEnemyCoreHp] = useState<number>(60);
  const [actionLog, setActionLog] = useState<string>(
    "Bem-vindo ao Campo de Instrução Tática! Siga os passos abaixo ou pule o tutorial a qualquer momento."
  );

  // Modal de Recompensa Final (10 Pacotes: 6 Básicos, 3 Avançados e 1 Supremo)
  const [rewardModal, setRewardModal] = useState<{
    mode: "COMPLETED" | "SKIPPED";
    basic: number;
    advanced: number;
    supreme: number;
    total: number;
  } | null>(null);

  // Carta principal de demonstração para o tutorial
  const tutorialMonster: Card =
    sampleCards.find((c) => c.name === "Lobo Cinzento Caçador") ||
    sampleCards.find((c) => c.category === "MONSTRO") || {
      id: "tut_wolf",
      name: "Lobo Cinzento Caçador",
      description: "Predador veloz das florestas sombrias.",
      rarity: "COMUM",
      category: "MONSTRO",
      type: "BESTIAIS",
      manaCost: 2,
      hp: 80,
      damage: 35,
      movementTiles: 3,
      rangeTiles: 1,
      attackType: "LINE_OF_SIGHT",
      spellEffectJson: null,
      spriteUrl: "/sprites/wolf.svg",
      createdAt: new Date(),
    };

  const tutorialAbility = getCreatureAbility(
    tutorialMonster.name,
    tutorialMonster.type
  ) || {
    name: "Bote Predatório",
    description: "Salta para uma casa adjacente ao inimigo e desfere uma mordida feroz.",
    cooldown: 2,
    range: 2,
    targetType: "ENEMY" as const,
    effectType: "DASH_JUMP" as const,
    power: 35,
  };

  // Finalizar ou Pular Tutorial -> Concede 6 Básicos, 3 Avançados e 1 Supremo
  const handleFinishOrSkip = (mode: "COMPLETED" | "SKIPPED") => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await completeOrSkipTutorialAction(mode);
      if (res.success && res.grantedPacks) {
        setRewardModal({
          mode,
          basic: res.grantedPacks.basic,
          advanced: res.grantedPacks.advanced,
          supreme: res.grantedPacks.supreme,
          total: res.grantedPacks.total,
        });
      } else {
        setErrorMessage(
          res.error || "Este tutorial já foi finalizado nesta conta."
        );
      }
    });
  };

  // Se a conta NÃO for nova ou já tiver concluído/pulado o tutorial
  if (isAlreadyCompleted && !rewardModal) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 rounded-2xl border-2 border-[#4C3F78] bg-[#161229]/95 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#252147] border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B]">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-gothic font-bold uppercase tracking-widest text-[#C084FC] px-3 py-1 rounded-full bg-[#2E1065] border border-[#A855F7]/40">
            Exclusivo para Contas Novas (Uso Único)
          </span>
          <h1 className="text-2xl md:text-3xl font-gothic font-black text-white mt-2">
            Tutorial Tático Já Concluído
          </h1>
          <p className="font-parchment text-base text-[#CBD5E1] max-w-xl mx-auto">
            Comandante <strong>{username}</strong>, o Tutorial de Instrução só pode ser jogado <strong>uma única vez</strong> e apenas por <strong>contas recém-criadas</strong>. Suas recompensas iniciais já foram registradas!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="btn-iron-torch flex items-center gap-2 px-6 py-3 rounded-xl font-gothic font-black text-xs tracking-wide"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ir para a Tenda do Antiquário (Pacotes)</span>
          </Link>
          <Link
            href="/"
            className="btn-iron flex items-center gap-2 px-6 py-3 rounded-xl font-gothic font-bold text-xs text-white"
          >
            <Home className="w-4 h-4 text-[#38BDF8]" />
            <span>Voltar ao Santuário</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ======================================================== */}
      {/* TOPO: TÍTULO DO TUTORIAL + BOTÃO DE PULAR A QUALQUER HORA */}
      {/* ======================================================== */}
      <div className="rounded-2xl border-2 border-[#F59E0B]/50 bg-gradient-to-r from-[#1A1433] via-[#120E24] to-[#1A1433] p-5 md:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#2E1065] border border-[#C084FC]/50 text-[#E9D5FF] text-[11px] font-gothic font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" /> Instrução Única de Novo Comandante &bull; Passo {step} de 5
          </div>
          <h1 className="text-2xl md:text-3xl font-gothic font-black text-white">
            Tutorial Tático de Batalha — {username}
          </h1>
          <p className="font-parchment text-sm text-[#CBD5E1]">
            Aprenda a invocar criaturas, usar suas 2 ações por turno, ativar habilidades, gerenciar limites de Mana/Monstros e destruir o Núcleo Inimigo.{" "}
            <strong className="text-[#FACC15]">
              Recompensa ao concluir ou pular: 10 Pacotes (6 Básicos, 3 Avançados e 1 Supremo)!
            </strong>
          </p>
        </div>

        {/* Botão de Pular Tutorial imediatamente */}
        <button
          type="button"
          onClick={() => handleFinishOrSkip("SKIPPED")}
          disabled={isPending}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] border-2 border-[#FACC15]/70 text-[#FEF08A] font-gothic font-bold text-xs tracking-wide transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <FastForward className="w-4 h-4 text-[#FACC15]" />
          <span>
            {isPending ? "Processando..." : "Pular Tutorial e Receber 10 Pacotes"}
          </span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#7F1D1D]/40 border border-[#EF4444] text-sm text-[#FECACA] font-parchment">
          {errorMessage}
        </div>
      )}

      {/* ======================================================== */}
      {/* BARRA DE PROGRESSO DAS 5 LIÇÕES DO TUTORIAL              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { num: 1, title: "1. Mana & Limite (4)", icon: Shield },
          { num: 2, title: "2. Invocar Criatura", icon: Sparkles },
          { num: 3, title: "3. Duas Ações/Turno", icon: Footprints },
          { num: 4, title: "4. Habilidade Única", icon: Zap },
          { num: 5, title: "5. Como Vencer", icon: Crown },
        ].map((item) => {
          const Icon = item.icon;
          const isCurrent = step === item.num;
          const isDone = step > item.num;
          return (
            <div
              key={item.num}
              className={`p-3 rounded-xl border-2 flex items-center gap-2 text-xs font-gothic font-bold transition-all ${
                isCurrent
                  ? "bg-[#2E1065] border-[#FACC15] text-[#FEF08A] shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                  : isDone
                  ? "bg-[#064E3B]/50 border-[#10B981] text-[#6EE7B7]"
                  : "bg-[#12101B] border-[#27272A] text-[#64748B]"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
              ) : (
                <Icon className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{item.title}</span>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* ÁREA INTERATIVA DE ENSINO PASSO A PASSO                  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA ESQUERDA (5 cols): INSTRUTOR TÁTICO E EXPLICAÇÃO DA ETAPA */}
        <div className="lg:col-span-5 rounded-2xl border-2 border-[#A855F7]/60 bg-[#130F24]/95 p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="p-2.5 rounded-xl bg-[#2E1065] border border-[#C084FC] text-[#FACC15]">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-gothic uppercase tracking-wider text-[#C084FC] block">
                Mestre de Armas do Santuário
              </span>
              <h2 className="text-lg font-gothic font-black text-white">
                {step === 1 && "Lição 1: Limites de Mana e de Monstros"}
                {step === 2 && "Lição 2: Como Invocar Criaturas"}
                {step === 3 && "Lição 3: 2 Ações por Rodada (Mover / Atacar)"}
                {step === 4 && "Lição 4: Habilidades Únicas & Recarga"}
                {step === 5 && "Lição 5: Como Vencer a Batalha"}
              </h2>
            </div>
          </div>

          {/* Conteúdo explicativo de cada lição */}
          {step === 1 && (
            <div className="space-y-3 text-sm font-parchment text-[#E2E8F0] leading-relaxed">
              <p>
                Antes de posicionar suas tropas no tabuleiro, todo Comandante precisa dominar as <strong>duas regras de recursos</strong>:
              </p>
              <div className="p-3.5 rounded-xl bg-[#1E1B4B]/70 border border-[#38BDF8]/50 space-y-1.5">
                <div className="font-gothic font-bold text-xs text-[#38BDF8] flex items-center gap-1.5">
                  <span>💎 1. Reserva e Limite de Mana (Máx. 15)</span>
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  Você inicia a batalha com <strong>6 de Mana</strong>. A cada novo turno, você recebe <strong>+3 de Mana</strong>, podendo acumular até o <strong>limite máximo de 15 de Mana</strong>. Toda carta possui seu custo em Mana no diamante azul.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#3B0764]/50 border border-[#C084FC]/50 space-y-1.5">
                <div className="font-gothic font-bold text-xs text-[#E9D5FF] flex items-center gap-1.5">
                  <span>🛡️ 2. Limite de Monstros em Campo (Máx. 4)</span>
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  Cada jogador pode controlar no máximo <strong>4 criaturas simultaneamente</strong> no tabuleiro. Se você já tiver 4 monstros vivos, só poderá invocar outro quando uma vaga for aberta!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setActionLog(
                    "Passo 2: Clique na carta do Lobo Cinzento abaixo e depois clique na casa azul de Spawn Aliado!"
                  );
                }}
                className="w-full btn-iron-torch py-3 rounded-xl font-gothic font-black text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Entendi! Avançar para Invocação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 text-sm font-parchment text-[#E2E8F0] leading-relaxed">
              <p>
                Para <strong>invocar uma criatura</strong> da sua mão para o campo de batalha:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#CBD5E1] bg-[#09090B]/70 p-3.5 rounded-xl border border-white/10">
                <li>
                  Clique na carta de Monstro <strong>&ldquo;{tutorialMonster.name}&rdquo;</strong> (Custo: <strong>{tutorialMonster.manaCost} Mana</strong>) abaixo.
                </li>
                <li>
                  As casas azuis (<strong>PLAYER_SPAWN</strong>) próximas ao seu Núcleo Aliado acenderão.
                </li>
                <li>
                  Clique na <strong>Casa de Invocação Azul</strong> no simulador ao lado para invocar a criatura!
                </li>
              </ol>

              <div className="flex flex-col items-center pt-2">
                <div
                  onClick={() => {
                    setSelectedHandCard(tutorialMonster);
                    setActionLog(
                      `Carta "${tutorialMonster.name}" selecionada! Agora clique na casa azul "SPAWN ALIADO" no tabuleiro ao lado.`
                    );
                  }}
                  className={`cursor-pointer transition-all rounded-xl p-1 ${
                    selectedHandCard
                      ? "ring-4 ring-[#38BDF8] scale-105 shadow-[0_0_25px_rgba(56,189,248,0.6)]"
                      : "hover:scale-105"
                  }`}
                >
                  <CardComponent card={tutorialMonster} size="sm" />
                </div>
                <span className="text-[11px] font-gothic font-bold text-[#38BDF8] mt-2 animate-pulse">
                  {selectedHandCard
                    ? "✓ Carta selecionada! Agora clique na Casa Azul no tabuleiro ao lado →"
                    : "👆 1º Clique nesta carta para selecioná-la"}
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-sm font-parchment text-[#E2E8F0] leading-relaxed">
              <p>
                Excelente! Sua criatura está em campo. Agora aprenda sobre o <strong>Sistema de 2 Ações por Rodada</strong>:
              </p>
              <div className="p-3.5 rounded-xl bg-[#064E3B]/40 border border-[#34D399]/50 space-y-1.5 text-xs text-[#CBD5E1]">
                <p className="font-gothic font-bold text-[#6EE7B7]">
                  ⚡ 2 Ações por Turno (Pode repetir a mesma ação!)
                </p>
                <p>
                  Cada criatura possui <strong>2 Pontos de Ação por rodada (2/2)</strong> representados pelas duas esferas brilhantes nos pés dela.
                </p>
                <p>
                  As ações disponíveis são: <strong>Movimentar</strong>, <strong>Atacar</strong> ou <strong>Usar Habilidade</strong>. Você pode realizar <strong>a mesma ação duas vezes no mesmo turno</strong> (ex: Mover + Mover, ou Atacar + Atacar)!
                </p>
              </div>
              <p className="text-xs text-[#FACC15] font-gothic font-bold">
                👉 No simulador ao lado, use 1 ação para Avançar ou Atacar o Boneco de Treino Inimigo!
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm font-parchment text-[#E2E8F0] leading-relaxed">
              <p>
                Toda criatura possui uma <strong>Habilidade Ativa Única</strong> com efeitos táticos especiais:
              </p>
              <div className="p-3.5 rounded-xl bg-[#3B0764]/60 border border-[#C084FC] space-y-1 text-xs">
                <div className="flex items-center justify-between font-gothic font-bold text-[#FACC15]">
                  <span>⚡ {tutorialAbility.name}</span>
                  <span className="text-[#E9D5FF]">
                    Recarga: {tutorialAbility.cooldown} Turnos
                  </span>
                </div>
                <p className="text-[#E2E8F0]">{tutorialAbility.description}</p>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Usar uma habilidade consome <strong>1 Ação</strong> da criatura e entra em <strong>Tempo de Recarga (Cooldown)</strong> por alguns turnos.
              </p>
              <p className="text-xs text-[#FACC15] font-gothic font-bold">
                👉 Clique no botão roxo &ldquo;Usar {tutorialAbility.name}&rdquo; no painel ao lado para testar sua Habilidade Única!
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3 text-sm font-parchment text-[#E2E8F0] leading-relaxed">
              <p>
                Por fim, aprenda <strong>Como Vencer uma Partida</strong> em KazTactics:
              </p>
              <div className="p-3.5 rounded-xl bg-[#451A03]/60 border border-[#F59E0B] space-y-2 text-xs text-[#FEF08A]">
                <p className="font-gothic font-bold text-sm flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#FACC15]" /> Objetivo Principal: Destruir o Núcleo Inimigo
                </p>
                <p className="text-[#E2E8F0]">
                  Na extremidade direita do tabuleiro fica o <strong>Núcleo Inimigo (Cristal Nexus)</strong>, enquanto na esquerda fica o seu <strong>Núcleo Aliado</strong>.
                </p>
                <p className="text-[#E2E8F0]">
                  Você vence imediatamente ao <strong>reduzir o HP do Núcleo Inimigo a 0</strong> com ataques ou feitiços, ou ao eliminar todas as unidades inimigas quando o adversário não tiver mais cartas!
                </p>
              </div>
              <p className="text-xs text-[#4ADE80] font-gothic font-bold">
                👉 Desfira o Golpe Final no Núcleo Inimigo no painel ao lado para concluir o Tutorial e receber seus 10 Pacotes!
              </p>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA (7 cols): ARENA INTERATIVA DE TREINAMENTO */}
        <div className="lg:col-span-7 rounded-2xl border-2 border-[#38BDF8]/40 bg-[#0D0B18]/95 p-6 space-y-5 shadow-2xl">
          {/* HUD Superior do Simulador */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <AbyssalManaDiamond cost={mana} size="md" />
              <div>
                <span className="text-xs font-gothic font-bold text-white block">
                  Reserva de Mana: {mana} / 15
                </span>
                <span className="text-[11px] font-numbers text-[#38BDF8]">
                  +3 de Mana por rodada (Máx. 15)
                </span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-[#181433] border border-[#C084FC]/40 text-xs font-numbers font-bold text-[#E9D5FF]">
              Monstros em Campo: {summonedUnit ? 1 : 0} / 4 (Limite Máximo: 4)
            </div>
          </div>

          {/* Mensagem de instrução ativa */}
          <div className="px-4 py-2.5 rounded-xl bg-[#1E1B4B]/90 border border-[#38BDF8]/50 text-xs font-parchment text-[#F8FAFC] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FACC15] shrink-0" />
            <span>{actionLog}</span>
          </div>

          {/* Mini-Tabuleiro Interativo de 5 Casas em Linha */}
          <div className="grid grid-cols-5 gap-2.5 py-4 px-2 rounded-2xl bg-gradient-to-b from-[#16132B] to-[#090812] border-2 border-[#2D244D]">
            {/* Casa 0: Núcleo Aliado */}
            <div className="h-32 rounded-xl border-2 border-[#38BDF8]/60 bg-[#0C192E]/80 flex flex-col items-center justify-between p-2 text-center">
              <span className="text-[9px] font-gothic font-bold text-[#38BDF8] uppercase">
                Núcleo Aliado
              </span>
              <Shield className="w-8 h-8 text-[#38BDF8]" />
              <span className="text-[10px] font-numbers font-bold text-white bg-[#09090B]/80 px-2 py-0.5 rounded">
                1000 HP
              </span>
            </div>

            {/* Casa 1: PLAYER_SPAWN (Casa de Invocação Azul) */}
            <button
              type="button"
              onClick={() => {
                if (step === 2) {
                  setSummonedUnit({
                    card: tutorialMonster,
                    x: 1,
                    y: 0,
                    actionsRemaining: 2,
                    abilityCooldown: 0,
                  });
                  setMana((m) => Math.max(0, m - tutorialMonster.manaCost));
                  setSelectedHandCard(null);
                  setStep(3);
                  setActionLog(
                    `⚔️ "${tutorialMonster.name}" invocado! Ele possui 2/2 Ações neste turno. Clique nos botões abaixo para Mover ou Atacar!`
                  );
                }
              }}
              className={`h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 transition-all relative ${
                step === 2
                  ? "border-[#38BDF8] bg-[#0284C7]/30 hover:bg-[#0284C7]/45 cursor-pointer animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                  : "border-[#38BDF8]/30 bg-[#0F172A]/60"
              }`}
            >
              <span className="text-[9px] font-gothic font-bold text-[#7DD3FC] uppercase">
                Spawn Aliado
              </span>
              {summonedUnit && summonedUnit.x === 1 ? (
                <div className="w-16 h-16">
                  <CutoutMonsterSprite
                    name={summonedUnit.card.name}
                    type={summonedUnit.card.type}
                    category="MONSTRO"
                  />
                </div>
              ) : (
                <span className="text-[10px] font-gothic font-bold text-[#38BDF8]">
                  {step === 2 ? "👆 Clique para Invocar" : "Zona Spawn"}
                </span>
              )}
              <span className="text-[9px] font-numbers text-[#94A3B8]">
                (1, 4)
              </span>
            </button>

            {/* Casa 2: Campo Central (Posição Avançada) */}
            <div className="h-32 rounded-xl border-2 border-white/15 bg-[#18181B]/70 flex flex-col items-center justify-between p-2">
              <span className="text-[9px] font-gothic font-bold text-[#CBD5E1] uppercase">
                Vanguarda
              </span>
              {summonedUnit && summonedUnit.x === 2 ? (
                <div className="w-16 h-16">
                  <CutoutMonsterSprite
                    name={summonedUnit.card.name}
                    type={summonedUnit.card.type}
                    category="MONSTRO"
                  />
                </div>
              ) : (
                <Footprints className="w-6 h-6 text-white/20" />
              )}
              <span className="text-[9px] font-numbers text-[#94A3B8]">
                (2, 4)
              </span>
            </div>

            {/* Casa 3: Boneco de Treino Inimigo */}
            <div
              className={`h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 ${
                dummyHp > 0
                  ? "border-[#F43F5E]/60 bg-[#3B0A1E]/50"
                  : "border-white/10 bg-[#09090B]/50 opacity-50"
              }`}
            >
              <span className="text-[9px] font-gothic font-bold text-[#FDA4AF] uppercase">
                Alvo Inimigo
              </span>
              {dummyHp > 0 ? (
                <div className="w-14 h-14">
                  <CutoutMonsterSprite
                    name="Arqueiro Esqueleto Maldito"
                    type="MORTOS_VIVOS"
                    category="MONSTRO"
                    isEnemy={true}
                  />
                </div>
              ) : (
                <span className="text-[10px] font-gothic font-bold text-[#4ADE80]">
                  ✓ Derrotado
                </span>
              )}
              <span className="text-[10px] font-numbers font-bold text-[#F43F5E] bg-[#09090B]/80 px-2 py-0.5 rounded">
                {Math.max(0, dummyHp)} HP
              </span>
            </div>

            {/* Casa 4: Núcleo Inimigo (Objetivo Final) */}
            <div
              className={`h-32 rounded-xl border-2 flex flex-col items-center justify-between p-2 ${
                step === 5
                  ? "border-[#FACC15] bg-[#451A03]/70 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                  : "border-[#F43F5E] bg-[#2A0A18]/80"
              }`}
            >
              <span className="text-[9px] font-gothic font-bold text-[#FCA5A5] uppercase">
                Núcleo Inimigo
              </span>
              <Crown className="w-8 h-8 text-[#F43F5E]" />
              <span className="text-[10px] font-numbers font-bold text-[#FEF08A] bg-[#09090B]/85 px-2 py-0.5 rounded">
                {Math.max(0, enemyCoreHp)} HP
              </span>
            </div>
          </div>

          {/* Barra de Comando Interativa da Criatura durante os Passos 3, 4 e 5 */}
          {summonedUnit && (
            <div className="p-4 rounded-xl bg-[#141026] border-2 border-[#A855F7]/70 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-gothic font-bold text-sm text-white">
                    {summonedUnit.card.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#064E3B] border border-[#34D399] text-[10px] font-numbers font-bold text-[#A7F3D0]">
                    ⚡ Ações Restantes: {summonedUnit.actionsRemaining}/2
                  </span>
                </div>
                <p className="text-[11px] font-parchment text-[#CBD5E1]">
                  Você pode realizar 2 ações por turno (inclusive repetir a mesma ação duas vezes).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {step === 3 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSummonedUnit((prev) =>
                          prev
                            ? {
                                ...prev,
                                x: 2,
                                actionsRemaining: Math.max(
                                  0,
                                  prev.actionsRemaining - 1
                                ),
                              }
                            : null
                        );
                        setDummyHp((hp) => Math.max(0, hp - 35));
                        setStep(4);
                        setActionLog(
                          "👟 Sua criatura avançou e atacou! Resta 1/2 ação no turno. Agora teste a Habilidade Única no Passo 4!"
                        );
                      }}
                      className="btn-iron-torch px-4 py-2 rounded-lg font-gothic font-black text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Swords className="w-4 h-4" />
                      <span>Executar Ação (Avançar / Atacar)</span>
                    </button>
                  </>
                )}

                {step === 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAimingAbility(false);
                      setDummyHp(0);
                      setSummonedUnit((prev) =>
                        prev
                          ? {
                              ...prev,
                              actionsRemaining: 2,
                              abilityCooldown: tutorialAbility.cooldown,
                            }
                          : null
                      );
                      setStep(5);
                      setActionLog(
                        `⚡ Habilidade "${tutorialAbility.name}" ativada com sucesso! O alvo inimigo foi eliminado. Agora destrua o Núcleo Inimigo para vencer!`
                      );
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#A855F7] via-[#9333EA] to-[#10B981] text-white font-gothic font-black text-xs border-2 border-[#09090B] shadow-[0_0_16px_rgba(168,85,247,0.85)] flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Zap className="w-4 h-4 text-[#FACC15]" />
                    <span>Usar {tutorialAbility.name}</span>
                  </button>
                )}

                {step === 5 && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setEnemyCoreHp(0);
                      handleFinishOrSkip("COMPLETED");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#10B981] text-[#09090B] font-gothic font-black text-xs border-2 border-[#FEF08A] shadow-[0_0_22px_rgba(250,204,21,0.8)] flex items-center gap-2 cursor-pointer animate-bounce"
                  >
                    <Crown className="w-4 h-4" />
                    <span>
                      💥 Golpe Final no Núcleo Inimigo (Vencer e Resgatar 10 Pacotes!)
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL DE RECOMPENSA: 10 PACOTES (6 BÁSICOS, 3 AVANÇADOS, 1 SUPREMO) */}
      {/* ======================================================== */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-2xl w-full rounded-2xl border-2 border-[#FACC15] bg-gradient-to-b from-[#1E1538] via-[#130D26] to-[#090714] p-6 md:p-8 shadow-[0_0_60px_rgba(250,204,21,0.35)] text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#451A03] border border-[#FACC15] text-[#FEF08A] text-xs font-gothic font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-[#FACC15]" />{" "}
              {rewardModal.mode === "COMPLETED"
                ? "Tutorial Tático Concluído com Honra!"
                : "Tutorial Pulado — Recompensa de Recruta Liberada!"}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-4xl font-gothic font-black text-white">
                Você Recebeu {rewardModal.total} Pacotes de Cartas!
              </h2>
              <p className="font-parchment text-base text-[#CBD5E1] max-w-lg mx-auto">
                Os seguintes pacotes foram adicionados gratuitamente à sua conta e já estão prontos para serem abertos na <strong>Tenda do Antiquário</strong>:
              </p>
            </div>

            {/* Cards dos 3 tipos de pacotes ganhos: 6 Básicos, 3 Avançados e 1 Supremo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* 6 Pacotes Básicos */}
              <div className="p-4 rounded-xl border-2 border-[#D97724]/60 bg-[#121016] flex flex-col items-center space-y-2">
                <div className="scale-90">
                  <RustIronChest />
                </div>
                <span className="text-2xl font-numbers font-black text-[#F29F3D]">
                  {rewardModal.basic}x
                </span>
                <span className="font-gothic font-bold text-sm text-[#C8B99E]">
                  Pacotes Básicos
                </span>
              </div>

              {/* 3 Pacotes Avançados */}
              <div className="p-4 rounded-xl border-2 border-[#A855F7] bg-[#160F24] flex flex-col items-center space-y-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <div className="scale-90">
                  <EldritchUrn />
                </div>
                <span className="text-2xl font-numbers font-black text-[#E9D5FF]">
                  {rewardModal.advanced}x
                </span>
                <span className="font-gothic font-bold text-sm text-[#D8B4FE]">
                  Pacotes Avançados
                </span>
              </div>

              {/* 1 Pacote Supremo */}
              <div className="p-4 rounded-xl border-2 border-[#FACC15] bg-[#23120B] flex flex-col items-center space-y-2 shadow-[0_0_25px_rgba(250,204,21,0.4)]">
                <div className="scale-90">
                  <SupremeAstralReliquary />
                </div>
                <span className="text-2xl font-numbers font-black text-[#FEF08A]">
                  {rewardModal.supreme}x
                </span>
                <span className="font-gothic font-bold text-sm text-[#FEF08A]">
                  Pacote Supremo
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  router.push("/shop");
                  router.refresh();
                }}
                className="w-full sm:w-auto btn-iron-torch px-8 py-4 rounded-xl font-gothic font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Abrir Meus 10 Pacotes na Loja!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

