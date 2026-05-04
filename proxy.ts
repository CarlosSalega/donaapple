/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                              PROXY (MIDDLEWARE)                              ║
 * ║                    Protege rutas /admin/*                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * En Next.js 16 el middleware se renombró a proxy.ts
 * La verificación de sesión protege todas las rutas bajo /admin
 * EXCEPTO /admin/login que es pública
 */

import { NextRequest, NextResponse } from "next/server";

import { AUTH_CONFIG } from "@/features/auth/config";

const { COOKIE_NAME, ROUTES } = AUTH_CONFIG;

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = [
    ROUTES.LOGIN,                    // /admin/login
    "/admin/login",                  //Variante sin route group
    "/api/auth/login",               // API de login
    "/api/auth/logout",              // API de logout
  ];

  // Si es ruta pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Solo proteger rutas bajo /admin (excluyendo /admin/login)
  if (pathname.startsWith(ROUTES.PROTECTED_PREFIX)) {
    // Verificar cookie de sesión
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher deshabilitado temporalmente para debug
    // "/admin/:path*",
    // "/admin",
  ],
};
