import { db } from "@/db";
import { cards, users, userCards } from "@/db/schema";
import { EXPANDED_CARDS_DATA } from "@/lib/expandedCardsCatalog";
import { eq } from "drizzle-orm";

let hasSyncedInMemory = false;

// 15 Artrópodes com stats balanceados atualizados
const ARTHROPOD_UPDATES: Partial<typeof cards.$inferSelect>[] = [
  {
    name: "Escaravelho Batedor",
    rarity: "COMUM",
    manaCost: 1,
    hp: 150,
    damage: 55,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Formiga Operária Blindada",
    rarity: "COMUM",
    manaCost: 1,
    hp: 120,
    damage: 75,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Aranha Tece-Sombras",
    rarity: "INCOMUM",
    manaCost: 2,
    hp: 150,
    damage: 55,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Vespa Caçadora de Sangue",
    rarity: "COMUM",
    manaCost: 2,
    hp: 100,
    damage: 75,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Cigarrinha Saltadora Etérea",
    rarity: "INCOMUM",
    manaCost: 2,
    hp: 120,
    damage: 65,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Lacraia Venenosa das Cavernas",
    rarity: "INCOMUM",
    manaCost: 3,
    hp: 180,
    damage: 70,
    movementTiles: 3,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Besouro Bombardeiro Ácido",
    rarity: "INCOMUM",
    manaCost: 3,
    hp: 150,
    damage: 70,
    movementTiles: 1,
    rangeTiles: 2,
    attackType: "ARREMESSO",
  },
  {
    name: "Louva-a-Deus Ceifador",
    rarity: "RARO",
    manaCost: 4,
    hp: 170,
    damage: 80,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Tarântula Golias Peluda",
    rarity: "RARO",
    manaCost: 4,
    hp: 250,
    damage: 80,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Escorpião de Obsidiana",
    rarity: "RARO",
    manaCost: 5,
    hp: 200,
    damage: 75,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Caranguejo Eremita de Rocha",
    rarity: "EPICO",
    manaCost: 6,
    hp: 300,
    damage: 80,
    movementTiles: 2,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Centopeia de Carapaça Titânica",
    rarity: "EPICO",
    manaCost: 7,
    hp: 270,
    damage: 75,
    movementTiles: 3,
    rangeTiles: 1,
    attackType: "LINE_OF_SIGHT",
  },
  {
    name: "Mariposa da Névoa Tóxica",
    rarity: "EPICO",
    manaCost: 4,
    hp: 200,
    damage: 65,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "ARREMESSO",
  },
  {
    name: "Rainha da Colmeia Quitina",
    rarity: "LENDARIO",
    manaCost: 6,
    hp: 180,
    damage: 65,
    movementTiles: 1,
    rangeTiles: 3,
    attackType: "ARREMESSO",
  },
  {
    name: "Imperador Escaravelho Dourado",
    rarity: "LENDARIO",
    manaCost: 9,
    hp: 450,
    damage: 100,
    movementTiles: 2,
    rangeTiles: 2,
    attackType: "LINE_OF_SIGHT",
  },
];

/**
 * Garante de forma idempotente (sem apagar dados existentes) que as +80 novas cartas
 * estejam cadastradas e que os atributos balanceados estejam atualizados no banco de dados.
 */
export async function syncExpandedCardsToDb(): Promise<void> {
  if (hasSyncedInMemory) return;

  try {
    const existingCards = await db.select().from(cards);
    const existingNames = new Set(
      existingCards.map((c) => c.name.trim().toLowerCase())
    );

    const missingCards = EXPANDED_CARDS_DATA.filter(
      (c) => !existingNames.has(c.name.trim().toLowerCase())
    );

    let newlyInsertedCards: (typeof cards.$inferSelect)[] = [];
    if (missingCards.length > 0) {
      newlyInsertedCards = await db
        .insert(cards)
        .values(missingCards)
        .returning();
    }

    // Se novas cartas foram inseridas no catálogo, adiciona 2 cópias iniciais para contas já existentes poderem visualizá-las no Grimório
    if (newlyInsertedCards.length > 0) {
      const allUsers = await db.select({ id: users.id }).from(users);
      for (const u of allUsers) {
        const payload = newlyInsertedCards.map((c) => ({
          userId: u.id,
          cardId: c.id,
          quantity: 2,
          level: 1,
        }));
        if (payload.length > 0) {
          await db.insert(userCards).values(payload);
        }
      }
    }

    // Atualiza status e atributos dos 15 Artrópodes caso estejam no banco com valores antigos
    for (const updateItem of ARTHROPOD_UPDATES) {
      const match = existingCards.find(
        (c) =>
          c.name.trim().toLowerCase() === updateItem.name?.trim().toLowerCase()
      );
      if (match) {
        if (
          match.hp !== updateItem.hp ||
          match.damage !== updateItem.damage ||
          match.manaCost !== updateItem.manaCost ||
          match.movementTiles !== updateItem.movementTiles ||
          match.rangeTiles !== updateItem.rangeTiles ||
          match.attackType !== updateItem.attackType ||
          match.rarity !== updateItem.rarity
        ) {
          await db
            .update(cards)
            .set({
              hp: updateItem.hp,
              damage: updateItem.damage,
              manaCost: updateItem.manaCost,
              movementTiles: updateItem.movementTiles,
              rangeTiles: updateItem.rangeTiles,
              attackType: updateItem.attackType,
              rarity: updateItem.rarity,
            })
            .where(eq(cards.id, match.id));
        }
      }
    }

    hasSyncedInMemory = true;
  } catch (err) {
    console.error("Aviso ao sincronizar catálogo expandido de cartas:", err);
  }
}

