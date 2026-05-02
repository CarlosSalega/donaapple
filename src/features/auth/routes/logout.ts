/**
 * ╔══════════════════════════════════════════╗
 * ║     AUTH FEATURE — LOGOUT HANDLER        ║
 * ╚══════════════════════════════════════════╝
 *
 * Copiá a: app/api/auth/logout/route.ts
 * O re-exportá: export { POST } from "@/features/auth/routes/logout"
 */

import { NextResponse } from "next/server";

import { deleteSession } from "../lib/session";
import { AUTH_CONFIG } from "../config";

export async function POST(): Promise<NextResponse> {
  await deleteSession();

  return NextResponse.json({
    success: true,
    redirectTo: AUTH_CONFIG.ROUTES.AFTER_LOGOUT,
  });
}
