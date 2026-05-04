/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — PUBLIC API           ║
 * ╚══════════════════════════════════════════╝
 *
 * Importá desde acá en lugar de los archivos internos.
 *
 * NOTA: El componente LoginForm y el hook useAuth tienen
 * "use client" / "use server" implícitos, importalos
 * directamente si hay conflictos de boundary.
 */

// Config
export { AUTH_CONFIG } from "./config";

// Types
export type { AuthUser, AuthSession, LoginResult } from "./types/auth";

// Core auth
export {
  hashPassword,
  verifyPassword,
  getUserByEmail,
  getUserByUsername,
  getUserByIdentifier,
} from "./lib/auth";

// Session
export {
  createSession,
  getSession,
  deleteSession,
  getCurrentUser,
} from "./lib/session";

// Guards (Route Handlers + Server Components)
export {
  AuthError,
  withAuth,
  withAdmin,
  withRole,
  requireAuth,
  requireAdmin,
} from "./lib/auth-guards";

// Rate limiting
export {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
} from "./lib/rate-limit";

// Middleware helper
export { handleAuthMiddleware } from "./lib/middleware-auth";

// Validations
export { loginSchema, isEmail } from "./validations/auth";
export type { LoginInput } from "./validations/auth";
