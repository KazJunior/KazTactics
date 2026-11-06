import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// ==========================================
// ENUMS
// ==========================================
export const rarityEnum = pgEnum("rarity", [
  "COMUM",
  "INCOMUM",
  "RARO",
  "EPICO",
  "LENDARIO",
]);

export const cardCategoryEnum = pgEnum("card_category", [
  "MONSTRO",
  "FEITICO",
]);

export const cardTypeEnum = pgEnum("card_type", [
  "ARTROPODES",
  "BESTIAIS",
  "MORTOS_VIVOS",
  "ESPIRITOS",
  "HUMANOIDES",
  "MECANICOS",
  "MITOLOGICOS",
  "FEITICOS",
]);

export const attackTypeEnum = pgEnum("attack_type", [
  "LINE_OF_SIGHT",
  "ARREMESSO",
]);

// ==========================================
// TABELAS
// ==========================================

/**
 * Tabela de Cartas (Monstros e Feitiços)
 */
export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  rarity: rarityEnum("rarity").notNull(),
  category: cardCategoryEnum("category").notNull(),
  type: cardTypeEnum("type").notNull(),
  manaCost: integer("mana_cost").notNull(), // Inteiro de 1 a 10
  hp: integer("hp"), // Nulo para feitiços
  damage: integer("damage"), // Dano da unidade (nulo para feitiços sem ataque direto)
  movementTiles: integer("movement_tiles"), // Casas de movimento (nulo para feitiços)
  rangeTiles: integer("range_tiles"), // Alcance em casas
  attackType: attackTypeEnum("attack_type"), // Nulo para feitiços
  spellEffectJson: jsonb("spell_effect_json"), // JSON para lógica de feitiços
  spriteUrl: text("sprite_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tabela de Usuários / Jogadores
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  gold: integer("gold").default(500).notNull(),
  currentStage: integer("current_stage").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Coleção do Jogador (User Cards)
 */
export const userCards = pgTable("user_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  cardId: uuid("card_id")
    .references(() => cards.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

/**
 * Decks / Baralhos dos Jogadores
 */
export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Cartas dos Decks
 */
export const deckCards = pgTable("deck_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id")
    .references(() => decks.id, { onDelete: "cascade" })
    .notNull(),
  cardId: uuid("card_id")
    .references(() => cards.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
});

/**
 * Fases da Campanha PvE
 */
export const campaignStages = pgTable("campaign_stages", {
  id: uuid("id").defaultRandom().primaryKey(),
  stageNumber: integer("stage_number").notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  aiCoreHp: integer("ai_core_hp").notNull(),
  goldReward: integer("gold_reward").notNull(),
  boardLayoutJson: jsonb("board_layout_json").notNull(),
  aiDeckJson: jsonb("ai_deck_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// RELAÇÕES (DRIZZLE RELATIONS)
// ==========================================

export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
  deckCards: many(deckCards),
}));

export const usersRelations = relations(users, ({ many }) => ({
  userCards: many(userCards),
  decks: many(decks),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(users, {
    fields: [userCards.userId],
    references: [users.id],
  }),
  card: one(cards, {
    fields: [userCards.cardId],
    references: [cards.id],
  }),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
  deckCards: many(deckCards),
}));

export const deckCardsRelations = relations(deckCards, ({ one }) => ({
  deck: one(decks, {
    fields: [deckCards.deckId],
    references: [decks.id],
  }),
  card: one(cards, {
    fields: [deckCards.cardId],
    references: [cards.id],
  }),
}));

// ==========================================
// TIPOS EXPORTADOS INFERIDOS
// ==========================================

export type Card = InferSelectModel<typeof cards>;
export type NewCard = InferInsertModel<typeof cards>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type UserCard = InferSelectModel<typeof userCards>;
export type NewUserCard = InferInsertModel<typeof userCards>;

export type Deck = InferSelectModel<typeof decks>;
export type NewDeck = InferInsertModel<typeof decks>;

export type DeckCard = InferSelectModel<typeof deckCards>;
export type NewDeckCard = InferInsertModel<typeof deckCards>;

export type CampaignStage = InferSelectModel<typeof campaignStages>;
export type NewCampaignStage = InferInsertModel<typeof campaignStages>;

