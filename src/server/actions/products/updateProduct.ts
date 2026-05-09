"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema para actualizar producto.
 * AHORA: modelId directo, variantIds array (máx 3), color, stock.
 */
const productUpdateSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .optional(),
  price: z.number().optional().nullable(),
  currency: z.enum(["ARS", "USD"]).optional(),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  description: z.string().optional().nullable(),
  
  modelId: z.string().optional(),
  variantIds: z.array(z.string()).max(3, "Máximo 3 variantes").optional(),
  color: z.string().optional().nullable(),
  stock: z.number().optional().nullable(),
  battery: z.number().min(0).max(100).optional().nullable(),
  
  images: z.array(z.string()).optional(),
});

export type UpdateProductInput = z.infer<typeof productUpdateSchema>;

export async function updateProduct(id: string, data: UpdateProductInput) {
  try {
    const validated = productUpdateSchema.parse(data);

    const updateData: Record<string, unknown> = { ...validated };

    // modelId directo
    if (validated.modelId !== undefined) {
      updateData.model = { connect: { id: validated.modelId } };
      delete updateData.modelId;
    }

    // variantIds como JSON array
    if (validated.variantIds !== undefined) {
      updateData.variantIds =
        validated.variantIds.length > 0
          ? JSON.stringify(validated.variantIds)
          : null;
      delete updateData.variantIds;
    }

    // Manejo de imágenes
    if (validated.images !== undefined) {
      await prisma.image.deleteMany({ where: { productId: id } });

      for (const url of validated.images) {
        await prisma.image.create({
          data: {
            url,
            publicId: url.split("/").pop() || "image",
            alt: validated.title || "Producto",
            isPrimary: validated.images.indexOf(url) === 0,
            productId: id,
          },
        });
      }

      delete updateData.images;
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/productos");
    revalidatePath(`/admin/productos/${id}/editar`);
    revalidatePath("/catalogo");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error updating product:", error);
    return { success: false, error: "Error al actualizar el producto" };
  }
}