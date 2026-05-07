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
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // AHORA incluye modelId directo
    const newProduct = await prisma.product.create({
      data: {
        title: `${product.title} (Copia)`,
        slug: `${product.slug}-copia-${Date.now()}`,
        description: product.description,
        price: product.price,
        currency: product.currency,
        condition: product.condition,
        isActive: false,
        isFeatured: false,
        modelId: product.modelId,
        variantId: product.variantId,
        color: product.color,
        stock: product.stock,
      },
    });

    for (const image of product.images) {
      await prisma.image.create({
        data: {
          url: image.url,
          publicId: image.publicId,
          alt: image.alt,
          isPrimary: image.isPrimary,
          productId: newProduct.id,
        },
      });
    }

    return NextResponse.json({ success: true, productId: newProduct.id });
  } catch (error) {
    console.error("Error duplicating product:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}