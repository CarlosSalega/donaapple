"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  variantId: z.string().min(1, "La variante es requerida"),

  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  price: z.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof productSchema>;

export async function createProduct(data: CreateProductInput) {
  try {
    const validated = productSchema.parse(data);

    const product = await prisma.product.create({
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        currency: validated.currency,
        condition: validated.condition,
        isFeatured: validated.isFeatured ?? false,
        variantId: validated.variantId,
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
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating product:", error);
    return { success: false, error: "Error al crear el producto" };
  }
}