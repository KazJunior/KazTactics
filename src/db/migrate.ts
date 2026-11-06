import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

async function runMigration() {
  console.log("⚡ [KazTactics] Conectando ao NeonDB e iniciando migrações...");
  const sql = neon(connectionString!);
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ [KazTactics] Migrações aplicadas com sucesso no NeonDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ [KazTactics] Falha ao executar migrações:", error);
    process.exit(1);
  }
}

runMigration();

