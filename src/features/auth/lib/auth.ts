/**
 * ╔══════════════════════════════════════════╗
 * ║        AUTH FEATURE — AUTH CORE          ║
 * ╚══════════════════════════════════════════╝
 *
 * Lógica pura de autenticación: hash, verify, lookup de usuarios.
 * Sin acoplamiento a HTTP, cookies ni lógica de negocio del proyecto.
 */

import bcrypt from "bcryptjs";

import { AUTH_CONFIG } from "../config";
import { isEmail } from "../validations/auth";

// Ajustá el path según tu proyecto
import { prisma } from "@/lib/db";

// ─── Password ─────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ─── Lookup de usuario ────────────────────────────────────────────────────────

/**
 * Busca un usuario por email.
 * Retorna solo los campos necesarios para el flujo de login (sin exponer todo el modelo).
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      hashedPassword: true,
      role: true,
      isActive: true,
    },
  });
}

/**
 * Busca un usuario por username.
 * ⚙️  ADAPTAR: cambiá "name" por el campo username de tu schema si es diferente.
 */
export async function getUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: { name: username },
    select: {
      id: true,
      email: true,
      name: true,
      hashedPassword: true,
      role: true,
      isActive: true,
    },
  });
}

/**
 * Resuelve el usuario según IDENTIFIER_MODE configurado.
 * En modo "any" detecta automáticamente si es email o username.
 */
export async function getUserByIdentifier(identifier: string) {
  const mode = AUTH_CONFIG.IDENTIFIER_MODE;

  if (mode === "email") return getUserByEmail(identifier);
  if (mode === "username") return getUserByUsername(identifier);

  // mode === "any": detectar por formato
  return isEmail(identifier)
    ? getUserByEmail(identifier)
    : getUserByUsername(identifier);
}
