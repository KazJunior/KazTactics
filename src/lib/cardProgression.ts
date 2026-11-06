import { Card } from "@/db/schema";
import { Rarity, PackKind } from "@/types";

export const MAX_CARD_LEVEL = 10;
export const STAT_BONUS_PER_LEVEL = 0.10; // +10% por nível acima do nível 1

export interface LevelUpgradeRequirement {
  fromLevel: number;
  toLevel: number;
  copiesRequired: number;
  goldCost: number;
}

/**
 * Tabela progressiva de evolução estilo Clash Royale (Nível 1 até Nível 10).
 * Nível 1 -> 2 exige exatamente 2 cópias e aumenta progressivamente até o Nível 10.
 */
export const LEVEL_UPGRADE_TABLE: Record<number, LevelUpgradeRequirement> = {
  1: { fromLevel: 1, toLevel: 2, copiesRequired: 2, goldCost: 50 },
  2: { fromLevel: 2, toLevel: 3, copiesRequired: 4, goldCost: 100 },
  3: { fromLevel: 3, toLevel: 4, copiesRequired: 8, goldCost: 200 },
  4: { fromLevel: 4, toLevel: 5, copiesRequired: 12, goldCost: 400 },
  5: { fromLevel: 5, toLevel: 6, copiesRequired: 20, goldCost: 750 },
  6: { fromLevel: 6, toLevel: 7, copiesRequired: 35, goldCost: 1250 },
  7: { fromLevel: 7, toLevel: 8, copiesRequired: 55, goldCost: 2000 },
  8: { fromLevel: 8, toLevel: 9, copiesRequired: 85, goldCost: 3500 },
  9: { fromLevel: 9, toLevel: 10, copiesRequired: 120, goldCost: 5000 },
};

/**
 * Retorna os requisitos (cópias e ouro) para evoluir a carta do nível atual para o próximo.
 * Retorna null se a carta já estiver no nível máximo (10).
 */
export function getUpgradeRequirement(
  currentLevel: number
): LevelUpgradeRequirement | null {
  const clamped = Math.max(1, Math.min(MAX_CARD_LEVEL, currentLevel));
  if (clamped >= MAX_CARD_LEVEL) return null;
  return LEVEL_UPGRADE_TABLE[clamped] || null;
}

/**
 * Sorteia quantas cópias de uma carta vêm em um slot de pacote com base na raridade
 * (estilo baús do Clash Royale: cartas comuns/incomuns vêm em maior quantidade).
 */
export function rollPackCopiesByRarity(
  rarity: Rarity,
  packType: PackKind = "BASIC"
): number {
  const tierBonus =
    packType === "SUPREME"
      ? 2
      : packType === "ADVANCED" || packType === "MYSTIC"
      ? 1
      : 0;

  switch (rarity) {
    case "COMUM":
      // 4 a 9 cópias por slot comum
      return Math.floor(Math.random() * 6) + 4 + tierBonus;
    case "INCOMUM":
      // 3 a 6 cópias por slot incomum
      return Math.floor(Math.random() * 4) + 3 + tierBonus;
    case "RARO":
      // 2 a 4 cópias por slot raro
      return Math.floor(Math.random() * 3) + 2 + tierBonus;
    case "EPICO":
      // 1 a 3 cópias por slot épico (mais cópias no Pacote Supremo)
      return Math.floor(Math.random() * 2) + 1 + tierBonus;
    case "LENDARIO":
      // 1 a 2 cópias por slot lendário
      return packType === "SUPREME" && Math.random() < 0.5
        ? 2
        : (packType === "ADVANCED" || packType === "MYSTIC") &&
          Math.random() < 0.25
        ? 2
        : 1;
    default:
      return 2;
  }
}

/**
 * Retorna o multiplicador de atributos para um determinado nível (+10% por nível acima de 1).
 * Ex: Nível 1 = 1.00 (100%), Nível 2 = 1.10 (110%), ..., Nível 10 = 1.90 (190%).
 */
export function getLevelStatMultiplier(level: number): number {
  const effectiveLevel = Math.max(1, Math.min(MAX_CARD_LEVEL, level || 1));
  return 1 + (effectiveLevel - 1) * STAT_BONUS_PER_LEVEL;
}

/**
 * Calcula um valor numérico escalado em +10% por nível acima do 1.
 */
export function scaleStatByLevel(
  baseValue: number | null | undefined,
  level: number
): number | null {
  if (baseValue === null || baseValue === undefined) return null;
  const effectiveLevel = Math.max(1, Math.min(MAX_CARD_LEVEL, level || 1));
  if (effectiveLevel <= 1) return baseValue;
  const multiplier = getLevelStatMultiplier(effectiveLevel);
  return Math.max(baseValue + (effectiveLevel - 1), Math.round(baseValue * multiplier));
}

export interface ScaledCard extends Card {
  level?: number;
  baseHp?: number | null;
  baseDamage?: number | null;
}

/**
 * Aplica o escalonamento de +10% por nível aos status da carta (HP, Dano e Feitiços).
 */
export function applyCardLevelScaling(card: Card, level = 1): ScaledCard {
  const effectiveLevel = Math.max(1, Math.min(MAX_CARD_LEVEL, level || 1));
  const baseHp = (card as ScaledCard).baseHp ?? card.hp;
  const baseDamage = (card as ScaledCard).baseDamage ?? card.damage;

  const scaledHp = scaleStatByLevel(baseHp, effectiveLevel);
  const scaledDamage = scaleStatByLevel(baseDamage, effectiveLevel);

  let scaledSpellEffect = card.spellEffectJson;
  if (
    card.category === "FEITICO" &&
    card.spellEffectJson &&
    typeof card.spellEffectJson === "object"
  ) {
    const rawEffect = card.spellEffectJson as Record<string, any>;
    const nextEffect = { ...rawEffect };
    if (typeof rawEffect.damage === "number") {
      const baseSpellDmg = rawEffect.baseDamage ?? rawEffect.damage;
      nextEffect.baseDamage = baseSpellDmg;
      nextEffect.damage = scaleStatByLevel(baseSpellDmg, effectiveLevel);
    }
    if (typeof rawEffect.healAmount === "number") {
      const baseSpellHeal = rawEffect.baseHealAmount ?? rawEffect.healAmount;
      nextEffect.baseHealAmount = baseSpellHeal;
      nextEffect.healAmount = scaleStatByLevel(baseSpellHeal, effectiveLevel);
    }
    scaledSpellEffect = nextEffect;
  }

  return {
    ...card,
    hp: scaledHp,
    damage: scaledDamage,
    spellEffectJson: scaledSpellEffect,
    level: effectiveLevel,
    baseHp,
    baseDamage,
  };
}

