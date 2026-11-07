import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { EXPANDED_CARDS_DATA } from "../lib/expandedCardsCatalog";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL não foi definida no ambiente.");
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function main() {
  console.log("=========================================================");
  console.log("⚡ [KazTactics] Atualizando Cartas e Balanceamento no NeonDB...");
  console.log("=========================================================");

  // Assegurar compatibilidade com coluna level se necessário
  try {
    await sql`ALTER TABLE "user_cards" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;`;
  } catch (e) {
    // Ignora se não puder alterar
  }

  const existingCards = await db.select().from(schema.cards);
  console.log(`📦 Encontradas ${existingCards.length} cartas existentes no banco.`);

  const existingByName = new Map<string, typeof existingCards[0]>();
  for (const c of existingCards) {
    existingByName.set(c.name.trim().toLowerCase(), c);
  }

  const allUsers = await db.select({ id: schema.users.id }).from(schema.users);
  let updatedCount = 0;
  let insertedCount = 0;

  for (const cardData of EXPANDED_CARDS_DATA) {
    const key = cardData.name.trim().toLowerCase();
    const existing = existingByName.get(key);

    if (existing) {
      await db
        .update(schema.cards)
        .set({
          rarity: cardData.rarity,
          category: cardData.category,
          type: cardData.type,
          manaCost: cardData.manaCost,
          hp: cardData.hp,
          damage: cardData.damage,
          movementTiles: cardData.movementTiles,
          rangeTiles: cardData.rangeTiles,
          attackType: cardData.attackType,
          description: cardData.description,
          spellEffectJson: cardData.spellEffectJson,
          spriteUrl: cardData.spriteUrl || existing.spriteUrl,
        })
        .where(eq(schema.cards.id, existing.id));

      console.log(`🔄 Atualizada: [${cardData.rarity}] ${cardData.name} (Mana: ${cardData.manaCost}, HP: ${cardData.hp ?? "-"}, Dano: ${cardData.damage ?? "-"})`);
      updatedCount++;
    } else {
      const [newCard] = await db
        .insert(schema.cards)
        .values(cardData)
        .returning();

      console.log(`✨ Inserida: [${cardData.rarity}] ${cardData.name}`);
      insertedCount++;

      // Conceder cópias aos usuários existentes para ficarem disponíveis na coleção
      for (const u of allUsers) {
        try {
          await sql`
            INSERT INTO "user_cards" ("user_id", "card_id", "quantity")
            VALUES (${u.id}, ${newCard.id}, 2)
            ON CONFLICT DO NOTHING;
          `;
        } catch (err) {
          console.warn(`Não foi possível vincular carta ${newCard.name} ao usuário:`, err);
        }
      }
    }
  }

  console.log("=========================================================");
  console.log(`✅ Atualização finalizada com sucesso!`);
  console.log(`   - Atualizadas : ${updatedCount} cartas`);
  console.log(`   - Inseridas   : ${insertedCount} cartas`);
  console.log(`   - Total no banco : ${existingCards.length + insertedCount} cartas`);
  console.log("=========================================================");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro fatal durante a atualização das cartas:", err);
  process.exit(1);
});
