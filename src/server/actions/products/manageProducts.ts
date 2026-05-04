"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Error al eliminar el producto" };
  }
}

export async function toggleProductActive(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });

    revalidatePath("/admin/productos");
    return { success: true, isActive: !product.isActive };
  } catch (error) {
    console.error("Error toggling product:", error);
    return { success: false, error: "Error al cambiar el estado del producto" };
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isFeatured: true },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    });

    revalidatePath("/admin/productos");
    return { success: true, isFeatured: !product.isFeatured };
  } catch (error) {
    console.error("Error toggling featured:", error);
    return { success: false, error: "Error al cambiar el estado destacado" };
  }
}

export async function duplicateProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    const newProduct = await prisma.product.create({
      data: {
        title: `${product.title} (Copia)`,
        description: product.description,
        price: product.price,
        currency: product.currency,
        condition: product.condition,
        isActive: false,
        isFeatured: false,
        variantId: product.variantId,
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

    revalidatePath("/admin/productos");
    return { success: true, productId: newProduct.id };
  } catch (error) {
    console.error("Error duplicating product:", error);
    return { success: false, error: "Error al duplicar el producto" };
  }
}