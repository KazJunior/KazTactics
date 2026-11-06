import "dotenv/config";
import {
  calculateTurnMana,
  canSummonMonster,
  canCastSpell,
  MAX_MANA,
  MAX_FIELD_UNITS_PER_PLAYER,
  MANA_PER_TURN,
} from "../lib/tactics/gameState";

async function testGameStateEngine() {
  console.log("🧪 [Teste Automatizado] Iniciando validação do Game State Engine (Etapa 6)...");

  // 1. Teste da Economia de Mana (+3 por turno e teto de 15)
  console.log("\n🧪 Teste 1: Economia de Mana (+3 por turno e limite máximo de 15)...");
  let mana = 0;
  for (let turn = 1; turn <= 7; turn++) {
    mana = calculateTurnMana(mana);
    console.log(`   Turno ${turn}: Mana = ${mana} / ${MAX_MANA}`);
  }

  if (mana !== 15) {
    throw new Error(`Teto de mana violado! Esperado 15, obtido ${mana}`);
  }

  // Tentar ultrapassar 15
  const overflowMana = calculateTurnMana(15);
  if (overflowMana > 15) {
    throw new Error(`Mana ultrapassou 15! Obtido ${overflowMana}`);
  }
  console.log("   ✅ Teste 1 aprovado: Ganho de +3 por turno e teto absoluto de 15 respeitados.");

  // 2. Teste do Limite de 7 Criaturas em Campo
  console.log("\n🧪 Teste 2: Limite estrito de 7/7 criaturas vivas no tabuleiro...");
  const summonUnderLimit = canSummonMonster(6, 10, 4);
  console.log("   Invocação com 6 criaturas em campo:", summonUnderLimit);
  if (!summonUnderLimit.canSummon) {
    throw new Error("Deveria permitir invocação com 6 criaturas em campo!");
  }

  const summonAtLimit = canSummonMonster(7, 10, 4);
  console.log("   Invocação com 7 criaturas em campo:", summonAtLimit);
  if (summonAtLimit.canSummon) {
    throw new Error("Deveria bloquear invocação com 7 criaturas em campo!");
  }
  console.log("   ✅ Teste 2 aprovado: Bloqueio estrito de 7/7 criaturas funcionando perfeitamente.");

  // 3. Teste de Feitiços a Qualquer Momento (Não bloqueados pelo limite de campo)
  console.log("\n🧪 Teste 3: Feitiços liberados a qualquer momento independente do limite de criaturas...");
  const spellCheck = canCastSpell(10, 5);
  console.log("   Conjuração de feitiço com 10 de mana:", spellCheck);
  if (!spellCheck.canCast) {
    throw new Error("Feitiço deveria ser liberado com mana suficiente!");
  }

  const spellNoMana = canCastSpell(2, 5);
  console.log("   Conjuração de feitiço sem mana:", spellNoMana);
  if (spellNoMana.canCast) {
    throw new Error("Feitiço sem mana deveria ser bloqueado!");
  }
  console.log("   ✅ Teste 3 aprovado: Feitiços podem ser conjurados a qualquer momento tendo mana.");

  console.log("\n🎉 Todos os testes da Etapa 6 foram aprovados com 100% de sucesso!");
}

testGameStateEngine()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro no teste do Game State Engine:", err);
    process.exit(1);
  });

