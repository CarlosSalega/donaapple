"use server";

import { Condition, Prisma } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  currency: string;
  condition: Condition;
  isActive: boolean;
  isFeatured: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  variant: {
    id: string;
    name: string;
    model: {
      id: string;
      name: string;
      category: {
        id: string;
        name: string;
        brand: {
          id: string;
          name: string;
        };
      };
    };
  };
  images: {
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
  }[];
};

export type ProductFilters = {
  brandId?: string;
  categoryId?: string;
  modelId?: string;
  condition?: Condition | "all";
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type PaginatedProducts = {
  products: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// ─── Select reutilizable ──────────────────────────────────────────────────────

/**
 * Select base compartido entre getProducts, getProductById y getProductBySlug.
 * Incluye `publicId` en images para los casos que lo necesitan (by id / by slug).
 */
const productSelect = {
  id: true,
  title: true,
  slug: true,
  price: true,
  currency: true,
  condition: true,
  isActive: true,
  isFeatured: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  variant: {
    select: {
      id: true,
      name: true,
      model: {
        select: {
          id: true,
          name: true,
          category: {
            select: {
              id: true,
              name: true,
              brand: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  images: {
    select: {
      id: true,
      url: true,
      publicId: true,
      alt: true,
      isPrimary: true,
    },
    orderBy: { isPrimary: "desc" as const },
  },
} satisfies Prisma.ProductSelect;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Construye el `where` de Prisma correctamente mergeando los filtros anidados.
 *
 * El bug original: cada bloque `if` sobreescribía `where.variant` con un spread
 * superficial, por lo que combinar brandId + categoryId descartaba el brandId.
 */
function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const {
    brandId: rawBrandId,
    categoryId: rawCategoryId,
    modelId: rawModelId,
    condition: rawCondition,
    isActive,
    search,
  } = filters;

  // Los selects de UI suelen mandar "all" para indicar "sin filtro".
  // Descartamos cualquier valor que no sea un ID/enum real.
  const brandId = rawBrandId && rawBrandId !== "all" ? rawBrandId : undefined;
  const categoryId =
    rawCategoryId && rawCategoryId !== "all" ? rawCategoryId : undefined;
  const modelId = rawModelId && rawModelId !== "all" ? rawModelId : undefined;
  const condition: Condition | undefined =
    rawCondition &&
    (Object.values(Condition) as string[]).includes(rawCondition)
      ? (rawCondition as Condition)
      : undefined;

  const hasVariantFilter = Boolean(brandId || categoryId || modelId);

  return {
    ...(condition !== undefined && { condition }),
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
    ...(hasVariantFilter && {
      variant: {
        ...(modelId && { modelId }),
        model: {
          ...(categoryId && { categoryId }),
          ...(brandId && {
            category: {
              brand: { id: brandId },
            },
          }),
        },
      },
    }),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  const { page = 1, limit = 20 } = filters;

  const where = buildWhere(filters);

  // Promise.all es correcto: lanza findMany y count en paralelo (no hay waterfall).
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products as ProductListItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(
  id: string,
): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  return product as ProductListItem | null;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productSelect,
  });

  return product as ProductListItem | null;
}
