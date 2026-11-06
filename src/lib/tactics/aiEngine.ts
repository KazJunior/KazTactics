import { BoardUnit, BoardCore, GridTile } from "@/types/game";
import { Card } from "@/db/schema";
import {
  calculateTurnMana,
  canSummonMonster,
  canCastSpell,
  MAX_MANA,
  MAX_FIELD_UNITS_PER_PLAYER,
} from "./gameState";
import {
  getValidMovementTiles,
  getValidAttackTiles,
} from "./grid";
import { checkLineOfSight, FloatingDamage } from "./combat";

export interface AiTurnResult {
  nextAiMana: number;
  nextAiHand: Card[];
  nextAiDeck: Card[];
  updatedUnits: BoardUnit[];
  updatedCores: BoardCore[];
  actionLogs: string[];
  floatingDamages: FloatingDamage[];
}

/**
 * Motor de Inteligência Artificial Tática (Heurística PvE)
 */
export function executeAiTurn(
  currentAiMana: number,
  aiHand: Card[],
  aiDeck: Card[],
  units: BoardUnit[],
  cores: BoardCore[],
  grid: GridTile[][],
  turnNumber: number
): AiTurnResult {
  const actionLogs: string[] = [];
  const floatingDamages: FloatingDamage[] = [];

  // 1. Ganho de Mana e Compra de Carta da IA (+3 Mana, teto 15)
  let aiMana = calculateTurnMana(currentAiMana);
  let hand = [...aiHand];
  let deck = [...aiDeck];

  if (deck.length > 0 && hand.length < 7) {
    const drawn = deck[0];
    hand.push(drawn);
    deck = deck.slice(1);
    actionLogs.push(`[IA] Comprou uma carta dos reforços.`);
  }

  let updatedUnits = units.map((u) => {
    if (u.owner === "AI") {
      return { ...u, hasMoved: false, hasAttacked: false };
    }
    return u;
  });

  let updatedCores = [...cores];
  const playerCore = updatedCores.find((c) => c.owner === "PLAYER")!;
  const aiCore = updatedCores.find((c) => c.owner === "AI")!;

  // ========================================================
  // FASE 2: FEITIÇOS DA IA (CURA / DANO / MANA)
  // ========================================================
  const spellIndex = hand.findIndex(
    (c) => c.category === "FEITICO" && c.manaCost <= aiMana
  );

  if (spellIndex !== -1) {
    const spell = hand[spellIndex];
    const effect = spell.spellEffectJson as Record<string, any> | null;

    if (effect?.type === "RESOURCE_GAIN") {
      const bonus = effect.manaBonus || 2;
      aiMana = Math.min(aiMana - spell.manaCost + bonus, MAX_MANA);
      hand.splice(spellIndex, 1);
      actionLogs.push(`[IA] Lançou feitiço "${spell.name}" (+${bonus} Mana)!`);
    } else if (effect?.type === "HEAL" && aiCore.currentHp < aiCore.maxHp - 40) {
      const heal = effect.healAmount || 50;
      aiCore.currentHp = Math.min(aiCore.currentHp + heal, aiCore.maxHp);
      aiMana -= spell.manaCost;
      hand.splice(spellIndex, 1);
      actionLogs.push(`[IA] Conjurou "${spell.name}" curando seu Núcleo em +${heal} HP!`);
    } else if (effect?.type === "DIRECT_DAMAGE" || effect?.damage) {
      const dmg = effect.damage || 50;
      // Atacar unidade do jogador com menor HP ou o Núcleo
      const playerTargets = updatedUnits.filter((u) => u.owner === "PLAYER");
      if (playerTargets.length > 0) {
        playerTargets.sort((a, b) => a.currentHp - b.currentHp);
        const target = playerTargets[0];
        target.currentHp -= dmg;
        floatingDamages.push({
          id: `ai_dmg_spell_${Date.now()}`,
          x: target.x,
          y: target.y,
          damage: dmg,
          isFatal: target.currentHp <= 0,
        });

        aiMana -= spell.manaCost;
        hand.splice(spellIndex, 1);
        actionLogs.push(`[IA] Lançou "${spell.name}" em "${target.card.name}" causando ${dmg} de dano!`);

        updatedUnits = updatedUnits.filter((u) => u.currentHp > 0);
      }
    }
  }

  // ========================================================
  // FASE 3: INVOCAÇÃO DE CRIATURAS (PRIORIZANDO RETAGUARDA E VANGUARDA)
  // ========================================================
  const aiAliveUnits = updatedUnits.filter((u) => u.owner === "AI");

  if (aiAliveUnits.length < MAX_FIELD_UNITS_PER_PLAYER) {
    // Buscar monstro mais forte que caiba na mana da IA
    const summonableMonsters = hand
      .filter((c) => c.category === "MONSTRO" && c.manaCost <= aiMana)
      .sort((a, b) => b.manaCost - a.manaCost);

    if (summonableMonsters.length > 0) {
      const monsterToSummon = summonableMonsters[0];

      // Achar célula AI_SPAWN livre
      const occupiedCoords = new Set<string>();
      for (const u of updatedUnits) occupiedCoords.add(`${u.x},${u.y}`);
      for (const c of updatedCores) occupiedCoords.add(`${c.x},${c.y}`);

      const availableSpawns: { x: number; y: number }[] = [];
      for (const row of grid) {
        for (const tile of row) {
          if (
            tile.type === "AI_SPAWN" &&
            !occupiedCoords.has(`${tile.x},${tile.y}`)
          ) {
            availableSpawns.push({ x: tile.x, y: tile.y });
          }
        }
      }

      if (availableSpawns.length > 0) {
        // Se for criatura de ARREMESSO, prefere spawn mais recuado (x maior).
        // Se for criatura de combate direto, prefere spawn mais avançado (x menor).
        availableSpawns.sort((a, b) => {
          if (monsterToSummon.attackType === "ARREMESSO") {
            return b.x - a.x; // Mais ao fundo
          }
          return a.x - b.x; // Mais à frente
        });

        const chosenSpawn = availableSpawns[0];
        const newAiUnit: BoardUnit = {
          id: `ai_unit_${Date.now()}_${Math.random()}`,
          card: monsterToSummon,
          owner: "AI",
          x: chosenSpawn.x,
          y: chosenSpawn.y,
          currentHp: monsterToSummon.hp || 80,
          maxHp: monsterToSummon.hp || 80,
          hasMoved: false,
          hasAttacked: false,
        };

        updatedUnits.push(newAiUnit);
        aiMana -= monsterToSummon.manaCost;
        hand = hand.filter((c) => c.id !== monsterToSummon.id);

        actionLogs.push(
          `[IA] Invocou "${monsterToSummon.name}" em (${chosenSpawn.x}, ${chosenSpawn.y}) por ${monsterToSummon.manaCost} de Mana.`
        );
      }
    }
  }

  // ========================================================
  // FASE 4: MOVIMENTO E ATAQUE (HEURÍSTICA TÁTICA)
  // ========================================================
  const currentAiUnits = updatedUnits.filter((u) => u.owner === "AI");

  for (const aiUnit of currentAiUnits) {
    // 1. CHECAGEM DE ATAQUE ANTES DE MOVER (se já estiver no alcance)
    let attackTargets = getValidAttackTiles(aiUnit, grid, updatedUnits);

    // Heurística de Alvo:
    // Prioridade 1: Atacar Núcleo do Jogador se estiver no alcance
    const canHitPlayerCore = attackTargets.some(
      (t) => t.x === playerCore.x && t.y === playerCore.y
    );

    if (canHitPlayerCore) {
      const damage = aiUnit.card.damage || 25;
      playerCore.currentHp = Math.max(playerCore.currentHp - damage, 0);
      aiUnit.hasAttacked = true;

      floatingDamages.push({
        id: `ai_atk_core_${Date.now()}_${aiUnit.id}`,
        x: playerCore.x,
        y: playerCore.y,
        damage,
        isFatal: playerCore.currentHp <= 0,
      });

      actionLogs.push(
        `[IA] "${aiUnit.card.name}" atacou diretamente o Núcleo Aliado causando ${damage} de dano!`
      );
      continue;
    }

    // Prioridade 2: Eliminar uma criatura do jogador com dano letal
    const playerUnitsInReach = updatedUnits.filter(
      (u) =>
        u.owner === "PLAYER" &&
        attackTargets.some((t) => t.x === u.x && t.y === u.y)
    );

    const lethalTarget = playerUnitsInReach.find(
      (u) => u.currentHp <= (aiUnit.card.damage || 0)
    );

    if (lethalTarget) {
      const damage = aiUnit.card.damage || 25;
      lethalTarget.currentHp -= damage;
      aiUnit.hasAttacked = true;

      floatingDamages.push({
        id: `ai_atk_lethal_${Date.now()}_${aiUnit.id}`,
        x: lethalTarget.x,
        y: lethalTarget.y,
        damage,
        isFatal: true,
      });

      actionLogs.push(
        `[IA] "${aiUnit.card.name}" executou golpe letal em "${lethalTarget.card.name}" causando ${damage} de dano!`
      );

      updatedUnits = updatedUnits.filter((u) => u.currentHp > 0);
      continue;
    }

    // Se houver qualquer inimigo no alcance, ataca o de menor HP
    if (playerUnitsInReach.length > 0) {
      playerUnitsInReach.sort((a, b) => a.currentHp - b.currentHp);
      const chosenTarget = playerUnitsInReach[0];
      const damage = aiUnit.card.damage || 25;
      chosenTarget.currentHp -= damage;
      aiUnit.hasAttacked = true;

      floatingDamages.push({
        id: `ai_atk_focus_${Date.now()}_${aiUnit.id}`,
        x: chosenTarget.x,
        y: chosenTarget.y,
        damage,
        isFatal: chosenTarget.currentHp <= 0,
      });

      actionLogs.push(
        `[IA] "${aiUnit.card.name}" focou "${chosenTarget.card.name}" causando ${damage} de dano.`
      );

      updatedUnits = updatedUnits.filter((u) => u.currentHp > 0);
      continue;
    }

    // ========================================================
    // SE NÃO ATINGE NINGUÉM: MOVIMENTAR-SE INTELIGENTEMENTE
    // ========================================================
    const validMoves = getValidMovementTiles(
      aiUnit,
      grid,
      updatedUnits,
      updatedCores
    );

    if (validMoves.length > 0 && !aiUnit.hasMoved) {
      if (aiUnit.card.attackType === "ARREMESSO") {
        // Heurística de ARREMESSO: Buscar ficar adjacente a um OBSTACLE (cobertura)
        // enquanto reduz a distância em relação ao exército do jogador!
        validMoves.sort((a, b) => {
          // Checar se 'a' tem obstáculo adjacente
          const aHasObstacle = [
            { x: a.x + 1, y: a.y },
            { x: a.x - 1, y: a.y },
            { x: a.x, y: a.y + 1 },
            { x: a.x, y: a.y - 1 },
          ].some((pos) => grid[pos.y]?.[pos.x]?.type === "OBSTACLE");

          const bHasObstacle = [
            { x: b.x + 1, y: b.y },
            { x: b.x - 1, y: b.y },
            { x: b.x, y: b.y + 1 },
            { x: b.x, y: b.y - 1 },
          ].some((pos) => grid[pos.y]?.[pos.x]?.type === "OBSTACLE");

          if (aHasObstacle && !bHasObstacle) return -1;
          if (!aHasObstacle && bHasObstacle) return 1;

          // Se empatar, aproxima-se do centro (x menor)
          return a.x - b.x;
        });

        const bestMove = validMoves[0];
        aiUnit.x = bestMove.x;
        aiUnit.y = bestMove.y;
        aiUnit.hasMoved = true;
      } else {
        // Heurística de COMBATE DIRETO: Avançar em direção ao Núcleo do Jogador (x=0)
        validMoves.sort((a, b) => {
          const distA = Math.hypot(a.x - playerCore.x, a.y - playerCore.y);
          const distB = Math.hypot(b.x - playerCore.x, b.y - playerCore.y);
          return distA - distB;
        });

        const bestMove = validMoves[0];
        aiUnit.x = bestMove.x;
        aiUnit.y = bestMove.y;
        aiUnit.hasMoved = true;
      }

      // 2. TENTAR ATACAR APÓS O MOVIMENTO
      const newAttackTargets = getValidAttackTiles(aiUnit, grid, updatedUnits);
      const canHitCoreAfterMove = newAttackTargets.some(
        (t) => t.x === playerCore.x && t.y === playerCore.y
      );

      if (canHitCoreAfterMove) {
        const damage = aiUnit.card.damage || 25;
        playerCore.currentHp = Math.max(playerCore.currentHp - damage, 0);
        aiUnit.hasAttacked = true;

        floatingDamages.push({
          id: `ai_atk_core_post_${Date.now()}_${aiUnit.id}`,
          x: playerCore.x,
          y: playerCore.y,
          damage,
          isFatal: playerCore.currentHp <= 0,
        });

        actionLogs.push(
          `[IA] "${aiUnit.card.name}" avançou e bombardeou o Núcleo Aliado por ${damage} de dano!`
        );
      } else {
        const enemiesInReach = updatedUnits.filter(
          (u) =>
            u.owner === "PLAYER" &&
            newAttackTargets.some((t) => t.x === u.x && t.y === u.y)
        );

        if (enemiesInReach.length > 0) {
          enemiesInReach.sort((a, b) => a.currentHp - b.currentHp);
          const target = enemiesInReach[0];
          const damage = aiUnit.card.damage || 25;
          target.currentHp -= damage;
          aiUnit.hasAttacked = true;

          floatingDamages.push({
            id: `ai_atk_enemy_post_${Date.now()}_${aiUnit.id}`,
            x: target.x,
            y: target.y,
            damage,
            isFatal: target.currentHp <= 0,
          });

          actionLogs.push(
            `[IA] "${aiUnit.card.name}" avançou e atacou "${target.card.name}" por ${damage} de dano!`
          );

          updatedUnits = updatedUnits.filter((u) => u.currentHp > 0);
        }
      }
    }
  }

  return {
    nextAiMana: aiMana,
    nextAiHand: hand,
    nextAiDeck: deck,
    updatedUnits,
    updatedCores,
    actionLogs,
    floatingDamages,
  };
}

