/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — AUTH GUARDS          ║
 * ╚══════════════════════════════════════════╝
 *
 * Guards para Route Handlers (app/api) y Server Components.
 * Reemplaza el pattern try/catch manual en cada route.
 *
 * USO EN ROUTE HANDLER:
 *   export const GET = withAuth(async (req, user) => { ... })
 *   export const POST = withAdmin(async (req, user) => { ... })
 *
 * USO EN SERVER COMPONENT:
 *   const user = await requireAuth()   // lanza redirect si no hay sesión
 *   const user = await requireAdmin()  // lanza redirect si no es ADMIN
 */

import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { getSession } from "./session";
import { AUTH_CONFIG } from "../config";
import type { AuthUser } from "../types/auth";

// ─── Error tipado ─────────────────────────────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: 401 | 403 | 500,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

async function resolveUser(): Promise<AuthUser> {
  const session = await getSession();

  if (!session?.user) {
    throw new AuthError("No autenticado", 401);
  }

  if (!session.user.isActive) {
    throw new AuthError("Usuario inactivo", 403);
  }

  return session.user;
}

// ─── Para Route Handlers (API) ────────────────────────────────────────────────

type RouteHandler = (
  request: NextRequest,
  user: AuthUser,
) => Promise<NextResponse>;

function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  console.error("[AUTH GUARD]", error);
  return NextResponse.json({ error: "Error de autenticación" }, { status: 500 });
}

/** Protege un Route Handler: requiere sesión activa */
export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest) => {
    try {
      const user = await resolveUser();
      return handler(request, user);
    } catch (error) {
      return handleAuthError(error);
    }
  };
}

/** Protege un Route Handler: requiere rol ADMIN */
export function withAdmin(handler: RouteHandler) {
  return async (request: NextRequest) => {
    try {
      const user = await resolveUser();
      if (user.role !== "ADMIN") {
        throw new AuthError("Se requiere rol de administrador", 403);
      }
      return handler(request, user);
    } catch (error) {
      return handleAuthError(error);
    }
  };
}

/** Protege un Route Handler: requiere rol específico */
export function withRole(role: string, handler: RouteHandler) {
  return async (request: NextRequest) => {
    try {
      const user = await resolveUser();
      if (user.role !== role) {
        throw new AuthError(`Se requiere rol ${role}`, 403);
      }
      return handler(request, user);
    } catch (error) {
      return handleAuthError(error);
    }
  };
}

// ─── Para Server Components ───────────────────────────────────────────────────

/** En Server Components: retorna el usuario o hace redirect al login */
export async function requireAuth(): Promise<AuthUser> {
  try {
    return await resolveUser();
  } catch {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }
}

/** En Server Components: retorna el usuario ADMIN o hace redirect */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    redirect(AUTH_CONFIG.ROUTES.LOGIN);
  }
  return user;
}
