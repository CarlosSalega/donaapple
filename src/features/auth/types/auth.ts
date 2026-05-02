/**
 * ╔══════════════════════════════════════════╗
 * ║         AUTH FEATURE — TYPES             ║
 * ╚══════════════════════════════════════════╝
 *
 * Si tu proyecto usa roles distintos a ADMIN/COLLABORATOR,
 * reemplazá el enum Role por el tuyo o importalo desde @prisma/client.
 */

// Reexportá Role desde @prisma/client en tus proyectos.
// Acá lo duplicamos para que la feature sea standalone.
export type Role = "ADMIN" | "COLLABORATOR" | string;

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface AuthSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: AuthUser;
}

export interface LoginResult {
  success: boolean;
  user?: Pick<AuthUser, "id" | "name" | "email" | "role">;
  error?: string;
}
