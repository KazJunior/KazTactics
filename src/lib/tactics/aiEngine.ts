import {
  BoardUnit,
  BoardCore,
  GridTile,
  MAX_UNIT_ACTIONS_PER_TURN,
} from "@/types/game";
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
import { checkLineOfSight, FloatingDamage, getEffectiveUnitDamage } from "./combat";
import {
  getCreatureAbility,
  getValidAbilityTargetTiles,
  getAbilityImpactZoneTiles,
  executeCreatureAbility,
  processTurnStartAbilitiesAndStatuses,
  AbilityVfxData,
} from "@/lib/abilities";

export interface AiTurnResult {
  nextAiMana: number;
  nextAiHand: Card[];
  nextAiDeck: Card[];
  updatedUnits: BoardUnit[];
  updatedCores: BoardCore[];
  actionLogs: string[];
  floatingDamages: FloatingDamage[];
  abilityVfxList: AbilityVfxData[];
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
  const abilityVfxList: AbilityVfxData[] = [];

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

  // Processa início de turno da IA: reduz cooldowns em -1, aplica tick de Veneno e atualiza status
  const turnStartStatus = processTurnStartAbilitiesAndStatuses("AI", units);
  let updatedUnits = turnStartStatus.updatedUnits;
  floatingDamages.push(...turnStartStatus.poisonDamages);
  actionLogs.push(...turnStartStatus.logs);

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
          actionsRemaining: MAX_UNIT_ACTIONS_PER_TURN,
          abilityCooldown: 0,
          usedAbilityThisTurn: false,
          statusEffects: [],
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

