/**
 * ╔══════════════════════════════════════════╗
 * ║     AUTH FEATURE — LOGIN HANDLER           ║
 * ╚══════════════════════════════════════════╝
 */

import { type NextRequest, NextResponse } from "next/server";

import { getUserByIdentifier, verifyPassword } from "../lib/auth";
import { createSession } from "../lib/session";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit";
import { loginSchema } from "../validations/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ─── 1. Rate limiting ────────────────────────────────────────────────────
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateLimit = await checkRateLimit(ip);

  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: "Demasiados intentos de inicio de sesión",
        message: `Intentá nuevamente en ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minutos`,
        retryAfter: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // ─── 2. Parseo y validación ───────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Formato de datos inválido" }, { status: 400 });
  }

  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Datos inválidos",
        details: validation.error.issues.map((i) => i.message),
      },
      { status: 400 },
    );
  }

  const { email, password } = validation.data;

  // ─── 3. Buscar usuario ────────────────────────────────────────────────────
  const user = await getUserByIdentifier(email);

  // Respuesta genérica para no revelar si el usuario existe o no
  const invalidCredentials = NextResponse.json(
    { error: "Credenciales incorrectas" },
    { status: 401 },
  );

  if (!user) return invalidCredentials;

  // ─── 4. Verificar contraseña ──────────────────────────────────────────────
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return invalidCredentials;

  // ─── 5. Crear sesión ──────────────────────────────────────────────────────
  await createSession(user.id);

  // Resetear rate limit tras login exitoso
  await resetRateLimit(ip);

  // ─── 6. Respuesta ─────────────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    redirectTo: "/admin",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}