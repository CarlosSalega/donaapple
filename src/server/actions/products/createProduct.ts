"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema para crear producto.
 * AHORA: modelId directo, variantId opcional.
 */
const productSchema = z.object({
  modelId: z.string().min(1, "El modelo es requerido"),
  variantId: z.string().optional(),

  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  price: z.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  color: z.string().optional(),
  stock: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof productSchema>;

export async function createProduct(data: CreateProductInput) {
  try {
    const validated = productSchema.parse(data);

    const slug = `${validated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        price: validated.price ?? 0,
        currency: validated.currency,
        condition: validated.condition,
        isFeatured: validated.isFeatured ?? false,
        color: validated.color || null,
        stock: validated.stock ?? null,
        modelId: validated.modelId,
        variantId: validated.variantId || null,
      },
    });

    for (const url of validated.images) {
      await prisma.image.create({
        data: {
          url,
          publicId: url.split("/").pop() || "image",
          alt: validated.title,
          isPrimary: validated.images.indexOf(url) === 0,
          productId: product.id,
        },
      });
    }

    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return { success: true, productId: product.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating product:", error);
    return { success: false, error: "Error al crear el producto" };
  }
}