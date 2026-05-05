"use server";

import { prisma } from "@/shared/lib/prisma";

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  currency: string;
  condition: string;
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
  condition?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const { brandId, categoryId, modelId, condition, isActive, search, page = 1, limit = 20 } = filters;

  const where: any = {};

  if (brandId) {
    where.variant = { model: { category: { brandId } } };
  }

  if (categoryId) {
    where.variant = { ...where.variant, model: { categoryId } };
  }

  if (modelId) {
    where.variant = { ...where.variant, modelId };
  }

  if (condition) {
    where.condition = condition;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        currency: true,
        condition: true,
        isActive: true,
        isFeatured: true,
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
            alt: true,
            isPrimary: true,
          },
          orderBy: { isPrimary: "desc" },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
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
        orderBy: { isPrimary: "desc" },
      },
    },
  });

  return product as ProductListItem | null;
}

export async function getProductBySlug(slug: string): Promise<ProductListItem | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
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
        orderBy: { isPrimary: "desc" },
      },
    },
  });

  return product as ProductListItem | null;
}