"use server";

import { db } from "@/db";
import {
  users,
  cards,
  userCards,
  decks,
  deckCards,
  passwordResetCodes,
  sessions,
  User,
} from "@/db/schema";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getAuthenticatedUser,
  generateResetCode,
} from "@/lib/auth";
import { eq, or, and, gt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ensureTutorialAndPacksColumns } from "@/actions/tutorial";

export interface AuthActionResult<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

/**
 * Concede a coleção inicial de cartas e monta o primeiro baralho para um novo jogador
 */
async function setupStarterCollectionForUser(userId: string) {
  try {
    const allCards = await db.select().from(cards);
    if (allCards.length === 0) return;

    // 1. Concede 3 cópias de cada carta para a coleção
    const userCardsPayload = allCards.map((c) => ({
      userId,
      cardId: c.id,
      quantity: 3,
    }));
    await db.insert(userCards).values(userCardsPayload);

    // 2. Cria baralho inicial ativo de 30 cartas
    const [deck] = await db
      .insert(decks)
      .values({
        userId,
        name: "Baralho Tático Inicial (30 Cartas)",
        isActive: true,
      })
      .returning();

    const deckMonsters = [
      "Escaravelho Batedor",
      "Lobo Cinzento Caçador",
      "Caçadora Élfica da Fronteira",
      "Arqueiro Esqueleto Maldito",
      "Sentinela de Engrenagens",
      "Banshee Lamuriante",
      "Minotauro do Labirinto",
      "Louva-a-Deus Ceifador",
      "Catapulta a Vapor Blindada",
      "Cavaleiro da Morte Decrépito",
    ];

    const deckSpells = [
      "Toque Restaurador",
      "Raio de Gelo Paralisante",
      "Cristais de Mana Fluídos",
      "Bola de Fogo Concentrada",
      "Chuva de Flechas Arcanas",
    ];

    const cardMap = new Map<string, string>();
    for (const c of allCards) {
      cardMap.set(c.name, c.id);
    }

    const deckCardsPayload: {
      deckId: string;
      cardId: string;
      quantity: number;
    }[] = [];

    for (const mName of deckMonsters) {
      const cardId = cardMap.get(mName);
      if (cardId) {
        deckCardsPayload.push({ deckId: deck.id, cardId, quantity: 2 });
      }
    }

    for (const sName of deckSpells) {
      const cardId = cardMap.get(sName);
      if (cardId) {
        deckCardsPayload.push({ deckId: deck.id, cardId, quantity: 2 });
      }
    }

    if (deckCardsPayload.length > 0) {
      await db.insert(deckCards).values(deckCardsPayload);
    }
  } catch (err) {
    console.error("Erro ao inicializar coleção do usuário:", err);
  }
}

/**
 * CADASTRO DE NOVO USUÁRIO (APENAS USUÁRIO E SENHA)
 */
export async function registerAction(formData: {
  username: string;
  password: string;
}): Promise<AuthActionResult<{ user: { id: string; username: string } }>> {
  try {
    const username = (formData.username || "").trim();
    const password = formData.password || "";

    // Validações
    if (!username || username.length < 3) {
      return {
        success: false,
        error: "O nome de usuário deve ter pelo menos 3 caracteres.",
      };
    }
    if (username.length > 30) {
      return {
        success: false,
        error: "O nome de usuário não pode exceder 30 caracteres.",
      };
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return {
        success: false,
        error: "O nome de usuário só pode conter letras, números e sublinhados (_).",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: "A senha deve ter pelo menos 6 caracteres.",
      };
    }

    // Verifica se username já existe
    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (existingUsername.length > 0) {
      return {
        success: false,
        error: "Este nome de comandante já está em uso.",
      };
    }

    // Garante colunas de tutorial e pacotes no banco
    await ensureTutorialAndPacksColumns();

    // Gera Hash da Senha
    const { hash, salt } = hashPassword(password);

    // Insere Usuário Novo com tutorialCompleted = false (apenas contas novas têm acesso ao tutorial)
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        passwordHash: hash,
        salt,
        gold: 500,
        basicPacks: 0,
        advancedPacks: 0,
        supremePacks: 0,
        tutorialCompleted: false,
        currentStage: 1,
        avatarCardName: "Lobo Cinzento Caçador",
      })
      .returning();

    // Inicializa cartas e deck do jogador
    await setupStarterCollectionForUser(newUser.id);

    // Cria Sessão e grava cookie
    await createSession(newUser.id);

    try {
      revalidatePath("/");
      revalidatePath("/battle");
      revalidatePath("/deckbuilder");
      revalidatePath("/shop");
      revalidatePath("/campaign");
    } catch {
      // ignore
    }

    return {
      success: true,
      message: "Conta criada com sucesso! Bem-vindo ao Santuário.",
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    };
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return {
      success: false,
      error: error?.message || "Ocorreu uma falha ao cadastrar. Tente novamente.",
    };
  }
}

