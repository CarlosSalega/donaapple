/**
 * ╔══════════════════════════════════════════╗
 * ║      AUTH FEATURE — ME HANDLER           ║
 * ╚══════════════════════════════════════════╝
 *
 * Copiá a: app/api/auth/me/route.ts
 * O re-exportá: export { GET } from "@/features/auth/routes/me"
 */

import { NextResponse } from "next/server";

import { getSession } from "../lib/session";

export async function GET(): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const { user } = session;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
