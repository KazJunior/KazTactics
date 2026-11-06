"use client";

import { useState, useMemo, useEffect } from "react";
import {
  GridTile,
  BoardUnit,
  BoardCore,
  BiomeType,
  MAX_UNIT_ACTIONS_PER_TURN,
} from "@/types/game";
import {
  BIOME_ORDER,
  BIOME_CONFIGS,
  getBiomeForStage,
  getNextBiome,
} from "@/lib/tactics/biomes";
import { BiomeAtmosphereBackdrop } from "./BiomeAtmosphereBackdrop";
import {
  createDefaultGrid,
  getValidMovementTiles,
  getValidAttackTiles,
} from "@/lib/tactics/grid";
import {
  calculateTurnMana,
  canSummonMonster,
  canCastSpell,
  shuffleDeck,
  getValidSpellTargets,
  MAX_MANA,
  MAX_FIELD_UNITS_PER_PLAYER,
} from "@/lib/tactics/gameState";
import { checkGameEndCondition, GameOverState } from "@/lib/tactics/endGame";
import { executeAiTurn } from "@/lib/tactics/aiEngine";
import { FloatingDamage, getEffectiveUnitDamage } from "@/lib/tactics/combat";
import {
  getCreatureAbility,
  getValidAbilityTargetTiles,
  getAbilityImpactZoneTiles,
  executeCreatureAbility,
  processTurnStartAbilitiesAndStatuses,
  AbilityVfxData,
} from "@/lib/abilities";
import { TacticalGrid } from "./TacticalGrid";
import { HandCards } from "./HandCards";
import { AbyssalManaDiamond } from "@/components/cards/CardComponent";
import { CutoutMonsterSprite } from "./CutoutMonsterSprite";
import {
  ProfileAvatarModal,
  AVATAR_STORAGE_KEY,
  AVATAR_CHANGE_EVENT,
  SelectedAvatarInfo,
} from "@/components/ProfileAvatarModal";
import { getPlayerAvatarDataAction } from "@/actions/profile";
import { GameOverModal } from "./GameOverModal";
import { ActionFreezeFrameData } from "./ActionFreezeFrameOverlay";
import { IronCrownSpellBanner } from "./IronCrownSpellBanner";
import { CriticalBannerData } from "./CriticalBannerOverlay";
import { BarkData } from "./GothicBarkBubble";
import { checkLineOfSight } from "@/lib/tactics/combat";
import { Card } from "@/db/schema";
import {
  Shield,
  Swords,
  Footprints,
  Crosshair,
  Crown,
  Sparkles,
  Zap,
  Info,
  RotateCcw,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Skull,
  Bot,
  Brain,
} from "lucide-react";

interface BattlefieldViewProps {
  sampleCards: Card[];
  stageName?: string;
  stageNumber?: number;
  initialAiHp?: number;
  goldReward?: number;
  initialAvatarName?: string;
}