/**
 * LOGIN DE USUÁRIO (APENAS USUÁRIO E SENHA)
 */
export async function loginAction(formData: {
  username?: string;
  identifier?: string;
  password: string;
}): Promise<AuthActionResult<{ user: { id: string; username: string } }>> {
  try {
    const username = (formData.username || formData.identifier || "")
      .trim()
      .toLowerCase();
    const password = formData.password || "";

    if (!username || !password) {
      return {
        success: false,
        error: "Preencha o nome de usuário e a senha.",
      };
    }

    // Procura usuário pelo nome de usuário
    const foundUsers = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${username})`)
      .limit(1);

    if (foundUsers.length === 0) {
      return {
        success: false,
        error: "Comandante não encontrado. Verifique seu nome de usuário ou crie uma conta.",
      };
    }

    const user = foundUsers[0];

    // Se a conta não tem senha cadastrada (conta legado criada via seed inicial)
    if (!user.passwordHash || !user.salt) {
      // Atualiza a senha automaticamente no primeiro login se for conta legado
      const { hash, salt } = hashPassword(password);
      await db
        .update(users)
        .set({ passwordHash: hash, salt })
        .where(eq(users.id, user.id));
    } else {
      const isValid = verifyPassword(password, user.passwordHash, user.salt);
      if (!isValid) {
        return {
          success: false,
          error: "Senha incorreta. Tente novamente ou use a recuperação de senha.",
        };
      }
    }

    // Cria Sessão
    await createSession(user.id);

    try {
      revalidatePath("/");
      revalidatePath("/battle");
      revalidatePath("/deckbuilder");
      revalidatePath("/shop");
      revalidatePath("/campaign");
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Bem-vindo de volta, ${user.username}!`,
      data: {
        user: {
          id: user.id,
          username: user.username,
        },
      },
    };
  } catch (error: any) {
    console.error("Erro no login:", error);
    return {
      success: false,
      error: error?.message || "Falha ao realizar login.",
    };
  }
}

/**
 * LOGOUT DE USUÁRIO
 */
export async function logoutAction(): Promise<AuthActionResult> {
  try {
    await destroySession();
    try {
      revalidatePath("/");
      revalidatePath("/battle");
      revalidatePath("/deckbuilder");
      revalidatePath("/shop");
      revalidatePath("/campaign");
    } catch {
      // ignore
    }
    return { success: true, message: "Sessão encerrada com sucesso." };
  } catch (error) {
    console.error("Erro no logout:", error);
    return { success: false, error: "Falha ao deslogar." };
  }
}

/**
 * SOLICITAR CÓDIGO DE RECUPERAÇÃO DE SENHA (PELO NOME DE USUÁRIO)
 */
export async function requestPasswordResetAction(formData: {
  username?: string;
  emailOrUsername?: string;
}): Promise<
  AuthActionResult<{
    code: string;
    username: string;
    expiresAt: string;
  }>
