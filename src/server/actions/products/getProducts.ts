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
  color?: string;
  stock?: number;
  battery?: number;
  createdAt: Date;
  updatedAt: Date;
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
  variantIds: string[];
  variantNames: string[];
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
  isFeatured?: boolean;
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
 * AHORA incluye model directo (no más variant → model).
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
  color: true,
  stock: true,
  battery: true,
  createdAt: true,
  updatedAt: true,
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
  variantIds: true,
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

function parseVariantIds(variantIds: string | null): string[] {
  if (!variantIds) return [];
  try {
    return JSON.parse(variantIds) as string[];
  } catch {
    return [];
  }
}

async function getVariantNames(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const variants = await prisma.variant.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true },
  });
  return new Map(variants.map((v) => [v.id, v.name]));
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Construye el `where` de Prisma correctamente mergeando los filtros anidados.
 *
 * El bug original: cada bloque `if` sobreescribía `where.variant` con un spread
 * superficial, por lo que combinar brandId + categoryId descartaba el brandId.
 *
 * AHORA filtra por model directo (no más por variant → model).
 */
function buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
  const {
    brandId: rawBrandId,
    categoryId: rawCategoryId,
    modelId: rawModelId,
    condition: rawCondition,
    isActive,
    isFeatured,
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

  const hasModelFilter = Boolean(brandId || categoryId || modelId);

  return {
    ...(condition !== undefined && { condition }),
    ...(isActive !== undefined && { isActive }),
    ...(isFeatured !== undefined && { isFeatured }),
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
    ...(hasModelFilter && {
      model: {
        ...(modelId && { id: modelId }),
        ...(categoryId && { categoryId }),
        ...(brandId && {
          category: {
            brand: { id: brandId },
          },
        }),
      },
    }),
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProducts(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  try {
    const { page = 1, limit = 6 } = filters;

    const where = buildWhere(filters);

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

    const allVariantIds = products
      .flatMap((p) => parseVariantIds(p.variantIds))
      .filter((id, idx, arr) => arr.indexOf(id) === idx);

    const variantMap = await getVariantNames(allVariantIds);

    return {
      products: products.map((p) => {
        const variantIds = parseVariantIds(p.variantIds);
        return {
          ...p,
          variantIds,
          variantNames: variantIds
            .map((id) => variantMap.get(id) || "")
            .filter(Boolean),
        };
      }) as ProductListItem[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      limit: 6,
      totalPages: 0,
    };
  }
}

export async function getProductById(
  id: string,
): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });

  if (!product) return null;

  const variantIds = parseVariantIds(product.variantIds);
  const variantMap = await getVariantNames(variantIds);
  const variantNames = variantIds
    .map((id) => variantMap.get(id) || "")
    .filter(Boolean);

  return {
    ...product,
    variantIds,
    variantNames,
  } as ProductListItem;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: productSelect,
  });

  if (!product) return null;

  const variantIds = parseVariantIds(product.variantIds);
  const variantMap = await getVariantNames(variantIds);
  const variantNames = variantIds
    .map((id) => variantMap.get(id) || "")
    .filter(Boolean);

  return {
    ...product,
    variantIds,
    variantNames,
  } as ProductListItem;
}
