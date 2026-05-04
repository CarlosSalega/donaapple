/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        LOGIN API ROUTE                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { NextRequest, NextResponse } from "next/server";

import { getUserByIdentifier, verifyPassword } from "@/features/auth/lib/auth";
import { createSession } from "@/features/auth/lib/session";
import { checkRateLimit, resetRateLimit } from "@/features/auth/lib/rate-limit";
import { loginSchema } from "@/features/auth/validations/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
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
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Formato de datos inválido" },
      { status: 400 },
    );
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

  const user = await getUserByIdentifier(email);

  const invalidCredentials = NextResponse.json(
    { error: "Credenciales incorrectas" },
    { status: 401 },
  );

  if (!user) return invalidCredentials;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return invalidCredentials;

  await createSession(user.id);
  await resetRateLimit(ip);

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
