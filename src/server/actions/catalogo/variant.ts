"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const variantSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  modelId: z.string().min(1, "El modelo es requerido"),
  sku: z.string().optional(),
});

export type VariantInput = z.infer<typeof variantSchema>;

export async function createVariant(data: VariantInput) {
  try {
    const validated = variantSchema.parse(data);

    const variant = await prisma.variant.create({
      data: {
        name: validated.name,
        modelId: validated.modelId,
        sku: validated.sku,
      },
    });

    revalidatePath("/admin/catalogo/variantes");
    revalidatePath("/admin/productos/nuevo");

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
    const { name, modelId, sku } = data;

    const updateData: { name?: string; modelId?: string; sku?: string | null } = {};
    if (name) {
      updateData.name = name;
    }
    if (modelId) {
      updateData.modelId = modelId;
    }
    if (sku !== undefined) {
      updateData.sku = sku;
    }

    const variant = await prisma.variant.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/catalogo/variantes");
    revalidatePath("/admin/productos/nuevo");

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

    revalidatePath("/admin/catalogo/variantes");
    revalidatePath("/admin/productos/nuevo");

    return { success: true };
  } catch (error) {
    console.error("Error deleting variant:", error);
    return { success: false, error: "Error al eliminar la variante" };
  }
}

export async function getVariants() {
  return prisma.variant.findMany({
    orderBy: { name: "asc" },
    include: {
      model: {
        select: { name: true, brand: { select: { name: true } } },
      },
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getVariantById(id: string) {
  return prisma.variant.findUnique({
    where: { id },
    include: {
      model: {
        include: {
          brand: true,
          category: true,
        },
      },
    },
  });
}