export function BattlefieldView({
  sampleCards,
  stageName = "Bosque dos Primeiros Confrontos",
  stageNumber = 1,
  initialAiHp = 300,
  goldReward = 100,
  initialAvatarName,
}: BattlefieldViewProps) {
  // 0. Foto de Perfil do Jogador (Criatura Desbloqueada) e do Enemy
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [playerAvatar, setPlayerAvatar] = useState<SelectedAvatarInfo>(() => {
    const matched = sampleCards.find(
      (c) => c.name === (initialAvatarName || "Lobo Cinzento Caçador")
    );
    return {
      name: initialAvatarName || "Lobo Cinzento Caçador",
      type: matched?.type || "BESTIAIS",
    };
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) {
          setPlayerAvatar({
            name: parsed.name,
            type: parsed.type || "BESTIAIS",
          });
        }
      }
    } catch {
      // ignore
    }

    getPlayerAvatarDataAction()
      .then((data) => {
        if (data?.avatarCardName) {
          const synced = {
            name: data.avatarCardName,
            type: data.avatarCardType || "BESTIAIS",
          };
          setPlayerAvatar(synced);
          try {
            localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(synced));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});

    const handleAvatarEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SelectedAvatarInfo>;
      if (customEvent.detail?.name) {
        setPlayerAvatar(customEvent.detail);
      }
    };

    window.addEventListener(AVATAR_CHANGE_EVENT, handleAvatarEvent);
    return () => {
      window.removeEventListener(AVATAR_CHANGE_EVENT, handleAvatarEvent);
    };
  }, []);

  // Criatura comandante do Enemy conforme a fase
  const enemyAvatar = useMemo(() => {
    if (stageNumber === 2) {
      return { name: "Arqueiro Esqueleto Maldito", type: "MORTOS_VIVOS" };
    }
    if (stageNumber === 3) {
      return { name: "Colosso de Latão e Vapor", type: "MECANICOS" };
    }
    if (stageNumber === 4) {
      return { name: "Necromante do Sepulcro", type: "MORTOS_VIVOS" };
    }
    if (stageNumber >= 5) {
      return { name: "Dragão Ancestral de Platina", type: "MITOLOGICOS" };
    }
    return { name: "Grifo dos Picos Nevados", type: "MITOLOGICOS" };
  }, [stageNumber]);
  // 1. Grid 15x9 Expandido, Controle de Zoom e Sistema de Biomas de Fantasia 2D
  const [grid] = useState<GridTile[][]>(() => createDefaultGrid());
  const [boardZoom, setBoardZoom] = useState<number>(1.05);
  const [currentBiome, setCurrentBiome] = useState<BiomeType>(() =>
    getBiomeForStage(stageNumber)
  );

  useEffect(() => {
    setCurrentBiome(getBiomeForStage(stageNumber));
  }, [stageNumber]);

  // 2. Núcleos (Posicionamento nas extremidades do tabuleiro 15x9: (0,4) e (14,4))
  const [cores, setCores] = useState<BoardCore[]>([
    {
      owner: "PLAYER",
      name: "Núcleo Aliado",
      x: 0,
      y: 4,
      currentHp: 1000,
      maxHp: 1000,
    },
    {
      owner: "AI",
      name: "Núcleo da IA",
      x: 14,
      y: 4,
      currentHp: initialAiHp,
      maxHp: initialAiHp,
    },
  ]);

  // Função para criar o exército inicial no tabuleiro expandido 15x9
  const generateInitialUnits = (): BoardUnit[] => {
    const list: BoardUnit[] = [];

    const wolf =
      sampleCards.find((c) => c.name === "Lobo Cinzento Caçador") ||
      sampleCards[0];

    const reaper =
      sampleCards.find((c) => c.name === "Banshee Lamuriante") ||
      sampleCards.find((c) => c.name === "Necromante do Sepulcro") ||
      sampleCards[1];

    const catapult =
      sampleCards.find((c) => c.name === "Catapulta a Vapor Blindada") ||
      sampleCards.find((c) => c.name === "Colosso de Latão e Vapor") ||
      sampleCards[2];

    const wisp =
      sampleCards.find((c) => c.name === "Fogo-Fátuo Ilusório") ||
      sampleCards[3];

    const gargoyle =
      sampleCards.find((c) => c.name === "Grifo dos Picos Nevados") ||
      sampleCards.find((c) => c.name === "Minotauro do Labirinto") ||
      sampleCards[4] ||
      wolf;

    const archer =
      sampleCards.find((c) => c.name === "Arqueiro Esqueleto Maldito") ||
      sampleCards[0];

    const magmaGolem =
      sampleCards.find((c) => c.name === "Urso da Tundra Enraivecido") ||
      sampleCards.find((c) => c.name === "Escaravelho Batedor") ||
      sampleCards[1] ||
      catapult;

    // 4 Unidades Aliadas à Esquerda
    if (wolf) {
      list.push({
        id: "player_wolf",
        card: wolf,
        owner: "PLAYER",
        x: 1,
        y: 2,
        currentHp: wolf.hp || 80,
        maxHp: wolf.hp || 80,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (reaper) {
      list.push({
        id: "player_reaper",
        card: reaper,
        owner: "PLAYER",
        x: 2,
        y: 4,
        currentHp: reaper.hp || 85,
        maxHp: reaper.hp || 85,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (catapult) {
      list.push({
        id: "player_catapult",
        card: catapult,
        owner: "PLAYER",
        x: 1,
        y: 6,
        currentHp: catapult.hp || 140,
        maxHp: catapult.hp || 140,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (wisp) {
      list.push({
        id: "player_wisp",
        card: wisp,
        owner: "PLAYER",
        x: 3,
        y: 5,
        currentHp: wisp.hp || 45,
        maxHp: wisp.hp || 45,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    // 3 Unidades Inimigas à Direita no Tabuleiro 15x9
    if (gargoyle) {
      list.push({
        id: "ai_gargoyle",
        card: gargoyle,
        owner: "AI",
        x: 10,
        y: 2,
        currentHp: gargoyle.hp || 110,
        maxHp: gargoyle.hp || 110,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (archer) {
      list.push({
        id: "ai_archer",
        card: archer,
        owner: "AI",
        x: 11,
        y: 3,
        currentHp: archer.hp || 65,
        maxHp: archer.hp || 65,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (magmaGolem) {
      list.push({
        id: "ai_magma",
        card: magmaGolem,
        owner: "AI",
        x: 12,
        y: 5,
        currentHp: magmaGolem.hp || 140,
        maxHp: magmaGolem.hp || 140,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    return list.map((u) => ({
      ...u,
      actionsRemaining: MAX_UNIT_ACTIONS_PER_TURN,
      abilityCooldown: 0,
      usedAbilityThisTurn: false,
      statusEffects: [],
    }));
  };

  // 3. Unidades em Campo
  const [units, setUnits] = useState<BoardUnit[]>(() => generateInitialUnits());

  // 4. Economia de Mana & Turnos do Jogador
  const [currentMana, setCurrentMana] = useState<number>(6);
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [isAiTurn, setIsAiTurn] = useState<boolean>(false);

  // 5. Baralho e Mão do Jogador (Garante as 4 cartas icônicas da imagem na mão inicial)
  const [deck, setDeck] = useState<Card[]>(() => {
    const c1 = sampleCards.find((c) => c.name === "Lobo Cinzento Caçador");
    const c2 =
      sampleCards.find((c) => c.name === "Banshee Lamuriante") ||
      sampleCards.find((c) => c.name === "Necromante do Sepulcro");
    const c3 =
      sampleCards.find((c) => c.name === "Recruta com Escudo Torre") ||
      sampleCards.find((c) => c.name === "Catapulta a Vapor Blindada");
    const c4 = sampleCards.find((c) => c.name === "Fogo-Fátuo Ilusório");

    const showcaseHand = [c1, c2, c3, c4].filter((c): c is Card => Boolean(c));
    const fullDeck: Card[] = [];
    while (fullDeck.length < 26 && sampleCards.length > 0) {
      fullDeck.push(...sampleCards.slice(0, 26 - fullDeck.length));
    }
    return [
      ...showcaseHand,
      ...shuffleDeck(fullDeck.length > 0 ? fullDeck : sampleCards),
    ];
  });

  const [hand, setHand] = useState<Card[]>(() => deck.slice(0, 4));
  const [remainingDeck, setRemainingDeck] = useState<Card[]>(() =>
    deck.slice(4)
  );

  // 6. Baralho, Mão e Mana da IA
  const [aiMana, setAiMana] = useState<number>(5);
  const [aiDeck, setAiDeck] = useState<Card[]>(() => {
    const fullAiDeck: Card[] = [];
    while (fullAiDeck.length < 30 && sampleCards.length > 0) {
      fullAiDeck.push(...sampleCards.slice(0, 30 - fullAiDeck.length));
    }
    return shuffleDeck(fullAiDeck.length > 0 ? fullAiDeck : sampleCards);
  });
  const [aiHand, setAiHand] = useState<Card[]>(() => aiDeck.slice(0, 4));
  const [aiRemainingDeck, setAiRemainingDeck] = useState<Card[]>(() =>
    aiDeck.slice(4)
  );

  // 7. Seleções e Modo de Mira de Habilidade Ativa Única
  const [selectedHandCard, setSelectedHandCard] = useState<Card | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<BoardUnit | null>(null);
  const [isAimingAbility, setIsAimingAbility] = useState<boolean>(false);
  const [hoveredUnit, setHoveredUnit] = useState<BoardUnit | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(
    null
  );

  // 8. Floating Damages & Darkest Dungeon Action FX
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
  const [activeAbilityVfx, setActiveAbilityVfx] =
    useState<AbilityVfxData | null>(null);
  const [hitUnitId, setHitUnitId] = useState<string | null>(null);
  const [dyingUnitId, setDyingUnitId] = useState<string | null>(null);
  const [actionFreezeData, setActionFreezeData] =
    useState<ActionFreezeFrameData | null>(null);
  const [ironCrownSpellName, setIronCrownSpellName] = useState<string | null>(
    null
  );
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [criticalBanner, setCriticalBanner] =
    useState<CriticalBannerData | null>(null);
  const [activeBark, setActiveBark] = useState<BarkData | null>(null);
  const [hasWarnedPlayerCore, setHasWarnedPlayerCore] =
    useState<boolean>(false);
  const [hasWarnedAiCore, setHasWarnedAiCore] = useState<boolean>(false);

  // 9. Mensagem de Feedback
  const [battleMessage, setBattleMessage] = useState<{
    text: string;
    type: "info" | "success" | "warn";
  } | null>({
    text: "Seu turno! Mova suas tropas, ataque à distância ou lance feitiços instantâneos.",
    type: "info",
  });

  // 10. Fim de Jogo
  const [gameOverState, setGameOverState] = useState<GameOverState>({
    isGameOver: false,
  });

  const playerCore = cores.find((c) => c.owner === "PLAYER")!;
  const aiCore = cores.find((c) => c.owner === "AI")!;

  const playerUnits = useMemo(
    () => units.filter((u) => u.owner === "PLAYER"),
    [units]
  );
  const aiUnits = useMemo(() => units.filter((u) => u.owner === "AI"), [units]);

  // Verificação contínua de Fim de Jogo
  useEffect(() => {
    if (gameOverState.isGameOver) return;

    const result = checkGameEndCondition(
      playerCore,
      aiCore,
      playerUnits,
      aiUnits,
      hand,
      remainingDeck,
      turnNumber
    );

    if (result.isGameOver) {
      setGameOverState(result);
    }

    // Gatilho de Barks Sombrios quando o Núcleo cai para < 30% de Vida
    if (playerCore.currentHp / playerCore.maxHp < 0.3 && !hasWarnedPlayerCore) {
      setHasWarnedPlayerCore(true);
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 450);
      setActiveBark({
        id: `bark_core_player_${Date.now()}`,
        speakerName: "Relicário da Pira",
        speakerOwner: "PLAYER",
        text: "A chama sagrada vacila na névoa... O relicário está em ruínas!",
      });
    }

    if (aiCore.currentHp / aiCore.maxHp < 0.3 && !hasWarnedAiCore) {
      setHasWarnedAiCore(true);
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 450);
      setActiveBark({
        id: `bark_core_ai_${Date.now()}`,
        speakerName: "Obelisco Abissal",
        speakerOwner: "AI",
        text: "As raízes cósmicas sangram... A escuridão não conterá este assalto!",
      });
    }
  }, [
    playerCore,
    aiCore,
    playerUnits,
    aiUnits,
    hand,
    remainingDeck,
    turnNumber,
    gameOverState.isGameOver,
  ]);

  // Auto-limpeza de avisos rápidos de batalha para não poluir a tela
  useEffect(() => {
    if (battleMessage?.type === "warn") {
      const timer = setTimeout(() => {
        setBattleMessage(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [battleMessage]);

  const activeUnit = selectedUnit || hoveredUnit;

  const triggerFloatingDamage = (
    x: number,
    y: number,
    damage: number,
    isFatal = false,
    label?: string,
    variant?: "DAMAGE" | "POISON" | "HEAL" | "ABILITY"
  ) => {
    const id = `dmg_${Date.now()}_${Math.random()}`;
    setFloatingDamages((prev) => [
      ...prev,
      { id, x, y, damage, isFatal, label, variant },
    ]);
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1350);
  };

  const triggerAbilityVfx = (vfx: AbilityVfxData) => {
    setActiveAbilityVfx(vfx);
    setTimeout(() => {
      setActiveAbilityVfx((prev) => (prev?.id === vfx.id ? null : prev));
    }, 950);
  };

  // Casas de Spawn válidas para monstro
  const spawnTiles = useMemo(() => {
    if (!selectedHandCard || selectedHandCard.category !== "MONSTRO") return [];

    const valid: { x: number; y: number }[] = [];
    const occupiedCoords = new Set<string>();

    for (const u of units) occupiedCoords.add(`${u.x},${u.y}`);
    for (const c of cores) occupiedCoords.add(`${c.x},${c.y}`);

    for (const row of grid) {
      for (const tile of row) {
        if (
          tile.type === "PLAYER_SPAWN" &&
          !occupiedCoords.has(`${tile.x},${tile.y}`)
        ) {
          valid.push({ x: tile.x, y: tile.y });
        }
      }
    }
    return valid;
  }, [selectedHandCard, units, cores, grid]);

  // Alvos válidos de Feitiço
  const spellTargetTiles = useMemo(() => {
    if (!selectedHandCard || selectedHandCard.category !== "FEITICO") return [];
    return getValidSpellTargets(selectedHandCard, grid, units, cores);
  }, [selectedHandCard, grid, units, cores]);

  // Habilidade ativa única da unidade selecionada
  const selectedUnitAbility = useMemo(() => {
    if (!selectedUnit) return null;
    return getCreatureAbility(selectedUnit.card.name, selectedUnit.card.type);
  }, [selectedUnit]);

  const abilityTiles = useMemo(() => {
    if (
      !isAimingAbility ||
      !selectedUnit ||
      selectedUnit.owner !== "PLAYER" ||
      (selectedUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0 ||
      !selectedUnitAbility ||
      isAiTurn
    ) {
      return [];
    }
    return getValidAbilityTargetTiles(
      selectedUnit,
      selectedUnitAbility,
      grid,
      units
    );
  }, [isAimingAbility, selectedUnit, selectedUnitAbility, grid, units, isAiTurn]);

  // Zona de impacto 3x3 em laranja/vermelho ao passar o mouse sobre um alvo de habilidade em área
  const aoePreviewTiles = useMemo(() => {
    if (
      !isAimingAbility ||
      !selectedUnit ||
      !selectedUnitAbility ||
      isAiTurn
    ) {
      return [];
    }
    const isAreaSkill =
      selectedUnitAbility.effectType === "AOE_DAMAGE" ||
      selectedUnitAbility.targetType === "SELF_AOE" ||
      selectedUnitAbility.targetType === "AREA_TARGET" ||
      (selectedUnitAbility.aoeRadius ?? 0) >= 1;

    if (!isAreaSkill) return [];

    if (selectedUnitAbility.targetType === "SELF_AOE") {
      return getAbilityImpactZoneTiles(
        selectedUnit,
        selectedUnitAbility,
        selectedUnit.x,
        selectedUnit.y,
        grid
      );
    }

    if (!hoveredTile) return [];
    const isHoverValid = abilityTiles.some(
      (t) => t.x === hoveredTile.x && t.y === hoveredTile.y
    );
    if (!isHoverValid) return [];

    return getAbilityImpactZoneTiles(
      selectedUnit,
      selectedUnitAbility,
      hoveredTile.x,
      hoveredTile.y,
      grid
    );
  }, [
    isAimingAbility,
    selectedUnit,
    selectedUnitAbility,
    hoveredTile,
    abilityTiles,
    grid,
    isAiTurn,
  ]);

  // Casas de Movimento e Ataque da unidade ativa (permite 2 ações por turno, podendo repetir a mesma ação)
  const movementTiles = useMemo(() => {
    if (isAimingAbility) return [];
    if (selectedHandCard) return spawnTiles;
    if (
      !activeUnit ||
      (activeUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0 ||
      isAiTurn
    ) {
      return [];
    }
    return getValidMovementTiles(activeUnit, grid, units, cores);
  }, [
    isAimingAbility,
    selectedHandCard,
    spawnTiles,
    activeUnit,
    grid,
    units,
    cores,
    isAiTurn,
  ]);

  const attackTiles = useMemo(() => {
    if (isAimingAbility) return [];
    if (selectedHandCard && selectedHandCard.category === "FEITICO") {
      return spellTargetTiles;
    }
    if (
      !activeUnit ||
      (activeUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0 ||
      isAiTurn
    ) {
      return [];
    }
    return getValidAttackTiles(activeUnit, grid, units);
  }, [
    isAimingAbility,
    selectedHandCard,
    spellTargetTiles,
    activeUnit,
    grid,
    units,
    isAiTurn,
  ]);

  // ==========================================================
  // REINICIAR PARTIDA
  // ==========================================================
  const handleRestartBattle = () => {
    setCores([
      {
        owner: "PLAYER",
        name: "Núcleo Aliado",
        x: 0,
        y: 4,
        currentHp: 1000,
        maxHp: 1000,
      },
      {
        owner: "AI",
        name: "Núcleo da IA",
        x: 14,
        y: 4,
        currentHp: initialAiHp,
        maxHp: initialAiHp,
      },
    ]);

    setUnits(generateInitialUnits());
    setCurrentMana(6);
    setTurnNumber(1);
    setIsAiTurn(false);
    setAiMana(5);

    const fullDeck: Card[] = [];
    while (fullDeck.length < 30 && sampleCards.length > 0) {
      fullDeck.push(...sampleCards.slice(0, 30 - fullDeck.length));
    }
    const shuffled = shuffleDeck(fullDeck.length > 0 ? fullDeck : sampleCards);
    setDeck(shuffled);
    setHand(shuffled.slice(0, 4));
    setRemainingDeck(shuffled.slice(4));

    const nextBiome = getNextBiome(currentBiome);
    setCurrentBiome(nextBiome);
    setSelectedHandCard(null);
    setSelectedUnit(null);
    setIsAimingAbility(false);
    setGameOverState({ isGameOver: false });
    setBattleMessage({
      text: `Nova partida iniciada no bioma ${BIOME_CONFIGS[nextBiome].emoji} ${BIOME_CONFIGS[nextBiome].name}!`,
      type: "info",
    });
  };

  // ==========================================================
  // PASSAGEM DE TURNO COM EXECUÇÃO INTELIGENTE DA IA
  // ==========================================================
  const handleEndTurn = () => {
    if (isAiTurn || gameOverState.isGameOver) return;

    setSelectedHandCard(null);
    setSelectedUnit(null);
    setIsAimingAbility(false);
    setIsAiTurn(true);

    setBattleMessage({
      text: "🤖 Turno do Adversário: A IA está calculando alvos e manobras táticas...",
      type: "info",
    });

    // Simulação do processamento tático da IA (delay de 800ms para apreciação visual)
    setTimeout(() => {
      const aiResult = executeAiTurn(
        aiMana,
        aiHand,
        aiRemainingDeck,
        units,
        cores,
        grid,
        turnNumber
      );

      // Atualiza estado após a jogada da IA
      setAiMana(aiResult.nextAiMana);
      setAiHand(aiResult.nextAiHand);
      setAiRemainingDeck(aiResult.nextAiDeck);
      setUnits(aiResult.updatedUnits);
      setCores(aiResult.updatedCores);

      // Disparar VFX de Habilidades usadas pela IA e danos flutuantes
      if (aiResult.abilityVfxList.length > 0) {
        triggerAbilityVfx(aiResult.abilityVfxList[0]);
      }

      for (const fd of aiResult.floatingDamages) {
        triggerFloatingDamage(
          fd.x,
          fd.y,
          fd.damage,
          fd.isFatal,
          fd.label,
          fd.variant
        );
      }

      if (aiResult.floatingDamages.length > 0) {
        const fd = aiResult.floatingDamages[0];
        const hitTarget = units.find((u) => u.x === fd.x && u.y === fd.y);
        if (hitTarget) {
          setHitUnitId(hitTarget.id);
          setTimeout(() => setHitUnitId(null), 400);
          if (fd.isFatal) {
            setDyingUnitId(hitTarget.id);
            setTimeout(() => setDyingUnitId(null), 550);
          }
        }
        setActionFreezeData({
          attackerName: "Ofensiva da IA",
          attackerType: "BESTIAIS",
          attackerOwner: "AI",
          damage: fd.damage,
          targetName: hitTarget ? hitTarget.card.name : "Núcleo Aliado",
          isSpell: false,
        });
      }

      // --------------------------------------------------------
      // RETORNO PARA O TURNO DO JOGADOR (RECARGA DE HABILIDADES + VENENO)
      // --------------------------------------------------------
      const nextPlayerMana = calculateTurnMana(currentMana);
      setCurrentMana(nextPlayerMana);
      setTurnNumber((prev) => prev + 1);

      const playerTurnStart = processTurnStartAbilitiesAndStatuses(
        "PLAYER",
        aiResult.updatedUnits
      );
      setUnits(playerTurnStart.updatedUnits);

      for (const pfd of playerTurnStart.poisonDamages) {
        triggerFloatingDamage(
          pfd.x,
          pfd.y,
          pfd.damage,
          pfd.isFatal,
          pfd.label,
          pfd.variant
        );
      }

      // Compra de carta do jogador
      if (remainingDeck.length > 0 && hand.length < 7) {
        const drawn = remainingDeck[0];
        setHand((prev) => [...prev, drawn]);
        setRemainingDeck((prev) => prev.slice(1));
      }

      setIsAiTurn(false);

      const lastAiAction =
        aiResult.actionLogs.length > 0
          ? aiResult.actionLogs[aiResult.actionLogs.length - 1]
          : "A IA reposicionou suas defesas.";

      setBattleMessage({
        text: `${lastAiAction} Seu turno! (+3 Mana creditados).`,
        type: "success",
      });
    }, 800);
  };

  // ==========================================================
  // AÇÕES DO JOGADOR
  // ==========================================================
  const handleSelectHandCard = (card: Card) => {
    if (isAiTurn) return;
    setSelectedUnit(null);

    if (card.category === "MONSTRO") {
      const validation = canSummonMonster(
        playerUnits.length,
        currentMana,
        card.manaCost
      );
      if (!validation.canSummon) {
        setBattleMessage({
          text: validation.reason || "Não é possível invocar este monstro.",
          type: "warn",
        });
        return;
      }
      setSelectedHandCard(card);
      setBattleMessage({
        text: `Selecione uma casa de invocação (PLAYER_SPAWN destacada em azul) para invocar "${card.name}" por ${card.manaCost} de Mana.`,
        type: "info",
      });
    } else {
      const validation = canCastSpell(currentMana, card.manaCost);
      if (!validation.canCast) {
        setBattleMessage({
          text: validation.reason || "Mana insuficiente para este feitiço.",
          type: "warn",
        });
        return;
      }

      const effect = card.spellEffectJson as Record<string, any> | null;
      if (effect?.type === "RESOURCE_GAIN") {
        const bonus = effect.manaBonus || 2;
        const newMana = Math.min(currentMana - card.manaCost + bonus, MAX_MANA);
        setCurrentMana(newMana);
        setHand((prev) => prev.filter((c) => c.id !== card.id));
        setBattleMessage({
          text: `✨ Feitiço "${card.name}" conjurado! +${bonus} de Mana canalizados imediatamente (Reserva: ${newMana}/15)!`,
          type: "success",
        });
        setSelectedHandCard(null);
        return;
      }

      setSelectedHandCard(card);
      setBattleMessage({
        text: `✨ Feitiço "${card.name}" ativo! Clique no alvo desejado no tabuleiro para disparar o efeito por ${card.manaCost} de Mana.`,
        type: "info",
      });
    }
  };

  // Disparo direto ou por alvo da Habilidade Ativa Única
  const executeSelectedUnitAbilityAt = (targetX: number, targetY: number) => {
    if (!selectedUnit || !selectedUnitAbility) return;

    const result = executeCreatureAbility(
      selectedUnit,
      selectedUnitAbility,
      targetX,
      targetY,
      grid,
      units
    );

    setIronCrownSpellName(selectedUnitAbility.name);
    triggerAbilityVfx(result.vfx);
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 450);

    for (const fd of result.floatingDamages) {
      triggerFloatingDamage(
        fd.x,
        fd.y,
        fd.damage,
        fd.isFatal,
        fd.label,
        fd.variant
      );
    }

    setUnits(result.updatedUnits);
    setIsAimingAbility(false);
    const updatedSelf =
      result.updatedUnits.find((u) => u.id === selectedUnit.id) || null;
    const remainingActions = updatedSelf?.actionsRemaining ?? 0;
    setSelectedUnit(remainingActions > 0 ? updatedSelf : null);
    setBattleMessage({
      text: `${result.summaryText} (${remainingActions}/${MAX_UNIT_ACTIONS_PER_TURN} ação restante)`,
      type: "success",
    });
  };

  const handleTileClick = (x: number, y: number) => {
    if (isAiTurn) return;

    // 0) DISPARO DE HABILIDADE ATIVA ÚNICA EM MODO DE MIRA
    if (
      isAimingAbility &&
      selectedUnit &&
      selectedUnit.owner === "PLAYER" &&
      selectedUnitAbility
    ) {
      const isValidAbilityTile = abilityTiles.some(
        (t) => t.x === x && t.y === y
      );
      if (!isValidAbilityTile) {
        setBattleMessage({
          text: `Alvo inválido para "${selectedUnitAbility.name}"! Clique em uma casa destacada em roxo ou cancele a mira.`,
          type: "warn",
        });
        return;
      }
      executeSelectedUnitAbilityAt(x, y);
      return;
    }

    // A) INVOCAR MONSTRO
    if (selectedHandCard && selectedHandCard.category === "MONSTRO") {
      const isSpawnTile = spawnTiles.some((t) => t.x === x && t.y === y);
      if (!isSpawnTile) {
        setBattleMessage({
          text: "Local inválido para invocação! Selecione uma casa de Spawn aliada livre.",
          type: "warn",
        });
        return;
      }

      const newUnit: BoardUnit = {
        id: `unit_${Date.now()}`,
        card: selectedHandCard,
        owner: "PLAYER",
        x,
        y,
        currentHp: selectedHandCard.hp || 100,
        maxHp: selectedHandCard.hp || 100,
        hasMoved: false,
        hasAttacked: false,
        actionsRemaining: MAX_UNIT_ACTIONS_PER_TURN,
        abilityCooldown: 0,
        usedAbilityThisTurn: false,
        statusEffects: [],
      };

      setUnits((prev) => [...prev, newUnit]);
      setCurrentMana((prev) => prev - selectedHandCard.manaCost);
      setHand((prev) => prev.filter((c) => c.id !== selectedHandCard.id));

      // Bark atmosférico quando monstro Lendário ou Épico é invocado
      if (
        selectedHandCard.rarity === "LENDARIO" ||
        selectedHandCard.rarity === "EPICO"
      ) {
        const barks = [
          "A escuridão se dobra à minha vontade!",
          "Das cinzas de ferro ergue-se o flagelo!",
          "Nenhum muro de pedra deterá a nossa marcha!",
          "Cinzas às cinzas, pó aos abismos eternos!",
        ];
        setActiveBark({
          id: `bark_summon_${Date.now()}`,
          speakerName: selectedHandCard.name,
          speakerOwner: "PLAYER",
          text: barks[Math.floor(Math.random() * barks.length)],
        });
      }

      setBattleMessage({
        text: `⚔️ "${selectedHandCard.name}" invocado em (${x}, ${y})! -${selectedHandCard.manaCost} de Mana consumidos.`,
        type: "success",
      });

      setSelectedHandCard(null);
      return;
    }

    // B) CONJURAR FEITIÇO
    if (selectedHandCard && selectedHandCard.category === "FEITICO") {
      const isTargetValid = spellTargetTiles.some((t) => t.x === x && t.y === y);
      if (!isTargetValid) {
        setBattleMessage({
          text: "Alvo inválido para este feitiço!",
          type: "warn",
        });
        return;
      }

      const effect = selectedHandCard.spellEffectJson as Record<string, any> | null;
      const targetUnit = units.find((u) => u.x === x && u.y === y);
      const targetCore = cores.find((c) => c.x === x && c.y === y);

      // Disparo da Coroa de Ferro de Feitiço Arcano
      setIronCrownSpellName(selectedHandCard.name);

      if (effect?.type === "HEAL" || effect?.healAmount) {
        const heal = effect.healAmount || 45;
        if (targetUnit) {
          setUnits((prev) =>
            prev.map((u) =>
              u.id === targetUnit.id
                ? { ...u, currentHp: Math.min(u.currentHp + heal, u.maxHp) }
                : u
            )
          );
        } else if (targetCore) {
          setCores((prev) =>
            prev.map((c) =>
              c.owner === targetCore.owner
                ? { ...c, currentHp: Math.min(c.currentHp + heal, c.maxHp) }
                : c
            )
          );
        }
      }

      if (effect?.type === "DIRECT_DAMAGE" || effect?.damage) {
        const dmg = effect.damage || 65;
        const isFatal = !!(targetUnit && targetUnit.currentHp <= dmg);
        triggerFloatingDamage(x, y, dmg, isFatal);

        // Action Freeze-Frame de Feitiço
        setActionFreezeData({
          attackerName: selectedHandCard.name,
          attackerType: selectedHandCard.type,
          attackerOwner: "PLAYER",
          damage: dmg,
          targetName: targetUnit?.card.name || targetCore?.name || "Área",
          isSpell: true,
        });

        if (targetUnit) {
          setHitUnitId(targetUnit.id);
          setTimeout(() => setHitUnitId(null), 400);

          if (isFatal) {
            setIsScreenShaking(true);
            setTimeout(() => setIsScreenShaking(false), 450);
            setCriticalBanner({
              text: "OBLITERADO!",
              type: "FATAL",
            });

            setDyingUnitId(targetUnit.id);
            setTimeout(() => {
              setUnits((prev) => prev.filter((u) => u.id !== targetUnit.id));
              setDyingUnitId(null);
            }, 550);
          } else {
            setUnits((prev) =>
              prev.map((u) =>
                u.id === targetUnit.id ? { ...u, currentHp: u.currentHp - dmg } : u
              )
            );
          }
        } else if (targetCore) {
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 450);
          setCores((prev) =>
            prev.map((c) =>
              c.owner === targetCore.owner
                ? { ...c, currentHp: Math.max(c.currentHp - dmg, 0) }
                : c
            )
          );
        }
      }

      setCurrentMana((prev) => prev - selectedHandCard.manaCost);
      setHand((prev) => prev.filter((c) => c.id !== selectedHandCard.id));

      setBattleMessage({
        text: `✨ Feitiço "${selectedHandCard.name}" lançado com sucesso em (${x}, ${y})! -${selectedHandCard.manaCost} de Mana.`,
        type: "success",
      });

      setSelectedHandCard(null);
      return;
    }

    // C) COMBATE E MOVIMENTO
    if (selectedUnit && selectedUnit.owner === "PLAYER") {
      const targetUnit = units.find((u) => u.x === x && u.y === y);
      const targetCore = cores.find((c) => c.x === x && c.y === y);

      const isAttackTile = attackTiles.some((t) => t.x === x && t.y === y);

      if (isAttackTile && (targetUnit?.owner === "AI" || targetCore?.owner === "AI")) {
        const damage = getEffectiveUnitDamage(selectedUnit);
        const nextActions = Math.max(
          0,
          (selectedUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) - 1
        );
        const actionsExhausted = nextActions <= 0;

        // Disparo do Action Freeze-Frame Darkest Dungeon
        setActionFreezeData({
          attackerName: selectedUnit.card.name,
          attackerType: selectedUnit.card.type,
          attackerOwner: selectedUnit.owner,
          damage,
          targetName: targetUnit?.card.name || targetCore?.name || "Núcleo da IA",
          isSpell: false,
        });

        if (targetUnit) {
          const goldenShell = (targetUnit.statusEffects || []).find(
            (s) => s.type === "GOLDEN_SHELL" && s.turnsLeft > 0
          );
          let finalDamage = damage;
          let reflectedDmg = 0;
          if (goldenShell) {
            finalDamage = Math.max(1, Math.round(damage * 0.7)); // 30% redução
            reflectedDmg = Math.max(1, Math.round(damage * 0.5)); // 50% refletido
          }

          const isFatal = targetUnit.currentHp <= finalDamage;
          triggerFloatingDamage(x, y, finalDamage, isFatal);

          if (reflectedDmg > 0) {
            const attackerFatal = selectedUnit.currentHp <= reflectedDmg;
            triggerFloatingDamage(
              selectedUnit.x,
              selectedUnit.y,
              reflectedDmg,
              attackerFatal,
              `-${reflectedDmg} Refletido!`,
              "ABILITY"
            );
          }

          // Hit-Stop e Respingos de Sangue
          setHitUnitId(targetUnit.id);
          setTimeout(() => setHitUnitId(null), 400);

          if (isFatal) {
            setIsScreenShaking(true);
            setTimeout(() => setIsScreenShaking(false), 450);
            setCriticalBanner({
              text: Math.random() > 0.5 ? "GOLPE MORTAL!" : "OBLITERADO!",
              type: "FATAL",
            });

            setDyingUnitId(targetUnit.id);
            setUnits((prev) =>
              prev.map((u) => {
                if (u.id === targetUnit.id) {
                  return { ...u, currentHp: 0 };
                }
                if (u.id === selectedUnit.id) {
                  return {
                    ...u,
                    currentHp: Math.max(0, u.currentHp - reflectedDmg),
                    actionsRemaining: nextActions,
                    hasMoved: actionsExhausted,
                    hasAttacked: actionsExhausted,
                  };
                }
                return u;
              })
            );

            // Dissolução em Cinzas e Liberação do Slot de Criaturas
            setTimeout(() => {
              setUnits((prev) =>
                prev.filter(
                  (u) => u.id !== targetUnit.id && u.currentHp > 0
                )
              );
              setDyingUnitId(null);
            }, 550);
          } else {
            setUnits((prev) =>
              prev
                .map((u) => {
                  if (u.id === targetUnit.id) {
                    return { ...u, currentHp: u.currentHp - finalDamage };
                  }
                  if (u.id === selectedUnit.id) {
                    return {
                      ...u,
                      currentHp: Math.max(0, u.currentHp - reflectedDmg),
                      actionsRemaining: nextActions,
                      hasMoved: actionsExhausted,
                      hasAttacked: actionsExhausted,
                    };
                  }
                  return u;
                })
                .filter((u) => u.currentHp > 0)
            );
          }

          setBattleMessage({
            text: isFatal
              ? `💀 "${selectedUnit.card.name}" eliminou "${targetUnit.card.name}" (${finalDamage} dano)! Ações restantes: ${nextActions}/${MAX_UNIT_ACTIONS_PER_TURN}.`
              : `🎯 "${selectedUnit.card.name}" atacou "${targetUnit.card.name}" (${finalDamage} dano)! Ações restantes: ${nextActions}/${MAX_UNIT_ACTIONS_PER_TURN}.`,
            type: "success",
          });
        } else if (targetCore) {
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 450);
          triggerFloatingDamage(x, y, damage, targetCore.currentHp <= damage);

          setCores((prev) =>
            prev.map((c) =>
              c.owner === "AI"
                ? { ...c, currentHp: Math.max(c.currentHp - damage, 0) }
                : c
            )
          );

          setUnits((prev) =>
            prev.map((u) =>
              u.id === selectedUnit.id
                ? {
                    ...u,
                    actionsRemaining: nextActions,
                    hasMoved: actionsExhausted,
                    hasAttacked: actionsExhausted,
                  }
                : u
            )
          );

          setBattleMessage({
            text: `💥 "${selectedUnit.card.name}" bombardeou o Núcleo da IA (${damage} dano)! Ações restantes: ${nextActions}/${MAX_UNIT_ACTIONS_PER_TURN}.`,
            type: "success",
          });
        }

        setSelectedUnit(
          actionsExhausted
            ? null
            : {
                ...selectedUnit,
                actionsRemaining: nextActions,
                hasMoved: actionsExhausted,
                hasAttacked: actionsExhausted,
              }
        );
        return;
      }

      // Checa se o jogador tentou atacar um alvo inimigo bloqueado ou fora de alcance
      if (
        (targetUnit?.owner === "AI" || targetCore?.owner === "AI") &&
        !isAttackTile
      ) {
        const dist = Math.max(
          Math.abs(x - selectedUnit.x),
          Math.abs(y - selectedUnit.y)
        );
        const range = selectedUnit.card.rangeTiles || 1;
        if (dist <= range && selectedUnit.card.attackType === "LINE_OF_SIGHT") {
          setCriticalBanner({
            text: "LINHA BLOQUEADA",
            type: "BLOCKED",
          });
          setBattleMessage({
            text: "Linha de visão bloqueada por obstáculo.",
            type: "warn",
          });
          return;
        } else if (dist > range) {
          setCriticalBanner({
            text: "FORA DE ALCANCE",
            type: "BLOCKED",
          });
          setBattleMessage({
            text: `Alvo fora de alcance (Distância ${dist} > Alcance ${range}).`,
            type: "warn",
          });
          return;
        }
      }

      const isMoveValid = movementTiles.some((t) => t.x === x && t.y === y);
      if (isMoveValid) {
        const nextActions = Math.max(
          0,
          (selectedUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) - 1
        );
        const actionsExhausted = nextActions <= 0;

        setUnits((prev) =>
          prev.map((u) =>
            u.id === selectedUnit.id
              ? {
                  ...u,
                  x,
                  y,
                  actionsRemaining: nextActions,
                  hasMoved: actionsExhausted,
                  hasAttacked: actionsExhausted,
                }
              : u
          )
        );
        setSelectedUnit(
          actionsExhausted
            ? null
            : {
                ...selectedUnit,
                x,
                y,
                actionsRemaining: nextActions,
                hasMoved: actionsExhausted,
                hasAttacked: actionsExhausted,
              }
        );
        setBattleMessage({
          text: `👟 "${selectedUnit.card.name}" moveu-se para (${x}, ${y}). Ações restantes: ${nextActions}/${MAX_UNIT_ACTIONS_PER_TURN}.`,
          type: "info",
        });
        return;
      }

      if (targetUnit && targetUnit.owner === "PLAYER") {
        setIsAimingAbility(false);
        setSelectedUnit(targetUnit);
        return;
      }

      setIsAimingAbility(false);
      setSelectedUnit(null);
      return;
    }

    const clickedUnit = units.find((u) => u.x === x && u.y === y);
    if (clickedUnit) {
      setSelectedHandCard(null);
      setIsAimingAbility(false);
      setSelectedUnit(clickedUnit);
    }
  };

  return (
    <div className="relative space-y-4">
      {/* Camada 1 do Sistema de Biomas: Fundo Atmosférico 2D + Partículas */}
      <BiomeAtmosphereBackdrop biome={currentBiome} />

      {/* Banner de Coroa de Ferro de Feitiço Arcano */}
      <IronCrownSpellBanner
        spellName={ironCrownSpellName}
        onFinish={() => setIronCrownSpellName(null)}
      />

      {/* Modal de Fim de Jogo */}
      {gameOverState.isGameOver && (
        <GameOverModal
          gameOverState={gameOverState}
          stageNumber={stageNumber}
          stageName={stageName}
          goldReward={goldReward}
          turnNumber={turnNumber}
          onRestartBattle={handleRestartBattle}
        />
      )}

      {/* Modal de Seleção de Foto de Perfil (Criaturas Desbloqueadas) */}
      <ProfileAvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={playerAvatar}
        onSelectAvatar={(next) => setPlayerAvatar(next)}
        fallbackCreatures={sampleCards
          .filter((c) => c.category === "MONSTRO")
          .map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            category: c.category,
            rarity: c.rarity,
            quantity: 3,
          }))}
      />

      {/* ======================================================== */}
      {/* HUD SUPERIOR COM ÍCONES DE CRIATURAS:                    */}
      {/* Esquerda: Player (Criatura Desbloqueada Clicável) + Mana */}
      {/* Centro: Placa Hexagonal "Turno X"                        */}
      {/* Direita: Enemy (Criatura Comandante Inimiga) + Mana      */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between gap-2 px-1 sm:px-2 select-none">
        {/* 1. HUD DO JOGADOR (Esquerda) */}
        <div className="flex items-center">
          {/* Moldura Octogonal Clicável com o Ícone da Criatura Desbloqueada do Jogador */}
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            title={`Foto de Perfil: ${playerAvatar.name} (Clique para trocar entre suas criaturas desbloqueadas)`}
            className="group relative z-20 w-16 h-16 sm:w-20 sm:h-20 p-[2.5px] bg-gradient-to-br from-[#38BDF8] via-[#A855F7] to-[#1E1B4B] hover:from-[#38BDF8] hover:via-[#C084FC] hover:to-[#38BDF8] shadow-[0_0_22px_rgba(168,85,247,0.55)] shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105"
            style={{
              clipPath:
                "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
            }}
          >
            <div
              className="relative w-full h-full bg-gradient-to-b from-[#23154F] via-[#140D2B] to-[#090612] flex items-center justify-center overflow-hidden p-1.5"
              style={{
                clipPath:
                  "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.28)_0%,transparent_70%)] pointer-events-none" />
              <CutoutMonsterSprite
                name={playerAvatar.name}
                type={playerAvatar.type}
                category="MONSTRO"
                isEnemy={false}
                className="w-full h-full scale-125 translate-y-1"
              />
              {/* Overlay sutil no hover indicando troca de foto de perfil */}
              <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-gothic font-bold text-[#38BDF8] uppercase tracking-wider text-center">
                Trocar
              </div>
            </div>
          </button>

          {/* Placa Lateral "Player" + Mana ✦ */}
          <div
            className="-ml-4 pl-7 pr-6 py-2 bg-gradient-to-r from-[#161229]/95 via-[#1C1635]/90 to-transparent border-y border-r border-[#4C3F78]/50 flex flex-col justify-center"
            style={{
              clipPath: "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-gothic font-bold text-sm sm:text-base text-white tracking-wide">
                Player
              </span>
              <span className="text-[10px] font-numbers text-[#38BDF8] bg-[#0F172A]/80 px-1.5 py-0.5 rounded border border-[#38BDF8]/30">
                {playerCore.currentHp} HP
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <AbyssalManaDiamond cost={currentMana} size="md" />
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="text-[9px] font-parchment text-[#C084FC] hover:text-[#38BDF8] underline cursor-pointer hidden sm:inline"
              >
                Trocar Avatar
              </button>
            </div>
          </div>
        </div>

        {/* 2. BANNER CENTRAL "Turno X" + SELETOR DE BIOMA + CONTROLE DE ZOOM */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div
              className="p-[2px] bg-[#09090B] rounded-xl shadow-[0_5px_0_#09090B]"
            >
              <div
                className="px-5 sm:px-7 py-1.5 rounded-[10px] flex items-center justify-center border border-white/15"
                style={{
                  backgroundColor: BIOME_CONFIGS[currentBiome].badgeBg,
                }}
              >
                <span className="font-gothic font-bold text-sm sm:text-base text-[#F8FAFC] tracking-wider">
                  Turno {turnNumber}
                </span>
              </div>
            </div>

            {/* Indicador e Seletor de Bioma 2D Cartoon */}
            <div className="flex items-center gap-1 bg-[#141418]/95 border-2 border-[#09090B] shadow-[0_4px_0_#09090B] px-2 py-1 rounded-xl">
              <span className="hidden md:inline text-[10px] font-gothic font-bold uppercase tracking-wider text-[#94A3B8] mr-1">
                Bioma:
              </span>
              {BIOME_ORDER.map((b) => {
                const cfg = BIOME_CONFIGS[b];
                const isActive = currentBiome === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setCurrentBiome(b);
                      setBattleMessage({
                        text: `${cfg.emoji} Cenário alterado para: ${cfg.name} — ${cfg.description}`,
                        type: "info",
                      });
                    }}
                    title={`${cfg.name}: ${cfg.description}`}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-gothic font-bold transition-all cursor-pointer border ${
                      isActive
                        ? "border-[#09090B] scale-105 shadow-[0_2px_0_#09090B]"
                        : "border-transparent opacity-65 hover:opacity-100 hover:bg-white/10 text-[#E2E8F0]"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: cfg.badgeBg,
                            color: cfg.badgeText,
                            borderColor: cfg.badgeBorder,
                          }
                        : undefined
                    }
                  >
                    <span>{cfg.emoji}</span>
                    <span className="hidden lg:inline">{cfg.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Controle Rápido de Zoom (- / +) */}
            <div className="hidden sm:flex items-center gap-1 bg-[#141418]/95 border-2 border-[#09090B] shadow-[0_4px_0_#09090B] px-2 py-1 rounded-xl text-[10px] font-numbers text-[#CBD5E1]">
              <button
                type="button"
                onClick={() =>
                  setBoardZoom((z) => Math.max(0.7, Number((z - 0.06).toFixed(2))))
                }
                className="px-1.5 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold cursor-pointer"
                title="Diminuir Zoom"
              >
                -
              </button>
              <span className="min-w-[34px] text-center font-bold text-[#FACC15]">
                {Math.round(boardZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() =>
                  setBoardZoom((z) => Math.min(1.3, Number((z + 0.06).toFixed(2))))
                }
                className="px-1.5 py-0.5 rounded bg-[#27272A] hover:bg-[#3F3F46] text-white font-bold cursor-pointer"
                title="Aumentar Zoom"
              >
                +
              </button>
            </div>
          </div>
          {battleMessage && (
            <span className="text-[11px] font-parchment text-[#F8FAFC] bg-[#09090B]/85 px-3 py-0.5 rounded-full border border-white/15 max-w-xl truncate">
              {battleMessage.text}
            </span>
          )}
        </div>

        {/* 3. HUD DO INIMIGO (Direita) */}
        <div className="flex items-center">
          {/* Placa Lateral "Enemy" + Mana ✦ */}
          <div
            className="-mr-4 pr-7 pl-6 py-2 bg-gradient-to-l from-[#2A1222]/95 via-[#241124]/90 to-transparent border-y border-l border-[#881337]/60 flex flex-col items-end justify-center"
            style={{
              clipPath: "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-numbers text-[#F43F5E] bg-[#1F0913]/80 px-1.5 py-0.5 rounded border border-[#F43F5E]/30">
                {aiCore.currentHp} HP
              </span>
              <span className="font-gothic font-bold text-sm sm:text-base text-white tracking-wide">
                Enemy
              </span>
            </div>
            <div className="mt-0.5">
              <AbyssalManaDiamond cost={aiMana} size="md" />
            </div>
          </div>

          {/* Moldura Octogonal com o Ícone da Criatura Inimiga */}
          <div
            title={`Comandante Inimigo: ${enemyAvatar.name}`}
            className="relative z-20 w-16 h-16 sm:w-20 sm:h-20 p-[2.5px] bg-gradient-to-bl from-[#F43F5E] via-[#881337] to-[#1E1B2E] shadow-[0_0_22px_rgba(244,63,94,0.5)] shrink-0"
            style={{
              clipPath:
                "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
            }}
          >
            <div
              className="relative w-full h-full bg-gradient-to-b from-[#3B0A1E] via-[#1F0712] to-[#0D0409] flex items-center justify-center overflow-hidden p-1.5"
              style={{
                clipPath:
                  "polygon(28% 0%, 72% 0%, 100% 28%, 100% 72%, 72% 100%, 28% 100%, 0% 72%, 0% 28%)",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.32)_0%,transparent_70%)] pointer-events-none" />
              <CutoutMonsterSprite
                name={enemyAvatar.name}
                type={enemyAvatar.type}
                category="MONSTRO"
                isEnemy={true}
                className="w-full h-full scale-125 translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PAINEL DE COMANDO DE HABILIDADE ATIVA ÚNICA (QUANDO SELECIONADO) */}
      {/* ======================================================== */}
      {selectedUnit && selectedUnitAbility && (
        <div className="mx-auto max-w-4xl bg-[#0E0B1A]/95 border-2 border-[#A855F7] rounded-xl px-4 py-2.5 shadow-[0_6px_0_#09090B,0_0_25px_rgba(168,85,247,0.45)] flex flex-wrap items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-[#1C1635] border border-[#C084FC]/60 p-1 shrink-0 flex items-center justify-center">
              <CutoutMonsterSprite
                name={selectedUnit.card.name}
                type={selectedUnit.card.type}
                category="MONSTRO"
                isEnemy={selectedUnit.owner === "AI"}
                className="w-full h-full scale-110"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-gothic font-bold text-sm text-white">
                  {selectedUnit.card.name}
                </span>
                <span className="text-[10px] font-numbers font-bold px-1.5 py-0.5 rounded bg-[#064E3B] border border-[#34D399] text-[#A7F3D0]">
                  ⚡ Ações: {selectedUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN}/
                  {MAX_UNIT_ACTIONS_PER_TURN}
                </span>
                <span className="text-[10px] font-numbers font-bold px-1.5 py-0.5 rounded bg-[#3B0764] border border-[#C084FC] text-[#FACC15]">
                  ⚡ {selectedUnitAbility.name}
                </span>
                <span className="text-[10px] font-numbers text-[#CBD5E1]">
                  Recarga: {selectedUnitAbility.cooldown}T &bull; Alcance:{" "}
                  {selectedUnitAbility.range === 0
                    ? "Ao redor (3x3)"
                    : `${selectedUnitAbility.range} casas`}
                </span>
              </div>
              <p className="text-[11px] font-parchment text-[#E2E8F0] mt-0.5 line-clamp-1">
                {selectedUnitAbility.description}
              </p>
            </div>
          </div>

          {selectedUnit.owner === "PLAYER" && !isAiTurn && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Botão 1: Mover / Atacar (Modo Padrão) */}
              <button
                type="button"
                onClick={() => {
                  setIsAimingAbility(false);
                  setBattleMessage({
                    text: `⚔️ Modo Mover / Atacar ativo para "${selectedUnit.card.name}".`,
                    type: "info",
                  });
                }}
                className={`px-3 py-1.5 rounded-lg font-gothic font-bold text-xs border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  !isAimingAbility
                    ? "bg-[#0284C7] border-[#38BDF8] text-white shadow-[0_3px_0_#09090B,0_0_12px_rgba(56,189,248,0.6)]"
                    : "bg-[#18181B] border-[#3F3F46] text-[#CBD5E1] hover:bg-[#27272A]"
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-[#7DD3FC]" />
                <span>Mover / Atacar</span>
              </button>

              {/* Botão 2: Habilidade Única da Criatura */}
              {(selectedUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0 ? (
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-lg bg-[#18181B] border-2 border-[#3F3F46] text-xs font-gothic font-bold text-[#94A3B8] opacity-75 cursor-not-allowed"
                >
                  Sem ações restantes (0/{MAX_UNIT_ACTIONS_PER_TURN})
                </button>
              ) : (selectedUnit.abilityCooldown ?? 0) > 0 ? (
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-lg bg-[#18181B] border-2 border-[#3F3F46] text-xs font-gothic font-bold text-[#94A3B8] opacity-75 cursor-not-allowed"
                >
                  ⏳ Em Recarga ({selectedUnit.abilityCooldown} turnos)
                </button>
              ) : isAimingAbility ? (
                <div className="flex items-center gap-2">
                  {selectedUnitAbility.targetType === "SELF_AOE" && (
                    <button
                      type="button"
                      onClick={() =>
                        executeSelectedUnitAbilityAt(
                          selectedUnit.x,
                          selectedUnit.y
                        )
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-[#09090B] font-gothic font-black text-xs border-2 border-[#09090B] shadow-[0_3px_0_#09090B] cursor-pointer"
                    >
                      💥 Confirmar {selectedUnitAbility.name}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsAimingAbility(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/40 border border-[#EF4444] text-xs font-gothic font-bold text-[#FCA5A5] cursor-pointer"
                  >
                    Cancelar Mira
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const validTargets = getValidAbilityTargetTiles(
                      selectedUnit,
                      selectedUnitAbility,
                      grid,
                      units
                    );
                    if (validTargets.length === 0) {
                      setBattleMessage({
                        text: `Nenhum alvo válido no alcance para "${selectedUnitAbility.name}"!`,
                        type: "warn",
                      });
                      return;
                    }
                    setIsAimingAbility(true);
                    setBattleMessage({
                      text:
                        selectedUnitAbility.targetType === "SELF_AOE"
                          ? `⚡ "${selectedUnitAbility.name}" pronta! Clique em "Confirmar ${selectedUnitAbility.name}" ou na área destacada.`
                          : `⚡ Modo de Mira: Clique em uma casa destacada para usar "${selectedUnitAbility.name}"!`,
                      type: "info",
                    });
                  }}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#A855F7] via-[#9333EA] to-[#10B981] hover:brightness-110 text-white font-gothic font-bold text-xs border-2 border-[#09090B] shadow-[0_3px_0_#09090B,0_0_16px_rgba(168,85,247,0.85)] flex items-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <Zap className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>Usar {selectedUnitAbility.name}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* O TABULEIRO TÁTICO EM PLATAFORMA DE RUÍNAS ABISSAIS       */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center">
        <TacticalGrid
          grid={grid}
          units={units}
          cores={cores}
          biome={currentBiome}
          selectedUnit={selectedUnit}
          hoveredUnit={hoveredUnit}
          hoveredTile={hoveredTile}
          movementTiles={movementTiles}
          attackTiles={attackTiles}
          abilityTiles={abilityTiles}
          aoePreviewTiles={aoePreviewTiles}
          isDashAbility={selectedUnitAbility?.effectType === "DASH_JUMP"}
          activeAbilityVfx={activeAbilityVfx}
          floatingDamages={floatingDamages}
          hitUnitId={hitUnitId}
          dyingUnitId={dyingUnitId}
          actionFreezeData={actionFreezeData}
          onFinishActionFreeze={() => setActionFreezeData(null)}
          isScreenShaking={isScreenShaking}
          activeSpell={
            selectedHandCard?.category === "FEITICO" ? selectedHandCard : null
          }
          criticalBanner={criticalBanner}
          onFinishCriticalBanner={() => setCriticalBanner(null)}
          activeBark={activeBark}
          onFinishBark={() => setActiveBark(null)}
          onSelectUnit={(u) => {
            if (isAiTurn) return;
            setSelectedHandCard(null);
            setIsAimingAbility(false);
            setSelectedUnit((prev) => (prev?.id === u?.id ? null : u));
          }}
          onHoverUnit={(u) => setHoveredUnit(u)}
          onHoverTile={(coord) => setHoveredTile(coord)}
          onTileClick={handleTileClick}
          zoomLevel={boardZoom}
        />
      </div>

      {/* ======================================================== */}
      {/* BARRA INFERIOR: MENU (ESQ) + MÃO DE CARTAS + FINALIZAR TURNO (DIR) */}
      {/* ======================================================== */}
      <HandCards
        hand={hand}
        deckCount={remainingDeck.length}
        currentMana={currentMana}
        playerUnitsCount={playerUnits.length}
        selectedCard={selectedHandCard}
        onSelectCard={handleSelectHandCard}
        onCancelSelection={() => setSelectedHandCard(null)}
        onEndTurn={handleEndTurn}
        isAiTurn={isAiTurn}
        onRestartBattle={handleRestartBattle}
      />
    </div>
  );
}
