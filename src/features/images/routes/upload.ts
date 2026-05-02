/**
 * ╔══════════════════════════════════════════╗
 * ║     IMAGES FEATURE — UPLOAD HANDLER      ║
 * ╚══════════════════════════════════════════╝
 *
 * Copiá a: app/api/upload/route.ts
 * O re-exportá:
 *   export { POST, DELETE } from "@/features/images/routes/upload"
 *
 * ─── HOOK DE NEGOCIO ─────────────────────────────────────────
 * El DELETE incluye un hook `canDeleteImage` que por defecto
 * permite todo. Sobreescribilo con la lógica de tu proyecto
 * (ej: verificar que la imagen pertenece a un Car del usuario).
 */

import { type NextRequest, NextResponse } from "next/server";

import { ImageService } from "../lib/image-service";
import { validateFile } from "../lib/validate-upload";
import { UPLOAD_LIMITS } from "../config";

// ─── Autenticación ────────────────────────────────────────────────────────────
// Ajustá este import al path real de tu feature de auth.
import { getSession } from "@/features/auth/lib/session";

// ─── Hook de negocio: autorización para DELETE ────────────────────────────────
// Por defecto permite a cualquier usuario autenticado eliminar.
// Sobreescribí esta función con la lógica de tu proyecto:
//
// async function canDeleteImage(key: string, userId: string, role: string): Promise<boolean> {
//   const cars = await prisma.car.findMany({ where: { images: { has: key } } })
//   return cars.length === 0 || cars.some(c => c.userId === userId) || role === "ADMIN"
// }
//
async function canDeleteImage(
  _key: string,
  _userId: string,
  _role: string,
): Promise<boolean> {
  return true;
}

// ─── POST /api/upload ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato de datos inválido" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
  }

  const validationError = validateFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError.message }, { status: 400 });
  }

  try {
    const result = await ImageService.upload(file);
    return NextResponse.json({ success: true, key: result.key, url: result.url });
  } catch (error: any) {
    console.error("[Upload] Error:", error);
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
  }
}

// ─── DELETE /api/upload ───────────────────────────────────────────────────────

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { key?: string; keys?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Formato de datos inválido" }, { status: 400 });
  }

  // Soporta borrado individual (key) y múltiple (keys)
  const keysToDelete = body.keys ?? (body.key ? [body.key] : []);

  if (keysToDelete.length === 0) {
    return NextResponse.json({ error: "No se proporcionó key" }, { status: 400 });
  }

  // Verificar autorización para cada key
  for (const key of keysToDelete) {
    const allowed = await canDeleteImage(key, session.user.id, session.user.role);
    if (!allowed) {
      return NextResponse.json(
        { error: `Sin permiso para eliminar: ${key}` },
        { status: 403 },
      );
    }
  }

  try {
    if (keysToDelete.length === 1) {
      const result = await ImageService.delete(keysToDelete[0]);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error ?? "Error al eliminar" },
          { status: 500 },
        );
      }
      return NextResponse.json({ success: true });
    }

    const result = await ImageService.deleteMany(keysToDelete);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("[Delete] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
