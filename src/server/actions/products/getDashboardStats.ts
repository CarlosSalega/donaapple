"use server";

import { prisma } from "@/shared/lib/prisma";
import { Condition } from "@prisma/client";

export type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalBrands: number;
  totalCategories: number;
  totalModels: number;
  recentProducts: {
    id: string;
    title: string;
    price: number | null;
    currency: string;
    condition: Condition;
    isActive: boolean;
    createdAt: Date;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
    images: {
      url: string;
      isPrimary: boolean;
    }[];
  }[];
  error?: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      brands,
      categories,
      models,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.model.count({ where: { isActive: true } }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          currency: true,
          condition: true,
          isActive: true,
          createdAt: true,
          model: {
            select: {
              name: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
          images: {
            select: {
              url: true,
              isPrimary: true,
            },
            where: { isPrimary: true },
          },
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalBrands: brands,
      totalCategories: categories,
      totalModels: models,
      recentProducts,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de conexión a la base de datos";
    return {
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      totalBrands: 0,
      totalCategories: 0,
      totalModels: 0,
      recentProducts: [],
      error: message,
    };
  }
}