> {
  try {
    const input = (formData.username || formData.emailOrUsername || "")
      .trim()
      .toLowerCase();
    if (!input) {
      return {
        success: false,
        error: "Informe o seu nome de usuário.",
      };
    }

    const foundUsers = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${input})`)
      .limit(1);

    if (foundUsers.length === 0) {
      return {
        success: false,
        error: "Nenhum comandante encontrado com este nome de usuário.",
      };
    }

    const user = foundUsers[0];

    // Invalida códigos anteriores não usados deste usuário
    await db
      .update(passwordResetCodes)
      .set({ used: true })
      .where(
        and(
          eq(passwordResetCodes.userId, user.id),
          eq(passwordResetCodes.used, false)
        )
      );

    // Gera código de 6 dígitos numéricos
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await db.insert(passwordResetCodes).values({
      userId: user.id,
      code: resetCode,
      expiresAt,
      used: false,
    });

    return {
      success: true,
      message: "Código de recuperação gerado com sucesso!",
      data: {
        code: resetCode,
        username: user.username,
        expiresAt: expiresAt.toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Erro ao solicitar código de recuperação:", error);
    return {
      success: false,
      error: error?.message || "Falha ao gerar código de recuperação.",
    };
  }
}

/**
 * REDEFINIR SENHA COM O CÓDIGO GERADO
 */
export async function resetPasswordWithCodeAction(formData: {
  username?: string;
  emailOrUsername?: string;
  code: string;
  newPassword: string;
}): Promise<AuthActionResult> {
  try {
    const input = (formData.username || formData.emailOrUsername || "")
      .trim()
      .toLowerCase();
    const code = (formData.code || "").trim();
    const newPassword = formData.newPassword || "";

    if (!input) {
      return { success: false, error: "Informe seu nome de usuário." };
    }
    if (!code) {
      return { success: false, error: "Informe o código de verificação recebido." };
    }
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "A nova senha deve ter pelo menos 6 caracteres.",
      };
    }

    // Localiza usuário
    const foundUsers = await db
      .select()
      .from(users)
      .where(sql`LOWER(${users.username}) = LOWER(${input})`)
      .limit(1);

    if (foundUsers.length === 0) {
      return { success: false, error: "Usuário não encontrado." };
    }

    const user = foundUsers[0];
    const now = new Date();

    // Procura código válido
    const validCodes = await db
      .select()
      .from(passwordResetCodes)
      .where(
        and(
          eq(passwordResetCodes.userId, user.id),
          eq(passwordResetCodes.code, code),
          eq(passwordResetCodes.used, false),
          gt(passwordResetCodes.expiresAt, now)
        )
      )
      .limit(1);

    if (validCodes.length === 0) {
      return {
        success: false,
        error: "Código de recuperação inválido ou expirado. Gere um novo código.",
      };
    }

    const matchedCodeRecord = validCodes[0];

    // Atualiza senha do usuário
    const { hash, salt } = hashPassword(newPassword);

    await db
      .update(users)
      .set({
        passwordHash: hash,
        salt,
      })
      .where(eq(users.id, user.id));

    // Marca o código como utilizado
    await db
      .update(passwordResetCodes)
      .set({ used: true })
      .where(eq(passwordResetCodes.id, matchedCodeRecord.id));

    // Invalida sessões ativas antigas
    await db.delete(sessions).where(eq(sessions.userId, user.id));

    // Cria nova sessão autenticada com a nova senha
    await createSession(user.id);

    try {
      revalidatePath("/");
      revalidatePath("/battle");
      revalidatePath("/deckbuilder");
      revalidatePath("/shop");
      revalidatePath("/campaign");
    } catch {
      // ignore
    }

    return {
      success: true,
      message: "Senha alterada com sucesso! Você já está autenticado.",
    };
  } catch (error: any) {
    console.error("Erro ao redefinir senha com código:", error);
    return {
      success: false,
      error: error?.message || "Falha ao redefinir senha.",
    };
  }
}

/**
 * OBTÉM DADOS DO USUÁRIO LOGADO
 */
export async function getCurrentUserAction(): Promise<{
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string | null;
    gold: number;
    avatarCardName: string;
    currentStage: number;
  } | null;
}> {
  try {
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user: {
        id: authUser.id,
        username: authUser.username,
        email: authUser.email,
        gold: authUser.gold,
        avatarCardName: authUser.avatarCardName,
        currentStage: authUser.currentStage,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    return { isAuthenticated: false, user: null };
  }
}
