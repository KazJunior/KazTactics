CREATE TYPE "public"."attack_type" AS ENUM('LINE_OF_SIGHT', 'ARREMESSO');--> statement-breakpoint
CREATE TYPE "public"."card_category" AS ENUM('MONSTRO', 'FEITICO');--> statement-breakpoint
CREATE TYPE "public"."card_type" AS ENUM('ARTROPODES', 'BESTIAIS', 'MORTOS_VIVOS', 'ESPIRITOS', 'HUMANOIDES', 'MECANICOS', 'MITOLOGICOS', 'FEITICOS');--> statement-breakpoint
CREATE TYPE "public"."rarity" AS ENUM('COMUM', 'INCOMUM', 'RARO', 'EPICO', 'LENDARIO');--> statement-breakpoint
CREATE TABLE "campaign_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stage_number" integer NOT NULL,
	"name" varchar(120) NOT NULL,
	"ai_core_hp" integer NOT NULL,
	"gold_reward" integer NOT NULL,
	"board_layout_json" jsonb NOT NULL,
	"ai_deck_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_stages_stage_number_unique" UNIQUE("stage_number")
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"rarity" "rarity" NOT NULL,
	"category" "card_category" NOT NULL,
	"type" "card_type" NOT NULL,
	"mana_cost" integer NOT NULL,
	"hp" integer,
	"damage" integer,
	"movement_tiles" integer,
	"range_tiles" integer,
	"attack_type" "attack_type",
	"spell_effect_json" jsonb,
	"sprite_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deck_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"card_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"gold" integer DEFAULT 500 NOT NULL,
	"current_stage" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;