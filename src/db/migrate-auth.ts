import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function migrateAuth() {
  console.log("🔒 Aplicando migração do Sistema de Autenticação no NeonDB...");

  try {
    // 1. Atualizar colunas de users
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar(150) UNIQUE;`
    );
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;`
    );
    await db.execute(
      sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "salt" text;`
    );

    // 2. Criar tabela de sessões
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" varchar(255) NOT NULL UNIQUE,
        "expires_at" timestamp with time zone NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // 3. Criar tabela de códigos de recuperação de senha
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "password_reset_codes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "code" varchar(20) NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "used" boolean DEFAULT false NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    console.log("✅ Migração de autenticação concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

migrateAuth().then(() => {
  process.exit(0);
});
