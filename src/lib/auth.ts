import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, sessions, User } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "kaz_session";

/**
 * Gera hash seguro de senha utilizando scrypt nativo do Node.js
 */
export function hashPassword(
  password: string,
  salt?: string
): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
  return { hash, salt: generatedSalt };
}

/**
 * Verifica se a senha corresponde ao hash armazenado
 */
export function verifyPassword(
  password: string,
  hash: string,
  salt: string
): boolean {
  try {
    const computed = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(computed, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Gera token único para a sessão
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Gera código numérico de 6 dígitos para recuperação de senha
 */
export function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Cria uma sessão no banco de dados e define o cookie HTTP-only
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 dias

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch {
    // Contexto fora de requisição HTTP (ex: scripts CLI ou testes)
  }

  return token;
}

/**
 * Remove a sessão atual do banco e limpa o cookie
 */
export async function destroySession(): Promise<void> {
  try {
    let token: string | undefined;
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // Fora de requisição HTTP
    }

    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }
  } catch (error) {
    console.error("Erro ao destruir sessão:", error);
  }
}

/**
 * Retorna o usuário autenticado na sessão atual, ou null se não estiver logado
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    let token: string | undefined;
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Fora de requisição HTTP
      return null;
    }

    if (!token) return null;

    const now = new Date();
    const activeSessions = await db
      .select({
        user: users,
        session: sessions,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
      .limit(1);

    if (activeSessions.length === 0) {
      return null;
    }

    return activeSessions[0].user;
  } catch (error) {
    console.error("Erro ao obter usuário autenticado:", error);
    return null;
  }
}

/**
 * Retorna o usuário efetivo para o gameplay:
 * Se houver sessão autenticada, usa o usuário logado.
 * Caso contrário, usa o usuário padrão de demonstração para não quebrar fluxos abertos.
 */
export async function getEffectiveUser(): Promise<User | null> {
  const authUser = await getAuthenticatedUser();
  if (authUser) return authUser;

  const [fallbackUser] = await db.select().from(users).limit(1);
  return fallbackUser || null;
}
