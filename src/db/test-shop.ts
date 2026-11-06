import "dotenv/config";
import { buyPackAction, getPlayerShopData } from "../actions/shop";

async function testShop() {
  console.log("🧪 [Teste Automatizado] Iniciando teste da Loja e Gacha System...");

  // 1. Estado inicial
  const initialState = await getPlayerShopData();
  if (!initialState) {
    throw new Error("Jogador não encontrado!");
  }

  console.log(`👤 Jogador: ${initialState.user.username}`);
  console.log(`💰 Saldo Inicial: ${initialState.user.gold} Ouro`);
  console.log(`📦 Tipos de Cartas na Coleção: ${initialState.totalOwnedCards}`);

  // 2. Comprar Pacote Padrão (100 Ouro)
  console.log("🛒 Comprando Pacote Tático Padrão (100 Ouro)...");
  const result = await buyPackAction("STANDARD");

  if (!result.success) {
    throw new Error(`Falha na compra: ${result.error}`);
  }

  console.log(`✅ Compra efetuada com sucesso!`);
  console.log(`💰 Saldo Restante: ${result.remainingGold} Ouro`);
  console.log("🎴 5 Cartas Sorteadas no Pacote:");

  result.cards.forEach((card, index) => {
    console.log(
      `   [${index + 1}] ${card.name} | Raridade: ${card.rarity} | Categoria: ${card.category} | Tipo: ${card.type} | Mana: ${card.manaCost} | Quantidade Atual na Coleção: ${card.newQuantity}x (${card.isNew ? "✨ NOVA" : "CÓPIA ADICIONAL"})`
    );
  });

  // 3. Validação das 5 cartas
  if (result.cards.length !== 5) {
    throw new Error(`Esperado 5 cartas, mas recebeu ${result.cards.length}`);
  }

  if (result.remainingGold !== initialState.user.gold - 100) {
    throw new Error(
      `Dedução de ouro incorreta! Esperado ${initialState.user.gold - 100}, obtido ${result.remainingGold}`
    );
  }

  console.log("🎉 Teste da Loja e Gacha System validado com 100% de sucesso!");
}

testShop()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro no teste da loja:", err);
    process.exit(1);
  });

