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

export type VariantWithModel = CatalogOption & {
  modelId: string;
};

export async function getCatalogOptions() {
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
      select: { id: true, name: true, modelId: true },
    }),
  ]);

  return {
    brands: brands as CatalogOption[],
    categories: categories as CategoryWithBrand[],
    models: models as ModelWithCategory[],
    variants: variants as VariantWithModel[],
  };
}