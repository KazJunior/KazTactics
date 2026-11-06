import "dotenv/config";
import { checkGameEndCondition } from "../lib/tactics/endGame";
import { claimStageVictoryAction } from "../actions/battle";
import { BoardCore, BoardUnit } from "../types/game";
import { Card } from "../db/schema";
import { db } from "./index";
import { users } from "./schema";

async function testLoopVictory() {
  console.log("🧪 [Teste Automatizado] Iniciando validação do Loop da Partida e Condições de Vitória/Derrota (Etapa 8)...");

  const playerCoreAlive: BoardCore = {
    owner: "PLAYER",
    name: "Núcleo Aliado",
    x: 0,
    y: 3,
    currentHp: 1000,
    maxHp: 1000,
  };

  const aiCoreAlive: BoardCore = {
    owner: "AI",
    name: "Núcleo da IA",
    x: 10,
    y: 3,
    currentHp: 300,
    maxHp: 300,
  };

  const dummyUnit: BoardUnit = {
    id: "unit-1",
    card: { name: "Lobo", category: "MONSTRO" } as Card,
    owner: "PLAYER",
    x: 2,
    y: 2,
    currentHp: 50,
    maxHp: 50,
    hasMoved: false,
    hasAttacked: false,
  };

  // TESTE 1: Condição 1 - Destruição do Núcleo da IA
  console.log("\n🧪 Teste 1: Destruição do Núcleo da IA (aiCore.hp = 0)...");
  const aiCoreDestroyed = { ...aiCoreAlive, currentHp: 0 };
  const victoryByCore = checkGameEndCondition(
    playerCoreAlive,
    aiCoreDestroyed,
    [dummyUnit],
    [],
    [],
    [],
    2
  );
  console.log("   Resultado:", victoryByCore);
  if (!victoryByCore.isGameOver || victoryByCore.winner !== "PLAYER") {
    throw new Error("Deveria detectar vitória imediata por destruição do Núcleo da IA!");
  }
  console.log("   ✅ Teste 1 aprovado: Vitória por destruição de Núcleo validada.");

  // TESTE 2: Condição 1 - Destruição do Núcleo do Jogador
  console.log("\n🧪 Teste 2: Destruição do Núcleo do Jogador (playerCore.hp = 0)...");
  const playerCoreDestroyed = { ...playerCoreAlive, currentHp: 0 };
  const defeatByCore = checkGameEndCondition(
    playerCoreDestroyed,
    aiCoreAlive,
    [dummyUnit],
    [],
    [],
    [],
    2
  );
  console.log("   Resultado:", defeatByCore);
  if (!defeatByCore.isGameOver || defeatByCore.winner !== "AI") {
    throw new Error("Deveria detectar derrota imediata por destruição do Núcleo Aliado!");
  }
  console.log("   ✅ Teste 2 aprovado: Derrota por destruição de Núcleo validada.");

  // TESTE 3: Condição 2 - Extermínio Total das Criaturas do Jogador (sem reforços)
  console.log("\n🧪 Teste 3: Extermínio Total das Criaturas do Jogador (sem reforços)...");
  const defeatByWipe = checkGameEndCondition(
    playerCoreAlive,
    aiCoreAlive,
    [], // 0 criaturas em campo
    [dummyUnit],
    [], // 0 monstros na mão
    [], // 0 monstros no deck
    3
  );
  console.log("   Resultado:", defeatByWipe);
  if (!defeatByWipe.isGameOver || defeatByWipe.winner !== "AI") {
    throw new Error("Deveria detectar derrota por extermínio completo de criaturas!");
  }
  console.log("   ✅ Teste 3 aprovado: Derrota por extermínio de tropas validada.");

  // TESTE 4: Persistência de Recompensa de Ouro no NeonDB
  console.log("\n🧪 Teste 4: Reivindicar Ouro da Vitória e persistir no NeonDB...");
  const [initialUser] = await db.select().from(users).limit(1);
  const rewardResult = await claimStageVictoryAction(1);
  console.log("   Resultado do crédito no NeonDB:", rewardResult);
  if (!rewardResult.success || !rewardResult.newGold) {
    throw new Error(`Falha ao creditar vitória no banco: ${rewardResult.error}`);
  }
  console.log(`   💰 Ouro anterior: ${initialUser.gold} -> Novo Ouro: ${rewardResult.newGold} (+${rewardResult.rewardEarned})`);
  console.log("   ✅ Teste 4 aprovado: Recompensa de ouro creditada com sucesso no NeonDB!");

  console.log("\n🎉 Todos os testes do Loop de Partida e Vitória (Etapa 8) foram concluídos com 100% de sucesso!");
}

testLoopVictory()
  .then(() => {
    setTimeout(() => process.exit(0), 100);
  })
  .catch((err) => {
    console.error("❌ Erro no teste do loop de vitória:", err);
    setTimeout(() => process.exit(1), 100);
  });
