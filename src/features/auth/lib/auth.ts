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
import { prisma } from "@/shared/lib/prisma";

// ─── Password ─────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
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
 * Retorna solo los campos necesarios para el flujo de login.
 */
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
    },
  });
}

/**
 * Busca un usuario por username.
 */
export async function getUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: { name: username },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
    },
  });
}

/**
 * Busca un usuario por ID.
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

/**
 * Resuelve el usuario según IDENTIFIER_MODE configurado.
 */
export async function getUserByIdentifier(identifier: string) {
  const mode = AUTH_CONFIG.IDENTIFIER_MODE;

  if (mode === "email") return getUserByEmail(identifier);
  if (mode === "username") return getUserByUsername(identifier);

  return isEmail(identifier)
    ? getUserByEmail(identifier)
    : getUserByUsername(identifier);
}