/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║       AUTH FEATURE — SESSION (Cookie Encriptada)                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Sesión simple con cookie encriptada (sin JWT).
 * Encripta el userId usando crypto de Node y lo guarda en cookie httpOnly.
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

import { AUTH_CONFIG } from "../config";
import type { AuthSession } from "../types/auth";
import { prisma } from "@/shared/lib/prisma";

const { COOKIE_NAME, SESSION_DURATION_MS } = AUTH_CONFIG;

// ─── Configuración de encriptación ─────────────────────────────────────────────

const getEncryptionKey = (): Buffer => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado en .env");
  }
  // Derivar una clave de 32 bytes (AES-256) desde la clave secreta
  return createHash("sha256").update(secret).digest();
};

const getIV = (): Buffer => {
  // IV de 16 bytes para AES
  return randomBytes(16);
};

// ─── Funciones de encriptación ─────────────────────────────────────────────────

/**
 * Encripta un texto usando AES-256-CBC
 */
function encrypt(text: string): string {
  const key = getEncryptionKey();
  const iv = getIV();

  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combinar IV + datos encriptados para poder desencriptar después
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Desencripta un texto encriptado con encrypt()
 */
function decrypt(encryptedText: string): string | null {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(":");

    if (parts.length !== 2) return null;

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    return null;
  }
}

// ─── Crear sesión (cookie encriptada) ─────────────────────────────────────────

export async function createSession(userId: string): Promise<void> {
  // Encriptar el userId
  const encryptedUserId = encrypt(userId);

  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encryptedUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

// ─── Obtener sesión ───────────────────────────────────────────────────────────

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const encryptedUserId = cookieStore.get(COOKIE_NAME)?.value;

  if (!encryptedUserId) return null;

  // Desencriptar el userId
  const userId = decrypt(encryptedUserId);
  if (!userId) return null;

  // Buscar el usuario en la DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) return null;

  // Retornar sesión simulando formato de NextAuth
  return {
    user,
    expires: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  } as AuthSession;
}

// ─── Eliminar sesión ───────────────────────────────────────────────────────────

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Verificar si hay sesión activa ─────────────────────────────────────────────

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user;
}