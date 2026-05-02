/**
 * ╔══════════════════════════════════════════╗
 * ║         AUTH FEATURE — CONFIG            ║
 * ║  Ajustá estos valores por proyecto       ║
 * ╚══════════════════════════════════════════╝
 */

export const AUTH_CONFIG = {
  // Duración de la sesión (ms). Default: 8 horas
  SESSION_DURATION_MS: 8 * 60 * 60 * 1000,

  // Nombre de la cookie de sesión
  COOKIE_NAME: "session",

  // Rate limiting
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutos
  },

  // Rutas
  ROUTES: {
    LOGIN: "/admin/login",
    AFTER_LOGIN: "/admin",
    AFTER_LOGOUT: "/admin/login",
    // Prefijo de rutas protegidas (el middleware protege todo lo que empiece con esto)
    PROTECTED_PREFIX: "/admin",
  },

  // Modo de identificador de login
  // "email"    → solo acepta email
  // "username" → solo acepta username
  // "any"      → acepta email o username
  IDENTIFIER_MODE: "email" as "email" | "username" | "any",
} as const;
