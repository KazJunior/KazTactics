import "dotenv/config";
import { db } from "./index";
import { campaignStages, users } from "./schema";
import { claimStageVictoryAction } from "../actions/battle";
import { eq } from "drizzle-orm";

async function testCampaignFlow() {
  console.log("🧪 [Teste Automatizado] Iniciando validação do Fluxo de Campanha e Progressão (Etapa 10)...");

  // 1. Carregar estágios da campanha
  const allStages = await db.select().from(campaignStages);
  console.log(`🏰 Fases registradas no NeonDB: ${allStages.length} estágios.`);

  if (allStages.length !== 5) {
    throw new Error(`Esperado 5 fases cadastradas, encontrado ${allStages.length}`);
  }

  // 2. Carregar usuário atual
  const [initialUser] = await db.select().from(users).limit(1);
  console.log(`👤 Jogador: "${initialUser.username}" | Estágio Atual: ${initialUser.currentStage} | Ouro: ${initialUser.gold}`);

  // 3. Simular Vitória na Fase 2 (Recompensa: 200 Ouro)
  console.log("\n⚔️ Simulando vitória da Fase 2 contra o Núcleo da IA...");
  const victoryResult = await claimStageVictoryAction(2);
  console.log("   Resultado do avanço:", victoryResult);

  if (!victoryResult.success) {
    throw new Error(`Falha ao registrar vitória: ${victoryResult.error}`);
  }

  // 4. Checar persistência real no NeonDB
  const [updatedUser] = await db.select().from(users).where(eq(users.id, initialUser.id));
  console.log(`   💰 Saldo atualizado no NeonDB: ${updatedUser.gold} (+${victoryResult.rewardEarned})`);
  console.log(`   ⭐ Estágio atualizado no NeonDB: Fase ${updatedUser.currentStage}`);

  if (updatedUser.currentStage < 3) {
    throw new Error("Estágio do jogador não progrediu para 3!");
  }

  console.log("\n🎉 Teste de Campanha, Progressão e Persistência no NeonDB aprovado com 100% de sucesso!");
}

testCampaignFlow()
  .then(() => {
    setTimeout(() => process.exit(0), 100);
  })
  .catch((err) => {
    console.error("❌ Erro no teste de campanha:", err);
    setTimeout(() => process.exit(1), 100);
  });

