"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";

const brandSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  isActive: z.boolean().optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;

export async function createBrand(data: BrandInput) {
  try {
    const validated = brandSchema.parse(data);

    const slug = slugify(validated.name, { lower: true });

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Ya existe una marca con ese nombre" };
    }

    const brand = await prisma.brand.create({
      data: {
        name: validated.name,
        slug,
        isActive: validated.isActive,
      },
    });

    revalidatePath("/admin/catalogo/marcas");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, brand };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating brand:", error);
    return { success: false, error: "Error al crear la marca" };
  }
}

export async function updateBrand(id: string, data: Partial<BrandInput>) {
  try {
    const { name, isActive } = data;

    const updateData: { name?: string; isActive?: boolean; slug?: string } = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/catalogo/marcas");
    revalidatePath("/admin/productos/nuevo");

    return { success: true, brand };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { success: false, error: "Error al actualizar la marca" };
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id },
    });

    revalidatePath("/admin/catalogo/marcas");
    revalidatePath("/admin/productos/nuevo");

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: "Error al eliminar la marca" };
  }
}

export async function getBrands() {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { categories: true, models: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function getBrandById(id: string) {
  try {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        categories: {
          orderBy: { name: "asc" },
        },
        models: {
          orderBy: { name: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching brand by id:", error);
    return null;
  }
}