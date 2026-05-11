"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * Schema para crear Variant.
 * AHORA: GLOBAL - sin modelId (se crea una sola vez y se reutiliza).
 */
const variantSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sku: z.string().optional(),
});

export type VariantInput = z.infer<typeof variantSchema>;

export async function createVariant(data: VariantInput) {
  try {
    const validated = variantSchema.parse(data);

    const variant = await prisma.variant.create({
      data: {
        name: validated.name,
        sku: validated.sku,
      },
    });

    revalidatePath("/admin/productos/nuevo");
    revalidatePath("/admin/productos");

    return { success: true, variant };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating variant:", error);
    return { success: false, error: "Error al crear la variante" };
  }
}

export async function updateVariant(id: string, data: Partial<VariantInput>) {
  try {
    const { name, sku } = data;

    const updateData: { name?: string; sku?: string | null } = {};
    if (name) {
      updateData.name = name;
    }
    if (sku !== undefined) {
      updateData.sku = sku;
    }

    const variant = await prisma.variant.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/productos/nuevo");
    revalidatePath("/admin/productos");

    return { success: true, variant };
  } catch (error) {
    console.error("Error updating variant:", error);
    return { success: false, error: "Error al actualizar la variante" };
  }
}

export async function deleteVariant(id: string) {
  try {
    await prisma.variant.delete({
      where: { id },
    });

    revalidatePath("/admin/productos/nuevo");
    revalidatePath("/admin/productos");

    return { success: true };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: "Error al eliminar la variante" };
  }
}

export async function getVariants() {
  try {
    return await prisma.variant.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching variants:", error);
    return [];
  }
}

export async function getVariantById(id: string) {
  try {
    return await prisma.variant.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching variant by id:", error);
    return null;
  }
}