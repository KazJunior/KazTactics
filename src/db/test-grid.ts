import "dotenv/config";
import {
  createDefaultGrid,
  getValidMovementTiles,
  getValidAttackTiles,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../lib/tactics/grid";
import { BoardUnit, BoardCore } from "../types/game";
import { Card } from "../db/schema";

async function testGridTactics() {
  console.log("🧪 [Teste Automatizado] Iniciando testes do Motor de Tabuleiro Tático...");

  // 1. Validar Dimensões do Grid
  const grid = createDefaultGrid();
  console.log(`📐 Grid inicializado: ${grid[0].length} colunas x ${grid.length} linhas.`);

  if (grid.length !== BOARD_HEIGHT || grid[0].length !== BOARD_WIDTH) {
    throw new Error(`Dimensões incorretas! Esperado ${BOARD_WIDTH}x${BOARD_HEIGHT}, obtido ${grid[0].length}x${grid.length}`);
  }

  // 2. Mock de Cartas (Line of Sight vs Arremesso)
  const losCard: Card = {
    id: "card-los",
    name: "Arqueiro de Precisão",
    description: "Tiro direto em linha de visão.",
    rarity: "COMUM",
    category: "MONSTRO",
    type: "HUMANOIDES",
    manaCost: 3,
    hp: 60,
    damage: 35,
    movementTiles: 2,
    rangeTiles: 4,
    attackType: "LINE_OF_SIGHT",
    spriteUrl: "",
    createdAt: new Date(),
    spellEffectJson: null,
  };

  const mortarCard: Card = {
    id: "card-mortar",
    name: "Catapulta de Arremesso",
    description: "Arremessa por cima de obstáculos.",
    rarity: "RARO",
    category: "MONSTRO",
    type: "MECANICOS",
    manaCost: 4,
    hp: 100,
    damage: 50,
    movementTiles: 1,
    rangeTiles: 4,
    attackType: "ARREMESSO",
    spriteUrl: "",
    createdAt: new Date(),
    spellEffectJson: null,
  };

  // Posicionar obstáculo em (4, 3)
  // Posicionar atiradores em (2, 3) e o alvo atrás do obstáculo em (5, 3)
  const cores: BoardCore[] = [
    { owner: "PLAYER", name: "Player Core", x: 0, y: 3, currentHp: 1000, maxHp: 1000 },
    { owner: "AI", name: "AI Core", x: 10, y: 3, currentHp: 500, maxHp: 500 },
  ];

  const losUnit: BoardUnit = {
    id: "unit-los",
    card: losCard,
    owner: "PLAYER",
    x: 2,
    y: 3,
    currentHp: 60,
    maxHp: 60,
    hasMoved: false,
    hasAttacked: false,
  };

  const mortarUnit: BoardUnit = {
    id: "unit-mortar",
    card: mortarCard,
    owner: "PLAYER",
    x: 2,
    y: 3,
    currentHp: 100,
    maxHp: 100,
    hasMoved: false,
    hasAttacked: false,
  };

  const dummyTarget: BoardUnit = {
    id: "unit-target",
    card: losCard,
    owner: "AI",
    x: 5,
    y: 3,
    currentHp: 60,
    maxHp: 60,
    hasMoved: false,
    hasAttacked: false,
  };

  const allUnits = [losUnit, dummyTarget];

  // 3. Teste de Movimento BFS
  const moveTiles = getValidMovementTiles(losUnit, grid, allUnits, cores);
  console.log(`👣 Casas válidas de movimento para ${losUnit.card.name} (2 casas de movimento): ${moveTiles.length}`);
  // Não pode incluir obstáculos (4,3) nem o próprio núcleo (0,3)
  const movesObstacle = moveTiles.some((t) => t.x === 4 && t.y === 3);
  const movesCore = moveTiles.some((t) => t.x === 0 && t.y === 3);
  if (movesObstacle || movesCore) {
    throw new Error("Falha no BFS: Unidade pode se mover para casa bloqueada!");
  }
  console.log("   ✅ Teste de Movimento BFS aprovado: Obstáculos e Núcleos respeitados.");

  // 4. Teste Comparativo: Line of Sight vs Arremesso
  // Obstáculo está em (4,3), o alvo está em (5,3)
  const losAttackTiles = getValidAttackTiles(losUnit, grid, allUnits);
  const mortarAttackTiles = getValidAttackTiles(mortarUnit, grid, allUnits);

  const losHitsTarget = losAttackTiles.some((t) => t.x === 5 && t.y === 3);
  const mortarHitsTarget = mortarAttackTiles.some((t) => t.x === 5 && t.y === 3);

  console.log(`🎯 Line of Sight atinge o alvo atrás do obstáculo em (5,3)? ${losHitsTarget ? "SIM (Falha)" : "NÃO (Correto: Bloqueado)"}`);
  console.log(`🏹 Arremesso atinge o alvo atrás do obstáculo em (5,3)? ${mortarHitsTarget ? "SIM (Correto: Por cima)" : "NÃO (Falha)"}`);

  if (losHitsTarget) {
    throw new Error("Falha na Linha de Visão: Ataque direto não foi bloqueado pelo obstáculo em (4,3)!");
  }
  if (!mortarHitsTarget) {
    throw new Error("Falha no Arremesso: Ataque balístico deveria alcançar o alvo sobre o obstáculo!");
  }

  console.log("   ✅ Teste de Linha de Visão vs Arremesso aprovado com 100% de precisão física!");
  console.log("\n🎉 Todos os testes do motor de tabuleiro tático foram concluídos com sucesso!");
}

testGridTactics()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro no teste do grid:", err);
    process.exit(1);
  });

