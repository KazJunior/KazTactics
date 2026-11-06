import "dotenv/config";
import { executeAiTurn } from "../lib/tactics/aiEngine";
import { createDefaultGrid } from "../lib/tactics/grid";
import { BoardUnit, BoardCore } from "../types/game";
import { Card } from "../db/schema";

async function testAiEngine() {
  console.log("🧪 [Teste Automatizado] Iniciando validação do Motor de IA PvE (Etapa 9)...");

  const grid = createDefaultGrid();

  const playerCore: BoardCore = {
    owner: "PLAYER",
    name: "Núcleo Aliado",
    x: 0,
    y: 3,
    currentHp: 1000,
    maxHp: 1000,
  };

  const aiCore: BoardCore = {
    owner: "AI",
    name: "Núcleo da IA",
    x: 10,
    y: 3,
    currentHp: 300,
    maxHp: 300,
  };

  const catapultCard: Card = {
    id: "card-catapult",
    name: "Catapulta a Vapor",
    description: "Arremesso balístico.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 4,
    hp: 120,
    damage: 60,
    movementTiles: 1,
    rangeTiles: 4,
    attackType: "ARREMESSO",
    spriteUrl: "",
    createdAt: new Date(),
    spellEffectJson: null,
  };

  const spellCard: Card = {
    id: "card-fireball",
    name: "Bola de Fogo",
    description: "Dano direto.",
    rarity: "COMUM",
    category: "FEITICO",
    type: "FEITICOS",
    manaCost: 2,
    hp: null,
    damage: 40,
    movementTiles: null,
    rangeTiles: 4,
    attackType: null,
    spriteUrl: "",
    createdAt: new Date(),
    spellEffectJson: { type: "DIRECT_DAMAGE", damage: 40 },
  };

  // TESTE 1: Invocação e Feitiços da IA com Mana
  console.log("\n🧪 Teste 1: Gestão de Mana e Invocação da IA...");
  const initialHand = [catapultCard, spellCard];
  const initialDeck = [catapultCard];

  const res1 = executeAiTurn(
    3, // Começa com 3 -> ganha +3 = 6 de Mana
    initialHand,
    initialDeck,
    [],
    [playerCore, aiCore],
    grid,
    1
  );

  console.log("   Mana da IA após turno:", res1.nextAiMana);
  console.log("   Unidades criadas pela IA:", res1.updatedUnits.length);
  console.log("   Ações executadas pela IA:", res1.actionLogs);

  if (res1.updatedUnits.length === 0) {
    throw new Error("IA deveria ter invocado a Catapulta a Vapor!");
  }
  console.log("   ✅ Teste 1 aprovado: IA geriu mana e invocou unidade.");

  // TESTE 2: Heurística Tática - Ataque Letal Prioritário
  console.log("\n🧪 Teste 2: Heurística Tática - Eliminar criatura com dano letal...");
  const aiAttacker: BoardUnit = {
    id: "ai-unit-1",
    card: catapultCard,
    owner: "AI",
    x: 5,
    y: 3,
    currentHp: 120,
    maxHp: 120,
    hasMoved: false,
    hasAttacked: false,
  };

  const playerWeakUnit: BoardUnit = {
    id: "player-weak",
    card: { name: "Recruta Ferido", damage: 15 } as Card,
    owner: "PLAYER",
    x: 3,
    y: 3,
    currentHp: 30, // Menor que o dano de 60 da catapulta!
    maxHp: 80,
    hasMoved: false,
    hasAttacked: false,
  };

  const res2 = executeAiTurn(
    4,
    [],
    [],
    [aiAttacker, playerWeakUnit],
    [playerCore, aiCore],
    grid,
    2
  );

  console.log("   Ações da IA:", res2.actionLogs);
  const isWeakUnitAlive = res2.updatedUnits.some((u) => u.id === playerWeakUnit.id);
  console.log("   Criatura fraca sobreviveu?", isWeakUnitAlive ? "Sim" : "Não (Eliminada)");

  if (isWeakUnitAlive) {
    throw new Error("IA deveria ter eliminado a unidade com dano letal!");
  }
  console.log("   ✅ Teste 2 aprovado: IA priorizou golpe letal e eliminou o alvo.");

  console.log("\n🎉 Todos os testes da Inteligência Artificial PvE foram aprovados com 100% de sucesso!");
}

testAiEngine()
  .then(() => {
    setTimeout(() => process.exit(0), 100);
  })
  .catch((err) => {
    console.error("❌ Erro no teste da IA:", err);
    setTimeout(() => process.exit(1), 100);
  });

