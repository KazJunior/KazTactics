import "dotenv/config";
import { db } from "./index";
import { cards, campaignStages, decks, deckCards, userCards, users } from "./schema";
import { eq, sql } from "drizzle-orm";

async function verify() {
  console.log("🔍 Verificando integridade das tabelas no NeonDB...");

  await db.execute(
    sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_card_name" varchar(120) DEFAULT 'Lobo Cinzento Caçador' NOT NULL`
  );

  const [totalCards] = await db.select({ count: sql<number>`count(*)` }).from(cards);
  const [totalStages] = await db.select({ count: sql<number>`count(*)` }).from(campaignStages);
  const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [totalUserCards] = await db.select({ count: sql<number>`count(*)` }).from(userCards);

  const activeDeck = await db
    .select()
    .from(decks)
    .where(eq(decks.isActive, true))
    .limit(1);

  if (!activeDeck[0]) {
    throw new Error("Nenhum deck ativo encontrado!");
  }

  const deckList = await db
    .select({
      name: cards.name,
      category: cards.category,
      quantity: deckCards.quantity,
    })
    .from(deckCards)
    .innerJoin(cards, eq(deckCards.cardId, cards.id))
    .where(eq(deckCards.deckId, activeDeck[0].id));

  const totalDeck = deckList.reduce((acc, c) => acc + c.quantity, 0);
  const monsters = deckList
    .filter((c) => c.category === "MONSTRO")
    .reduce((acc, c) => acc + c.quantity, 0);
  const spells = deckList
    .filter((c) => c.category === "FEITICO")
    .reduce((acc, c) => acc + c.quantity, 0);

  console.log("📊 Estatísticas do Banco de Dados:");
  console.log(`   - Total de Cartas no Catálogo : ${totalCards.count}`);
  console.log(`   - Fases PvE Cadastradas       : ${totalStages.count}`);
  console.log(`   - Jogadores Cadastrados       : ${totalUsers.count}`);
  console.log(`   - Entradas na Coleção         : ${totalUserCards.count}`);
  console.log(`   - Deck Ativo                  : "${activeDeck[0].name}"`);
  console.log(`   - Total de Cartas no Deck     : ${totalDeck} (Monstros: ${monsters}, Feitiços: ${spells})`);

  if (totalDeck === 30 && monsters === 20 && spells === 10) {
    console.log("✅ Validação do Baralho Inicial: 100% CORRETO (30 cartas, 20 monstros, 10 feitiços)!");
  } else {
    console.warn("⚠️ Aviso: O baralho ativo não possui a contagem esperada.");
  }
}

verify()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro na verificação:", err);
    process.exit(1);
  });

