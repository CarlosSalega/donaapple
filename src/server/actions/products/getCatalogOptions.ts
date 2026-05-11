"use server";

import { prisma } from "@/shared/lib/prisma";

export type CatalogOption = {
  id: string;
  name: string;
};

export type CategoryWithBrand = CatalogOption & {
  brandId: string;
};

export type ModelWithCategory = CatalogOption & {
  categoryId: string;
  brandId: string;
};

/**
 * Obtiene opciones para el formulario de productos.
 * AHORA: variants son globales (sin modelId).
 */
export async function getCatalogOptions() {
  try {
    const [brands, categories, models, variants] = await Promise.all([
      prisma.brand.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, brandId: true },
      }),
      prisma.model.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, categoryId: true, brandId: true },
      }),
      prisma.variant.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);

    return {
      brands: brands as CatalogOption[],
      categories: categories as CategoryWithBrand[],
      models: models as ModelWithCategory[],
      variants: variants as CatalogOption[],
    };
  } catch (error) {
    console.error("Error fetching catalog options:", error);
    return {
      brands: [],
      categories: [],
      models: [],
      variants: [],
    };
  }
}