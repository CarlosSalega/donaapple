"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";

const modelSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  isActive: z.boolean().optional(),
});

export type ModelInput = z.infer<typeof modelSchema>;

export async function createModel(data: ModelInput) {
  try {
    const validated = modelSchema.parse(data);

    const slug = slugify(validated.name, { lower: true });

    const existing = await prisma.model.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Ya existe un modelo con ese nombre" };
    }

    const model = await prisma.model.create({
      data: {
        name: validated.name,
        slug,
        isActive: validated.isActive,
        brandId: validated.brandId,
        categoryId: validated.categoryId,
      },
    });

    revalidatePath("/admin/catalogo/modelos");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, model };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating model:", error);
    return { success: false, error: "Error al crear el modelo" };
  }
}

export async function updateModel(id: string, data: Partial<ModelInput>) {
  try {
    const { name, brandId, categoryId, isActive } = data;

    const updateData: { name?: string; slug?: string; brandId?: string; categoryId?: string; isActive?: boolean } = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }
    if (brandId) {
      updateData.brandId = brandId;
    }
    if (categoryId) {
      updateData.categoryId = categoryId;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const model = await prisma.model.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/catalogo/modelos");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, model };
  } catch (error) {
    console.error("Error updating model:", error);
    return { success: false, error: "Error al actualizar el modelo" };
  }
}

export async function deleteModel(id: string) {
  try {
    await prisma.model.delete({
      where: { id },
    });

    revalidatePath("/admin/catalogo/modelos");
    revalidatePath("/admin/productos/nuevo");

    return { success: true };
  } catch (error) {
    console.error("Error deleting model:", error);
    return { success: false, error: "Error al eliminar el modelo" };
  }
}

export async function getModels() {
  return prisma.model.findMany({
    orderBy: { name: "asc" },
    include: {
      brand: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
      _count: {
        select: { variants: true },
      },
    },
  });
}

export async function getModelById(id: string) {
  return prisma.model.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      variants: {
        orderBy: { name: "asc" },
      },
    },
  });
}