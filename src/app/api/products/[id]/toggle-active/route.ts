import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling product:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}