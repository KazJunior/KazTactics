import { BoardCore, BoardUnit } from "@/types/game";
import { Card } from "@/db/schema";

export type GameOverWinner = "PLAYER" | "AI";

export interface GameOverState {
  isGameOver: boolean;
  winner?: GameOverWinner;
  reason?: string;
  conditionType?: "CORE_DESTROYED" | "ARMY_EXTERMINATED";
}

/**
 * Verificador contínuo das condições de fim de jogo
 * - Condição 1: Destruição do Núcleo (HP <= 0)
 * - Condição 2: Extermínio Total de Criaturas (sem unidades e sem monstros para invocar)
 */
export function checkGameEndCondition(
  playerCore: BoardCore,
  aiCore: BoardCore,
  playerUnits: BoardUnit[],
  aiUnits: BoardUnit[],
  playerHand: Card[],
  playerDeck: Card[],
  turnNumber: number
): GameOverState {
  // ========================================================
  // CONDIÇÃO 1: DESTRUIÇÃO DO NÚCLEO (CORE DESTROYED)
  // ========================================================
  if (playerCore.currentHp <= 0) {
    return {
      isGameOver: true,
      winner: "AI",
      reason: "Seu Núcleo Primordial foi totalmente destruído pelo adversário!",
      conditionType: "CORE_DESTROYED",
    };
  }

  if (aiCore.currentHp <= 0) {
    return {
      isGameOver: true,
      winner: "PLAYER",
      reason: "O Núcleo da IA foi pulverizado! Vitória gloriosa!",
      conditionType: "CORE_DESTROYED",
    };
  }

  // ========================================================
  // CONDIÇÃO 2: EXTERMÍNIO TOTAL DE CRIATURAS (ARMY WIPE)
  // ========================================================

  // Verificar se o jogador tem criaturas vivas ou invocáveis
  const playerAliveUnitsCount = playerUnits.filter((u) => u.currentHp > 0).length;
  const playerMonstersInHand = playerHand.filter((c) => c.category === "MONSTRO").length;
  const playerMonstersInDeck = playerDeck.filter((c) => c.category === "MONSTRO").length;
  const totalPlayerMonstersAvailable = playerMonstersInHand + playerMonstersInDeck;

  // Se o jogador não tiver criaturas no campo e nenhuma nos reforços (mão/baralho), e o jogo já iniciou
  if (playerAliveUnitsCount === 0 && totalPlayerMonstersAvailable === 0 && turnNumber >= 2) {
    return {
      isGameOver: true,
      winner: "AI",
      reason: "Extermínio Total: Todas as suas criaturas caíram em combate e não restam reforços!",
      conditionType: "ARMY_EXTERMINATED",
    };
  }

  // Verificar se as criaturas da IA foram totalmente exterminadas
  const aiAliveUnitsCount = aiUnits.filter((u) => u.currentHp > 0).length;
  if (aiAliveUnitsCount === 0 && turnNumber >= 3) {
    return {
      isGameOver: true,
      winner: "PLAYER",
      reason: "Extermínio Total: Todas as criaturas do exército inimigo foram aniquiladas!",
      conditionType: "ARMY_EXTERMINATED",
    };
  }

  return {
    isGameOver: false,
  };
}

