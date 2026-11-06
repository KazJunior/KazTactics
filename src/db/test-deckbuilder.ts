import "dotenv/config";
import { getDeckbuilderData, saveDeckAction } from "../actions/deck";

async function testDeckbuilder() {
  console.log("🧪 [Teste Automatizado] Iniciando validação do Deckbuilder...");

  const data = await getDeckbuilderData();
  if (!data) throw new Error("Dados do Deckbuilder não encontrados.");

  console.log(`👤 Jogador: ${data.user.username}`);
  console.log(`📦 Cartas na Coleção: ${data.collection.length} tipos`);

  const monsters = data.collection.filter((c) => c.card.category === "MONSTRO");
  const spells = data.collection.filter((c) => c.card.category === "FEITICO");

  // TESTE 1: Baralho com menos de 30 cartas (ex: 28 cartas)
  console.log("\n🧪 Teste 1: Tentar salvar baralho com 28 cartas (deve falhar)...");
  const invalidCountPayload = [
    ...monsters.slice(0, 10).map((m) => ({ cardId: m.card.id, quantity: 2 })), // 20 monstros
    ...spells.slice(0, 4).map((s) => ({ cardId: s.card.id, quantity: 2 })),     // 8 feitiços = 28 total
  ];
  const res1 = await saveDeckAction({
    name: "Baralho Incompleto",
    cards: invalidCountPayload,
  });
  console.log("   Resultado:", res1);
  if (res1.success) throw new Error("Falha esperada no Teste 1, mas o deck foi aceito!");
  console.log("   ✅ Teste 1 passou: Baralho com 28 cartas rejeitado com sucesso.");

  // TESTE 2: Baralho com 30 cartas, mas proporção errada (18 monstros e 12 feitiços)
  console.log("\n🧪 Teste 2: Tentar salvar baralho com 18 monstros e 12 feitiços (deve falhar)...");
  const invalidRatioPayload = [
    ...monsters.slice(0, 9).map((m) => ({ cardId: m.card.id, quantity: 2 })),  // 18 monstros
    ...spells.slice(0, 6).map((s) => ({ cardId: s.card.id, quantity: 2 })),   // 12 feitiços = 30 total
  ];
  const res2 = await saveDeckAction({
    name: "Baralho Proporção Errada",
    cards: invalidRatioPayload,
  });
  console.log("   Resultado:", res2);
  if (res2.success) throw new Error("Falha esperada no Teste 2, mas o deck foi aceito!");
  console.log("   ✅ Teste 2 passou: Proporção inválida de monstros/feitiços rejeitada com sucesso.");

  // TESTE 3: Baralho Válido (Exatamente 30 cartas: 20 monstros e 10 feitiços)
  console.log("\n🧪 Teste 3: Salvar baralho válido (20 monstros + 10 feitiços)...");
  const validPayload = [
    ...monsters.slice(0, 10).map((m) => ({ cardId: m.card.id, quantity: 2 })), // 20 monstros
    ...spells.slice(0, 5).map((s) => ({ cardId: s.card.id, quantity: 2 })),     // 10 feitiços = 30 total
  ];
  const res3 = await saveDeckAction({
    name: "Baralho Supremo Válido (30 Cartas)",
    cards: validPayload,
  });
  console.log("   Resultado:", res3);
  if (!res3.success) throw new Error(`Falha no Teste 3: ${res3.error}`);
  console.log("   ✅ Teste 3 passou: Baralho válido salvo e persistido com sucesso no NeonDB!");

  console.log("\n🎉 Todos os testes de validação do Deckbuilder passaram com 100% de sucesso!");
}

testDeckbuilder()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro no teste do deckbuilder:", err);
    process.exit(1);
  });

