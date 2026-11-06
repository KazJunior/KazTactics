"use client";

import { useState, useMemo, useEffect } from "react";
import { GridTile, BoardUnit, BoardCore } from "@/types/game";
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
import { FloatingDamage } from "@/lib/tactics/combat";
import { TacticalGrid } from "./TacticalGrid";
import { ManaBar } from "./ManaBar";
import { HandCards } from "./HandCards";
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
}

export function BattlefieldView({
  sampleCards,
  stageName = "Bosque dos Primeiros Confrontos",
  stageNumber = 1,
  initialAiHp = 300,
  goldReward = 100,
}: BattlefieldViewProps) {
  // 1. Grid
  const [grid] = useState<GridTile[][]>(() => createDefaultGrid());

  // 2. Núcleos
  const [cores, setCores] = useState<BoardCore[]>([
    {
      owner: "PLAYER",
      name: "Núcleo Aliado",
      x: 0,
      y: 3,
      currentHp: 1000,
      maxHp: 1000,
    },
    {
      owner: "AI",
      name: "Núcleo da IA",
      x: 10,
      y: 3,
      currentHp: initialAiHp,
      maxHp: initialAiHp,
    },
  ]);

  // Função para criar o exército inicial
  const generateInitialUnits = (): BoardUnit[] => {
    const list: BoardUnit[] = [];

    const archer = sampleCards.find(
      (c) => c.name === "Arqueiro Esqueleto Maldito"
    ) || sampleCards[0];

    const catapult = sampleCards.find(
      (c) => c.name === "Catapulta a Vapor Blindada"
    ) || sampleCards[1];

    const wolf = sampleCards.find(
      (c) => c.name === "Lobo Cinzento Caçador"
    ) || sampleCards[2];

    if (archer) {
      list.push({
        id: "player_archer",
        card: archer,
        owner: "PLAYER",
        x: 2,
        y: 2,
        currentHp: archer.hp || 70,
        maxHp: archer.hp || 70,
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
        y: 1,
        currentHp: catapult.hp || 140,
        maxHp: catapult.hp || 140,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    if (wolf) {
      list.push({
        id: "ai_wolf",
        card: wolf,
        owner: "AI",
        x: 7,
        y: 3,
        currentHp: wolf.hp || 80,
        maxHp: wolf.hp || 80,
        hasMoved: false,
        hasAttacked: false,
      });
    }

    return list;
  };

  // 3. Unidades em Campo
  const [units, setUnits] = useState<BoardUnit[]>(() => generateInitialUnits());

  // 4. Economia de Mana & Turnos do Jogador
  const [currentMana, setCurrentMana] = useState<number>(6);
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [isAiTurn, setIsAiTurn] = useState<boolean>(false);

  // 5. Baralho e Mão do Jogador
  const [deck, setDeck] = useState<Card[]>(() => {
    const fullDeck: Card[] = [];
    while (fullDeck.length < 30 && sampleCards.length > 0) {
      fullDeck.push(...sampleCards.slice(0, 30 - fullDeck.length));
    }
    return shuffleDeck(fullDeck.length > 0 ? fullDeck : sampleCards);
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

  // 7. Seleções
  const [selectedHandCard, setSelectedHandCard] = useState<Card | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<BoardUnit | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<BoardUnit | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(
    null
  );

  // 8. Floating Damages & Darkest Dungeon Action FX
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamage[]>([]);
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
    isFatal = false
  ) => {
    const id = `dmg_${Date.now()}_${Math.random()}`;
    setFloatingDamages((prev) => [...prev, { id, x, y, damage, isFatal }]);
    setTimeout(() => {
      setFloatingDamages((prev) => prev.filter((d) => d.id !== id));
    }, 1200);
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

  // Casas de Movimento e Ataque da unidade ativa
  const movementTiles = useMemo(() => {
    if (selectedHandCard) return spawnTiles;
    if (!activeUnit || activeUnit.hasMoved || isAiTurn) return [];
    return getValidMovementTiles(activeUnit, grid, units, cores);
  }, [selectedHandCard, spawnTiles, activeUnit, grid, units, cores, isAiTurn]);

  const attackTiles = useMemo(() => {
    if (selectedHandCard && selectedHandCard.category === "FEITICO") {
      return spellTargetTiles;
    }
    if (!activeUnit || activeUnit.hasAttacked || isAiTurn) return [];
    return getValidAttackTiles(activeUnit, grid, units);
  }, [selectedHandCard, spellTargetTiles, activeUnit, grid, units, isAiTurn]);

  // ==========================================================
  // REINICIAR PARTIDA
  // ==========================================================
  const handleRestartBattle = () => {
    setCores([
      {
        owner: "PLAYER",
        name: "Núcleo Aliado",
        x: 0,
        y: 3,
        currentHp: 1000,
        maxHp: 1000,
      },
      {
        owner: "AI",
        name: "Núcleo da IA",
        x: 10,
        y: 3,
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

    setSelectedHandCard(null);
    setSelectedUnit(null);
    setGameOverState({ isGameOver: false });
    setBattleMessage({
      text: "Partida reiniciada com sucesso! Conquiste o campo de batalha.",
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

      // Disparar danos flutuantes e Action Freeze da IA
      for (const fd of aiResult.floatingDamages) {
        triggerFloatingDamage(fd.x, fd.y, fd.damage, fd.isFatal);
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
      // RETORNO PARA O TURNO DO JOGADOR
      // --------------------------------------------------------
      const nextPlayerMana = calculateTurnMana(currentMana);
      setCurrentMana(nextPlayerMana);
      setTurnNumber((prev) => prev + 1);

      // Reseta ações das tropas do jogador
      setUnits((prev) =>
        prev.map((u) => ({ ...u, hasMoved: false, hasAttacked: false }))
      );

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

  const handleTileClick = (x: number, y: number) => {
    if (isAiTurn) return;

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
        const damage = selectedUnit.card.damage || 30;

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
          const isFatal = targetUnit.currentHp <= damage;
          triggerFloatingDamage(x, y, damage, isFatal);

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
                  return { ...u, hasAttacked: true };
                }
                return u;
              })
            );

            // Dissolução em Cinzas e Liberação do Slot de Criaturas
            setTimeout(() => {
              setUnits((prev) => prev.filter((u) => u.id !== targetUnit.id));
              setDyingUnitId(null);
            }, 550);
          } else {
            setUnits((prev) =>
              prev.map((u) => {
                if (u.id === targetUnit.id) {
                  return { ...u, currentHp: u.currentHp - damage };
                }
                if (u.id === selectedUnit.id) {
                  return { ...u, hasAttacked: true };
                }
                return u;
              })
            );
          }

          setBattleMessage({
            text: isFatal
              ? `💀 "${selectedUnit.card.name}" eliminou "${targetUnit.card.name}" causando ${damage} de dano fatal!`
              : `🎯 "${selectedUnit.card.name}" atacou "${targetUnit.card.name}" causando ${damage} de dano!`,
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
            prev.map((u) => (u.id === selectedUnit.id ? { ...u, hasAttacked: true } : u))
          );

          setBattleMessage({
            text: `💥 "${selectedUnit.card.name}" bombardeou o Núcleo da IA causando ${damage} de dano direto!`,
            type: "success",
          });
        }

        setSelectedUnit(null);
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
        setUnits((prev) =>
          prev.map((u) =>
            u.id === selectedUnit.id ? { ...u, x, y, hasMoved: true } : u
          )
        );
        setSelectedUnit(null);
        setBattleMessage({
          text: `👟 "${selectedUnit.card.name}" moveu-se para (${x}, ${y}).`,
          type: "info",
        });
        return;
      }

      if (targetUnit && targetUnit.owner === "PLAYER") {
        setSelectedUnit(targetUnit);
        return;
      }

      setSelectedUnit(null);
      return;
    }

    const clickedUnit = units.find((u) => u.x === x && u.y === y);
    if (clickedUnit) {
      setSelectedHandCard(null);
      setSelectedUnit(clickedUnit);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Coroa de Ferro de Feitiço Arcano (Darkest Dungeon) */}
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

      {/* ======================================================== */}
      {/* PAINEL SUPERIOR: NÚCLEOS (PLAYER vs IA) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Núcleo do Jogador (Cristal Nexus Solar) */}
        <div className="p-4 rounded-2xl bg-[#252147]/85 backdrop-blur-md border border-[#F59E0B]/50 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1E1B3A] border-2 border-[#F59E0B] text-[#F59E0B] shadow-[0_0_15px_rgba(245,158,11,0.5)] rounded-xl">
              <Crown className="w-5 h-5 animate-torch" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-gothic tracking-widest text-[#F59E0B] block">
                Comandante dos Guardiões
              </span>
              <h3 className="text-base font-gothic font-black text-[#F8FAFC]">
                {playerCore.name}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end text-sm font-numbers font-black text-[#F59E0B]">
              <Shield className="w-4 h-4 text-[#F59E0B]" />
              <span>
                {playerCore.currentHp} / {playerCore.maxHp} HP
              </span>
            </div>
            <div className="w-32 h-2.5 bg-[#121024] border border-white/20 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] via-[#F59E0B] to-[#FEF08A] rounded-full transition-all duration-300"
                style={{
                  width: `${(playerCore.currentHp / playerCore.maxHp) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Núcleo da IA (Cristal Nexus Astral) */}
        <div className="p-4 rounded-2xl bg-[#252147]/85 backdrop-blur-md border border-[#F43F5E]/50 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-numbers font-black text-[#F43F5E]">
              <Shield className="w-4 h-4 text-[#F43F5E]" />
              <span>
                {aiCore.currentHp} / {aiCore.maxHp} HP
              </span>
            </div>
            <div className="w-32 h-2.5 bg-[#121024] border border-white/20 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9333EA] via-[#E11D48] to-[#F43F5E] rounded-full transition-all duration-300"
                style={{
                  width: `${(aiCore.currentHp / aiCore.maxHp) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[9px] uppercase font-gothic tracking-widest text-[#F43F5E] flex items-center gap-1 justify-end">
                <Brain className="w-3 h-3" /> IA Astral &middot; Fase {stageNumber}
              </span>
              <h3 className="text-base font-gothic font-black text-[#F8FAFC]">
                {aiCore.name}
              </h3>
            </div>
            <div className="p-2.5 bg-[#1E1B3A] border-2 border-[#F43F5E] text-[#F43F5E] shadow-[0_0_15px_rgba(244,63,94,0.5)] rounded-xl">
              <Skull className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BARRA DE MANA, LIMITE 7/7 E CONTROLE DE TURNO */}
      {/* ======================================================== */}
      <ManaBar
        currentMana={currentMana}
        playerUnitsCount={playerUnits.length}
        turnNumber={turnNumber}
        onEndTurn={handleEndTurn}
        isAiTurn={isAiTurn}
      />

      {/* Mensagem de Feedback da Ação (Estilo Vidro Arcano) */}
      {battleMessage && (
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border font-parchment text-sm backdrop-blur-md shadow-lg ${
            battleMessage.type === "success"
              ? "bg-[#18392B]/85 border-[#10B981] text-[#A7F3D0]"
              : battleMessage.type === "warn"
              ? "bg-[#3D1424]/85 border-[#F43F5E] text-[#FECDD3]"
              : "bg-[#252147]/85 border-[#38BDF8]/60 text-[#F8FAFC]"
          }`}
        >
          {isAiTurn ? (
            <Bot className="w-4 h-4 text-[#d8b4fe] animate-spin" />
          ) : battleMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-[#4ade80] shrink-0" />
          ) : battleMessage.type === "warn" ? (
            <AlertCircle className="w-4 h-4 text-[#B82923] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#F29F3D] shrink-0" />
          )}
          <span className="leading-snug">{battleMessage.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* O TABULEIRO TÁTICO COM LINHAS DE VISÃO E ARREMESSO */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center space-y-4">
        <TacticalGrid
          grid={grid}
          units={units}
          cores={cores}
          selectedUnit={selectedUnit}
          hoveredUnit={hoveredUnit}
          hoveredTile={hoveredTile}
          movementTiles={movementTiles}
          attackTiles={attackTiles}
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
            setSelectedUnit((prev) => (prev?.id === u?.id ? null : u));
          }}
          onHoverUnit={(u) => setHoveredUnit(u)}
          onHoverTile={(coord) => setHoveredTile(coord)}
          onTileClick={handleTileClick}
        />
      </div>

      {/* ======================================================== */}
      {/* MÃO DE CARTAS DO JOGADOR (COM FEITIÇOS INSTANTÂNEOS) */}
      {/* ======================================================== */}
      <HandCards
        hand={hand}
        deckCount={remainingDeck.length}
        currentMana={currentMana}
        playerUnitsCount={playerUnits.length}
        selectedCard={selectedHandCard}
        onSelectCard={handleSelectHandCard}
        onCancelSelection={() => setSelectedHandCard(null)}
      />
    </div>
  );
}
