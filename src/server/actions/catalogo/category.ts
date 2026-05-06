"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brandId: z.string().min(1, "La marca es requerida"),
  isActive: z.boolean().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export async function createCategory(data: CategoryInput) {
  try {
    const validated = categorySchema.parse(data);

    const slug = slugify(validated.name, { lower: true });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Ya existe una categoría con ese nombre" };
    }

    const category = await prisma.category.create({
      data: {
        name: validated.name,
        slug,
        isActive: validated.isActive,
        brandId: validated.brandId,
      },
    });

    revalidatePath("/admin/catalogo/categorias");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, category };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating category:", error);
    return { success: false, error: "Error al crear la categoría" };
  }
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  try {
    const { name, brandId, isActive } = data;

    const updateData: { name?: string; slug?: string; brandId?: string; isActive?: boolean } = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }
    if (brandId) {
      updateData.brandId = brandId;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/catalogo/categorias");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Error al actualizar la categoría" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/catalogo/categorias");
    revalidatePath("/admin/productos/nuevo");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Error al eliminar la categoría" };
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      brand: {
        select: { name: true },
      },
      _count: {
        select: { models: true },
      },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      brand: true,
      models: {
        orderBy: { name: "asc" },
      },
    },
  });
}