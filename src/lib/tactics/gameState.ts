import { Card } from "@/db/schema";
import { BoardUnit, BoardCore, GridTile } from "@/types/game";

export const MAX_MANA = 15;
export const MANA_PER_TURN = 3;
export const MAX_FIELD_UNITS_PER_PLAYER = 7;
export const MAX_HAND_SIZE = 7;

/**
 * Adiciona mana ao início do turno respeitando o teto máximo de 15
 */
export function calculateTurnMana(currentMana: number): number {
  return Math.min(currentMana + MANA_PER_TURN, MAX_MANA);
}

/**
 * Checa se o jogador pode invocar um monstro
 */
export function canSummonMonster(
  playerUnitsCount: number,
  currentMana: number,
  cardCost: number
): { canSummon: boolean; reason?: string } {
  if (playerUnitsCount >= MAX_FIELD_UNITS_PER_PLAYER) {
    return {
      canSummon: false,
      reason: `Limite de ${MAX_FIELD_UNITS_PER_PLAYER}/${MAX_FIELD_UNITS_PER_PLAYER} criaturas em campo atingido!`,
    };
  }

  if (currentMana < cardCost) {
    return {
      canSummon: false,
      reason: `Mana insuficiente! Requer ${cardCost} de Mana (atual: ${currentMana}).`,
    };
  }

  return { canSummon: true };
}

/**
 * Checa se o jogador pode lançar um feitiço
 */
export function canCastSpell(
  currentMana: number,
  cardCost: number
): { canCast: boolean; reason?: string } {
  if (currentMana < cardCost) {
    return {
      canCast: false,
      reason: `Mana insuficiente para o feitiço! Requer ${cardCost} de Mana (atual: ${currentMana}).`,
    };
  }

  return { canCast: true };
}

/**
 * Embaralha um array de cartas (Fisher-Yates Shuffle)
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Retorna os tiles válidos para conjuração de feitiço com base no efeito
 */
export function getValidSpellTargets(
  spell: Card,
  grid: GridTile[][],
  units: BoardUnit[],
  cores: BoardCore[]
): { x: number; y: number }[] {
  const valid: { x: number; y: number }[] = [];
  const effect = spell.spellEffectJson as Record<string, any> | null;
  const targetType = effect?.target || effect?.targetType || "ANY";

  // Se o feitiço for ganho de mana instantâneo ou efeito global, qualquer tile ou nenhum é válido
  if (effect?.type === "RESOURCE_GAIN" || effect?.type === "GLOBAL_BOARD_DAMAGE") {
    return [{ x: 0, y: 0 }]; // Autofire
  }

  // Se for cura ou buff de aliado
  if (targetType === "SINGLE_ALLY" || targetType === "ALLY_SINGLE" || effect?.type === "HEAL" || effect?.type === "BUFF" || effect?.type === "SHIELD") {
    // Alvo deve ser unidade aliada
    for (const u of units) {
      if (u.owner === "PLAYER") {
        valid.push({ x: u.x, y: u.y });
      }
    }
    // Também pode curar o núcleo aliado se permitido
    const playerCore = cores.find((c) => c.owner === "PLAYER");
    if (playerCore) valid.push({ x: playerCore.x, y: playerCore.y });
    return valid;
  }

  // Se for dano direto a inimigo
  if (targetType === "SINGLE_ENEMY" || effect?.type === "DIRECT_DAMAGE" || effect?.type === "DAMAGE_AND_DEBUFF" || effect?.type === "ROOT_AND_DAMAGE") {
    for (const u of units) {
      if (u.owner === "AI") {
        valid.push({ x: u.x, y: u.y });
      }
    }
    const aiCore = cores.find((c) => c.owner === "AI");
    if (aiCore) valid.push({ x: aiCore.x, y: aiCore.y });
    return valid;
  }

  // Dano em área: qualquer casa transitável dentro do grid
  for (const row of grid) {
    for (const tile of row) {
      valid.push({ x: tile.x, y: tile.y });
    }
  }

  return valid;
}

