/**
 * ╔══════════════════════════════════════════╗
 * ║         AUTH FEATURE — TYPES             ║
 * ╚══════════════════════════════════════════╝
 */

import type { Role } from "@prisma/client";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
}

export interface LoginResult {
  success: boolean;
  user?: Pick<AuthUser, "id" | "name" | "email" | "role">;
  error?: string;
}