  // Função auxiliar para a IA tentar usar a Habilidade Única de uma criatura quando pronta
  const tryUseAiUnitAbility = (aiUnitId: string): boolean => {
    const unit = updatedUnits.find((u) => u.id === aiUnitId && u.owner === "AI");
    if (!unit) return false;
    if (
      (unit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0 ||
      (unit.abilityCooldown ?? 0) > 0
    ) {
      return false;
    }

    const ability = getCreatureAbility(unit.card.name, unit.card.type);
    if (!ability) return false;
    const validTargets = getValidAbilityTargetTiles(
      unit,
      ability,
      grid,
      updatedUnits
    );
    if (validTargets.length === 0) return false;

    const playerUnitsNow = updatedUnits.filter((u) => u.owner === "PLAYER");
    let chosenCoord: { x: number; y: number } | null = null;

    // 1. Habilidades em Área (AOE_DAMAGE / SELF_AOE / AREA_TARGET):
    // Mirar na casa que atinja o maior número possível de unidades do jogador
    if (
      ability.effectType === "AOE_DAMAGE" ||
      ability.targetType === "AREA_TARGET" ||
      (ability.targetType === "SELF_AOE" && ability.effectType !== "HEAL_BUFF")
    ) {
      let bestCount = 0;
      let bestScore = -1;

      const candidateCoords =
        ability.targetType === "SELF_AOE"
          ? [{ x: unit.x, y: unit.y }]
          : validTargets;

      for (const coord of candidateCoords) {
        const zone = getAbilityImpactZoneTiles(
          unit,
          ability,
          coord.x,
          coord.y,
          grid
        );
        const hitPlayers = playerUnitsNow.filter((pu) =>
          zone.some((z) => z.x === pu.x && z.y === pu.y)
        );
        if (hitPlayers.length > 0) {
          const score =
            hitPlayers.length * 100 +
            hitPlayers.reduce(
              (acc, pu) => acc + (pu.card.damage || 20) + pu.currentHp * 0.5,
              0
            );
          if (hitPlayers.length > bestCount || score > bestScore) {
            bestCount = hitPlayers.length;
            bestScore = score;
            chosenCoord = coord;
          }
        }
      }
    }
    // 2. Habilidades de Salto em Casa Vazia (DASH_JUMP + EMPTY_TILE):
    // Avançar em direção ao Núcleo do jogador ou escapar de bloqueios
    else if (
      ability.effectType === "DASH_JUMP" &&
      ability.targetType === "EMPTY_TILE"
    ) {
      const currentDistToCore = Math.hypot(
        unit.x - playerCore.x,
        unit.y - playerCore.y
      );
      const sorted = [...validTargets].sort((a, b) => {
        const distA = Math.hypot(a.x - playerCore.x, a.y - playerCore.y);
        const distB = Math.hypot(b.x - playerCore.x, b.y - playerCore.y);
        return distA - distB;
      });
      if (sorted.length > 0) {
        const bestJump = sorted[0];
        const newDist = Math.hypot(
          bestJump.x - playerCore.x,
          bestJump.y - playerCore.y
        );
        if (newDist < currentDistToCore - 0.5) {
          chosenCoord = bestJump;
        }
      }
    }
    // 3. Habilidades em Inimigo Único (POISON, WEB_ROOT, KNOCKBACK ou DASH_JUMP em ENEMY):
    // Priorizar a criatura do jogador com maior HP/Dano ao alcance
    else if (ability.targetType === "ENEMY") {
      const reachableEnemies = playerUnitsNow.filter((pu) =>
        validTargets.some((t) => t.x === pu.x && t.y === pu.y)
      );
      if (reachableEnemies.length > 0) {
        reachableEnemies.sort((a, b) => {
          const scoreA = a.currentHp + (a.card.damage || 25) * 2;
          const scoreB = b.currentHp + (b.card.damage || 25) * 2;
          return scoreB - scoreA;
        });
        chosenCoord = {
          x: reachableEnemies[0].x,
          y: reachableEnemies[0].y,
        };
      }
    }
    // 4. Habilidades de Cura / Buff (HEAL_BUFF)
    else if (ability.effectType === "HEAL_BUFF") {
      if (ability.targetType === "ALLY") {
        const allies = updatedUnits.filter(
          (au) =>
            au.owner === "AI" &&
            au.currentHp < au.maxHp &&
            validTargets.some((t) => t.x === au.x && t.y === au.y)
        );
        if (allies.length > 0) {
          allies.sort(
            (a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp
          );
          chosenCoord = { x: allies[0].x, y: allies[0].y };
        }
      } else if (unit.currentHp < unit.maxHp || playerUnitsNow.length > 0) {
        chosenCoord = { x: unit.x, y: unit.y };
      }
    }

    if (!chosenCoord) return false;

    const abResult = executeCreatureAbility(
      unit,
      ability,
      chosenCoord.x,
      chosenCoord.y,
      grid,
      updatedUnits
    );
    updatedUnits = abResult.updatedUnits;
    floatingDamages.push(...abResult.floatingDamages);
    abilityVfxList.push(abResult.vfx);
    actionLogs.push(`[IA] ${abResult.summaryText}`);
    return true;
  };

  // ========================================================
  // FASE 4: HABILIDADES, MOVIMENTO E ATAQUE (ATÉ 2 AÇÕES POR CRIATURA)
  // ========================================================
  const consumeAiAction = (unit: BoardUnit) => {
    const nextActions = Math.max(
      0,
      (unit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) - 1
    );
    unit.actionsRemaining = nextActions;
    unit.hasMoved = nextActions <= 0;
    unit.hasAttacked = nextActions <= 0;
  };

  const currentAiUnitIds = updatedUnits
    .filter((u) => u.owner === "AI")
    .map((u) => u.id);

  for (const aiUnitId of currentAiUnitIds) {
    // Cada criatura da IA pode executar até 2 ações no turno (Atacar, Movimentar ou Usar Habilidade, podendo repetir a mesma ação)
    for (let actionStep = 0; actionStep < MAX_UNIT_ACTIONS_PER_TURN; actionStep++) {
      let aiUnit = updatedUnits.find((u) => u.id === aiUnitId);
      if (
        !aiUnit ||
        (aiUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0
      ) {
        break;
      }

      // 1. Tenta usar Habilidade Única se estiver pronta e houver bom alvo (consome 1 ação dentro de executeCreatureAbility)
      if (tryUseAiUnitAbility(aiUnitId)) {
        continue;
      }

      aiUnit = updatedUnits.find((u) => u.id === aiUnitId);
      if (
        !aiUnit ||
        (aiUnit.actionsRemaining ?? MAX_UNIT_ACTIONS_PER_TURN) <= 0
      ) {
        break;
      }

      // 2. CHECAGEM DE ATAQUE (se houver alvo ao alcance)
      const attackTargets = getValidAttackTiles(aiUnit, grid, updatedUnits);

      // Prioridade 1: Atacar Núcleo do Jogador se estiver no alcance
      const canHitPlayerCore = attackTargets.some(
        (t) => t.x === playerCore.x && t.y === playerCore.y
      );

      if (canHitPlayerCore) {
        const damage = getEffectiveUnitDamage(aiUnit);
        playerCore.currentHp = Math.max(playerCore.currentHp - damage, 0);
        consumeAiAction(aiUnit);

        floatingDamages.push({
          id: `ai_atk_core_${Date.now()}_${aiUnit.id}_${actionStep}`,
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

      const aiEffectiveDamage = getEffectiveUnitDamage(aiUnit);
      const lethalTarget = playerUnitsInReach.find(
        (u) => u.currentHp <= aiEffectiveDamage
      );

      if (lethalTarget) {
        const shell = (lethalTarget.statusEffects || []).find(
          (s) => s.type === "GOLDEN_SHELL" && s.turnsLeft > 0
        );
        const damage = shell
          ? Math.max(1, Math.round(aiEffectiveDamage * 0.7))
          : aiEffectiveDamage;
        const reflected = shell
          ? Math.max(1, Math.round(aiEffectiveDamage * 0.5))
          : 0;

        lethalTarget.currentHp -= damage;
        if (reflected > 0) {
          aiUnit.currentHp -= reflected;
          floatingDamages.push({
            id: `ai_refl_${Date.now()}_${aiUnit.id}`,
            x: aiUnit.x,
            y: aiUnit.y,
            damage: reflected,
            label: `-${reflected} Refletido!`,
            variant: "ABILITY",
          });
        }
        consumeAiAction(aiUnit);

        floatingDamages.push({
          id: `ai_atk_lethal_${Date.now()}_${aiUnit.id}_${actionStep}`,
          x: lethalTarget.x,
          y: lethalTarget.y,
          damage,
          isFatal: lethalTarget.currentHp <= 0,
        });

        actionLogs.push(
          `[IA] "${aiUnit.card.name}" atacou "${lethalTarget.card.name}" causando ${damage} de dano!`
        );

        updatedUnits = updatedUnits.filter((u) => u.currentHp > 0);
        continue;
      }

      // Prioridade 3: Atacar inimigo no alcance com menor HP
      if (playerUnitsInReach.length > 0) {
        playerUnitsInReach.sort((a, b) => a.currentHp - b.currentHp);
        const chosenTarget = playerUnitsInReach[0];
        const shell = (chosenTarget.statusEffects || []).find(
          (s) => s.type === "GOLDEN_SHELL" && s.turnsLeft > 0
        );
        const damage = shell
          ? Math.max(1, Math.round(aiEffectiveDamage * 0.7))
          : aiEffectiveDamage;
        const reflected = shell
          ? Math.max(1, Math.round(aiEffectiveDamage * 0.5))
          : 0;

        chosenTarget.currentHp -= damage;
        if (reflected > 0) {
          aiUnit.currentHp -= reflected;
          floatingDamages.push({
            id: `ai_refl_${Date.now()}_${aiUnit.id}`,
            x: aiUnit.x,
            y: aiUnit.y,
            damage: reflected,
            label: `-${reflected} Refletido!`,
            variant: "ABILITY",
          });
        }
        consumeAiAction(aiUnit);

        floatingDamages.push({
          id: `ai_atk_focus_${Date.now()}_${aiUnit.id}_${actionStep}`,
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

      // 3. SE NÃO HÁ ALVO DE ATAQUE NO ALCANCE: MOVIMENTAR-SE INTELIGENTEMENTE (consome 1 ação)
      const validMoves = getValidMovementTiles(
        aiUnit,
        grid,
        updatedUnits,
        updatedCores
      );

      if (validMoves.length > 0) {
        if (aiUnit.card.attackType === "ARREMESSO") {
          validMoves.sort((a, b) => {
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

            return a.x - b.x;
          });

          const bestMove = validMoves[0];
          aiUnit.x = bestMove.x;
          aiUnit.y = bestMove.y;
          consumeAiAction(aiUnit);
        } else {
          validMoves.sort((a, b) => {
            const distA = Math.hypot(a.x - playerCore.x, a.y - playerCore.y);
            const distB = Math.hypot(b.x - playerCore.x, b.y - playerCore.y);
            return distA - distB;
          });

          const bestMove = validMoves[0];
          aiUnit.x = bestMove.x;
          aiUnit.y = bestMove.y;
          consumeAiAction(aiUnit);
        }
        continue;
      }

      // Sem ações válidas possíveis (ex: bloqueado/enraizado e sem alvos)
      break;
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
    abilityVfxList,
  };
}

