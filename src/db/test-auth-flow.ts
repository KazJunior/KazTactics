import "dotenv/config";
import { db } from "./index";
import { users, userCards, decks, passwordResetCodes } from "./schema";
import {
  registerAction,
  loginAction,
  requestPasswordResetAction,
  resetPasswordWithCodeAction,
} from "../actions/auth";
import { eq, sql } from "drizzle-orm";

async function runAuthTests() {
  console.log("=========================================================");
  console.log("🛡️ [KazTactics] Testando Sistema (Apenas Usuário e Senha)");
  console.log("=========================================================");

  const testUsername = `Comandante_${Date.now().toString().slice(-4)}`;
  const initialPassword = "senhaSegura123";
  const newPassword = "novaSenhaMisteriosa999";

  // 1. TESTE DE CADASTRO (APENAS USUÁRIO E SENHA)
  console.log(`\n1️⃣ Testando Cadastro (Apenas Usuário e Senha: ${testUsername})...`);
  const regResult = await registerAction({
    username: testUsername,
    password: initialPassword,
  });

  if (!regResult.success || !regResult.data?.user) {
    throw new Error(`Falha no cadastro: ${regResult.error}`);
  }
  const createdUserId = regResult.data.user.id;
  console.log(`   ✅ Usuário cadastrado com sucesso! ID: ${createdUserId}`);

  // Verifica se a coleção inicial e o baralho de 30 cartas foram concedidos
  const ownedCards = await db
    .select({ count: sql<number>`count(*)` })
    .from(userCards)
    .where(eq(userCards.userId, createdUserId));
  console.log(`   🎴 Cartas atribuídas na coleção: ${ownedCards[0]?.count}`);

  const userDecks = await db
    .select()
    .from(decks)
    .where(eq(decks.userId, createdUserId));
  console.log(`   ⚔️ Baralho ativo criado: "${userDecks[0]?.name}"`);

  // 2. TESTE DE LOGIN (APENAS USUÁRIO E SENHA)
  console.log("\n2️⃣ Testando Login com Nome de Usuário e Senha...");
  const loginResult = await loginAction({
    username: testUsername,
    password: initialPassword,
  });
  if (!loginResult.success) {
    throw new Error(`Falha no login: ${loginResult.error}`);
  }
  console.log(`   ✅ Login bem-sucedido! Mensagem: "${loginResult.message}"`);

  // 3. TESTE DE LOGIN COM SENHA INCORRETA
  console.log("\n3️⃣ Testando Login com Senha Errada...");
  const wrongLogin = await loginAction({
    username: testUsername,
    password: "senhaTotalmenteErrada",
  });
  if (wrongLogin.success) {
    throw new Error("Login com senha errada não deveria ter sucesso!");
  }
  console.log(`   ✅ Bloqueio correto com senha inválida: "${wrongLogin.error}"`);

  // 4. TESTE DE SOLICITAÇÃO DE RECUPERAÇÃO DE SENHA (PELO NOME DE USUÁRIO)
  console.log("\n4️⃣ Solicitando Recuperação de Senha (pelo Usuário)...");
  const recoveryReq = await requestPasswordResetAction({
    username: testUsername,
  });
  if (!recoveryReq.success || !recoveryReq.data?.code) {
    throw new Error(`Falha na recuperação: ${recoveryReq.error}`);
  }
  const generatedCode = recoveryReq.data.code;
  console.log(`   ✅ Código de 6 dígitos gerado com sucesso: [ ${generatedCode} ]`);
  console.log(`   ⏱️ Validade: ${recoveryReq.data.expiresAt}`);

  // Verifica existência no banco
  const dbCodes = await db
    .select()
    .from(passwordResetCodes)
    .where(eq(passwordResetCodes.userId, createdUserId));
  console.log(`   💾 Código persistido no banco com used = ${dbCodes[0]?.used}`);

  // 5. TESTE DE REDEFINIÇÃO DE SENHA COM CÓDIGO INCORRETO
  console.log("\n5️⃣ Testando Redefinição com Código Inválido...");
  const invalidCodeReset = await resetPasswordWithCodeAction({
    username: testUsername,
    code: "000000",
    newPassword,
  });
  if (invalidCodeReset.success) {
    throw new Error("Redefinição com código inválido não deveria ter sucesso!");
  }
  console.log(`   ✅ Código falso rejeitado com sucesso: "${invalidCodeReset.error}"`);

  // 6. TESTE DE REDEFINIÇÃO DE SENHA COM CÓDIGO CORRETO GERADO
  console.log("\n6️⃣ Testando Redefinição com Código Correto...");
  const validReset = await resetPasswordWithCodeAction({
    username: testUsername,
    code: generatedCode,
    newPassword,
  });
  if (!validReset.success) {
    throw new Error(`Falha ao redefinir com código: ${validReset.error}`);
  }
  console.log(`   ✅ Senha redefinida com sucesso! "${validReset.message}"`);

  // 7. TESTE DE LOGIN COM A NOVA SENHA
  console.log("\n7️⃣ Testando Login com a Nova Senha...");
  const newLogin = await loginAction({
    username: testUsername,
    password: newPassword,
  });
  if (!newLogin.success) {
    throw new Error(`Falha ao logar com a nova senha: ${newLogin.error}`);
  }
  console.log(`   ✅ Login com nova senha efetuado com sucesso!`);

  // 8. TESTE DE CÓDIGO JÁ UTILIZADO
  console.log("\n8️⃣ Testando Reutilização do Código Já Usado...");
  const reuseReset = await resetPasswordWithCodeAction({
    username: testUsername,
    code: generatedCode,
    newPassword: "outraSenhaQualquer",
  });
  if (reuseReset.success) {
    throw new Error("Código já usado não pode ser reutilizado!");
  }
  console.log(`   ✅ Código reutilizado devidamente bloqueado: "${reuseReset.error}"`);

  console.log("\n=========================================================");
  console.log("🎉 TODOS OS 8 TESTES (APENAS USUÁRIO E SENHA) PASSARAM!");
  console.log("=========================================================");
}

runAuthTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erro nos testes:", err);
    process.exit(1);
  });
