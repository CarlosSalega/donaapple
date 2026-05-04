/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        LOGOUT API ROUTE                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { NextResponse } from "next/server";

import { deleteSession } from "@/features/auth/lib/session";

export async function POST(): Promise<NextResponse> {
  await deleteSession();

  return NextResponse.json({ success: true });
}