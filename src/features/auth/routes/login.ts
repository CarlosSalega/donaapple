/**
 * ╔══════════════════════════════════════════╗
 * ║     AUTH FEATURE — LOGIN HANDLER         ║
 * ╚══════════════════════════════════════════╝
 *
 * Copiá este handler a:
 *   app/api/auth/login/route.ts
 *
 * Y agregá el re-export:
 *   export { POST } from "@/features/auth/routes/login"
 *
 * O copiá el contenido directamente si preferís no usar re-exports.
 *
 * ─── HOOK DE NEGOCIO ───────────────────────────────────────────────
 * Para agregar lógica específica del proyecto (ej: logging, auditoría),
 * usá el callback `onLoginSuccess` en la sección de configuración.
 * La feature NO incluye logging por defecto (cada proyecto decide qué loguear).
 */

import { type NextRequest, NextResponse } from "next/server";

import { getUserByIdentifier, verifyPassword } from "../lib/auth";
import { createSession } from "../lib/session";
import { checkRateLimit, resetRateLimit } from "../lib/rate-limit";
import { loginSchema } from "../validations/auth";

// ─── Callback hook (opcional, para lógica del proyecto) ───────────────────────
// Descomenta y adaptá si necesitás correr algo post-login (auditoría, logs, etc.)
//
// async function onLoginSuccess(userId: string, request: NextRequest) {
//   await prisma.log.create({ data: { action: "LOGIN", entity: "User", entityId: userId, userId } })
// }

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

  const { identifier, password } = validation.data;

  // ─── 3. Buscar usuario ────────────────────────────────────────────────────
  const user = await getUserByIdentifier(identifier);

  // Respuesta genérica para no revelar si el usuario existe o no
  const invalidCredentials = NextResponse.json(
    { error: "Credenciales incorrectas" },
    { status: 401 },
  );

  if (!user) return invalidCredentials;

  // ─── 4. Chequeos de cuenta ────────────────────────────────────────────────
  if (!user.isActive) {
    return NextResponse.json(
      { error: "Tu cuenta está desactivada. Contactá al administrador." },
      { status: 403 },
    );
  }

  if (!user.hashedPassword) {
    return NextResponse.json(
      { error: "Error de configuración de cuenta. Contactá al administrador." },
      { status: 500 },
    );
  }

  // ─── 5. Verificar contraseña ──────────────────────────────────────────────
  const isValid = await verifyPassword(password, user.hashedPassword);
  if (!isValid) return invalidCredentials;

  // ─── 6. Crear sesión ──────────────────────────────────────────────────────
  await createSession(user.id);

  // Resetear rate limit tras login exitoso
  await resetRateLimit(ip);

  // ─── 7. Hook de negocio (descomenta si lo necesitás) ──────────────────────
  // await onLoginSuccess(user.id, request)

  // ─── 8. Respuesta ─────────────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
