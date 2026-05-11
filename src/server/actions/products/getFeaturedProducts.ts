"use server";

import { Condition } from "@prisma/client";
import { getProducts } from "./getProducts";
import type { Product } from "@/features/catalog/types/product";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";

function mapToProduct(
  p: Awaited<ReturnType<typeof getProducts>>["products"][number],
): Product {
  const conditionMap: Record<string, Product["condition"]> = {
    NEW: "new",
    USED: "used-excellent",
    REFURBISHED: "refurbished",
  };

  return {
    id: p.id,
    slug: p.slug,
    name: p.title.split(" - ")[0] || p.model?.name || "Producto",
    brand: "Apple" as const,
    model: p.model?.name || "Unknown",
    storage: p.variantNames?.join(" + ") || "N/A",
    price: p.price || 0,
    originalPrice: undefined,
    condition: conditionMap[p.condition] || "used-good",
    battery: p.battery?.toString(),
    warranty: undefined,
    description: p.description || undefined,
    images: p.images.map((img, idx) => ({
      src: resolveImageUrl(img.url) || "/images/placeholder.webp",
      alt: img.alt || p.title,
      priority: idx === 0,
    })),
    isFeatured: p.isFeatured,
    isNew: p.condition === Condition.NEW,
    stock: p.stock ?? 1,
    colors: p.color ? [p.color] : undefined,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { products } = await getProducts({
      isFeatured: true,
      isActive: true,
      limit: 9,
    });

    return products.map(mapToProduct);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}