/**
 * ╔══════════════════════════════════════════╗
 * ║       AUTH FEATURE — SESSION             ║
 * ╚══════════════════════════════════════════╝
 *
 * Sesión en DB (tabla Session de Prisma) + cookie httpOnly.
 * Compatible con el schema de NextAuth (puede coexistir).
 */

import { cookies } from "next/headers";

import { AUTH_CONFIG } from "../config";
import type { AuthSession } from "../types/auth";

// ─── Dependencia inyectable ───────────────────────────────────────────────────
// Importá tu instancia de prisma. Ajustá el path según tu proyecto.
// Si usás barrel export: import { prisma } from "@/lib/db"
import { prisma } from "@/lib/db";

const { COOKIE_NAME, SESSION_DURATION_MS } = AUTH_CONFIG;

// ─── Crear sesión ─────────────────────────────────────────────────────────────

export async function createSession(userId: string): Promise<string> {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });

  return sessionToken;
}

// ─── Obtener sesión ───────────────────────────────────────────────────────────

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!session) return null;

  // Sesión expirada: limpiar y retornar null
  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { sessionToken } }).catch(() => {});
    cookieStore.delete(COOKIE_NAME);
    return null;
  }

  return session as AuthSession;
}

// ─── Eliminar sesión ──────────────────────────────────────────────────────────

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionToken) {
    await prisma.session
      .delete({ where: { sessionToken } })
      .catch(() => {}); // Silencioso: si ya no existe en DB, igual borramos la cookie
  }

  cookieStore.delete(COOKIE_NAME);
}

// ─── Limpiar sesiones expiradas ───────────────────────────────────────────────
// Llamar desde un cron job o endpoint de mantenimiento

export async function cleanupExpiredSessions(): Promise<number> {
  const { count } = await prisma.session.deleteMany({
    where: { expires: { lt: new Date() } },
  });
  return count;
}
