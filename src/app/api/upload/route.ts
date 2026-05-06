import { NextResponse } from "next/server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { ImageService } from "@/features/images/lib/image-service";
import { getSession } from "@/features/auth/lib/session";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 },
      );
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "La imagen no debe superar 10MB" },
        { status: 400 },
      );
    }

    const result = await ImageService.upload(file);

    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key } = body || {};

    if (!key) {
      return NextResponse.json(
        { error: "No se proporcionó key" },
        { status: 400 },
      );
    }

    const imageRecord = await prisma.image.findFirst({
      where: { publicId: key },
      select: { id: true, product: { select: { id: true } } },
    });

    if (!imageRecord) {
      return NextResponse.json(
        { error: "Imagen no encontrada" },
        { status: 404 },
      );
    }

    const result = await ImageService.delete(key);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Error al eliminar la imagen" },
        { status: 500 },
      );
    }

    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
