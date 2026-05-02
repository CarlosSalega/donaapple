/**
 * ╔══════════════════════════════════════════╗
 * ║    AUTH FEATURE — MIDDLEWARE HELPER      ║
 * ╚══════════════════════════════════════════╝
 *
 * Helper para usar en el middleware.ts raíz del proyecto.
 *
 * IMPORTANTE: El middleware de Next.js corre en Edge Runtime,
 * NO tiene acceso a Prisma ni a la DB directamente.
 * Este helper solo valida que la cookie EXISTE.
 *
 * La validación real contra DB ocurre en:
 *   - getSession() (Server Components / layouts)
 *   - withAuth() / requireAuth() (Route Handlers / Server Components)
 *
 * USO EN middleware.ts:
 *
 *   import { handleAuthMiddleware } from "@/features/auth/lib/middleware-auth"
 *
 *   export function middleware(request: NextRequest) {
 *     return handleAuthMiddleware(request)
 *   }
 *
 *   export const config = {
 *     matcher: ["/admin/:path*"],
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "../config";

const { COOKIE_NAME, ROUTES } = AUTH_CONFIG;

export function handleAuthMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Pasar headers útiles a los Server Components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Rutas protegidas
  if (pathname.startsWith(ROUTES.PROTECTED_PREFIX)) {
    // La página de login siempre es pública
    if (pathname === ROUTES.LOGIN) return response;

    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      // Guarda la URL de destino para redirigir después del login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}
