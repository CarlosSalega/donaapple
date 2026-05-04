/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — VALIDATIONS          ║
 * ╚══════════════════════════════════════════╝
 *
 * Soporta 3 modos según AUTH_CONFIG.IDENTIFIER_MODE:
 *   "email"    → valida como email estricto
 *   "username" → valida como string alfanumérico
 *   "any"      → acepta email o username (detecta automáticamente)
 */

import { z } from "zod";

import { AUTH_CONFIG } from "../config";

// --- Schemas por modo ---

const emailField = z
  .string()
  .trim()
  .min(1, "El email es requerido")
  .email("Ingresá un email válido")
  .toLowerCase();

const usernameField = z
  .string()
  .trim()
  .min(3, "El usuario debe tener al menos 3 caracteres")
  .max(32, "El usuario no puede tener más de 32 caracteres")
  .regex(/^[a-zA-Z0-9_.-]+$/, "El usuario solo puede contener letras, números, _ . -");

const anyIdentifierField = z
  .string()
  .trim()
  .min(1, "El campo es requerido")
  .toLowerCase();

const passwordField = z
  .string()
  .trim()
  .min(6, "La contraseña debe tener al menos 6 caracteres");

// --- Schema principal (se adapta al modo configurado) ---

function buildIdentifierField() {
  switch (AUTH_CONFIG.IDENTIFIER_MODE) {
    case "email":
      return emailField;
    case "username":
      return usernameField;
    case "any":
      return anyIdentifierField;
  }
}

export const loginSchema = z
  .object({
    email: buildIdentifierField(),
    password: passwordField,
  })
  .strict();

export type LoginInput = z.infer<typeof loginSchema>;

// --- Helper: detecta si el identifier es un email ---
export function isEmail(identifier: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}
