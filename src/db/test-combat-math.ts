import "dotenv/config";
import {
  getBresenhamLine,
  checkLineOfSight,
  checkArremesso,
} from "../lib/tactics/combat";
import { createDefaultGrid } from "../lib/tactics/grid";
import { BoardUnit } from "../types/game";
import { Card } from "../db/schema";

async function testCombatMath() {
  console.log("🧪 [Teste Automatizado] Iniciando validação de Combate, Line of Sight e Arremesso (Etapa 7)...");

  // 1. Teste da Reta de Bresenham
  console.log("\n🧪 Teste 1: Traçado de Reta de Bresenham 2D...");
  const line = getBresenhamLine(1, 1, 5, 1);
  console.log("   Caminho gerado entre (1,1) e (5,1):", line);
  if (line.length !== 5 || line[0].x !== 1 || line[4].x !== 5) {
    throw new Error("Erro no traçado de linha de Bresenham!");
  }
  console.log("   ✅ Teste 1 aprovado: Traçado de reta discreta preciso.");

  // 2. Teste de Bloqueio de Linha de Visão por Obstáculo
  console.log("\n🧪 Teste 2: Bloqueio estrito de Linha de Visão por Obstáculo...");
  const grid = createDefaultGrid();
  // No grid padrão, (4,3) é um OBSTACLE
  const losTestWithObstacle = checkLineOfSight(2, 3, 6, 3, grid, []);
  console.log("   Linha de visão entre (2,3) e (6,3) com obstáculo em (4,3):", losTestWithObstacle);
  if (!losTestWithObstacle.isBlocked || losTestWithObstacle.blockedAt?.reason !== "OBSTACLE") {
    throw new Error("Deveria bloquear a linha de visão no obstáculo em (4,3)!");
  }
  console.log("   ✅ Teste 2 aprovado: Obstáculo bloqueou corretamente a linha de visão.");

  // 3. Teste de Bloqueio de Linha de Visão por Outra Criatura Intermediária
  console.log("\n🧪 Teste 3: Bloqueio de Linha de Visão por criatura na linha de tiro...");
  const intermediateUnit: BoardUnit = {
    id: "blocker",
    card: { name: "Guarda" } as Card,
    owner: "PLAYER",
    x: 3,
    y: 0, // Célula vazia no topo (y=0) para testar bloqueio puramente por unidade
    currentHp: 50,
    maxHp: 50,
    hasMoved: false,
    hasAttacked: false,
  };
  const losTestWithUnit = checkLineOfSight(1, 0, 5, 0, grid, [intermediateUnit]);
  console.log("   Linha de visão com criatura em (3,0):", losTestWithUnit);
  if (!losTestWithUnit.isBlocked || losTestWithUnit.blockedAt?.reason !== "UNIT") {
    throw new Error("Deveria bloquear a linha de visão devido à criatura intermediária em (3,0)!");
  }
  console.log("   ✅ Teste 3 aprovado: Criatura intermediária bloqueou a linha de tiro.");

  // 4. Teste de Arremesso (Ataque em Arco que ignora obstáculos)
  console.log("\n🧪 Teste 4: Ataque de Arremesso ignorando obstáculos e criaturas...");
  const arremessoTest = checkArremesso(2, 3, 6, 3, 5);
  console.log("   Arremesso entre (2,3) e (6,3) com alcance 5:", arremessoTest);
  if (!arremessoTest.isPossible) {
    throw new Error("Arremesso deveria ser possível mesmo com obstáculo intermediário!");
  }
  console.log("   ✅ Teste 4 aprovado: Ataque de arremesso ultrapassa coberturas com sucesso.");

  console.log("\n🎉 Todos os testes de Combate e Trajetórias da Etapa 7 foram aprovados com 100% de sucesso!");
}

testCombatMath()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro nos testes de combate:", err);
    process.exit(1);
  });
