import { FeaturedProductsSlider } from "./components/FeaturedProductsSlider";
import { getProducts } from "@/server/actions/products/getProducts";
import type { Product } from "@/features/catalog/types/product";
import { resolveImageUrl } from "@/features/images";

function mapProductsList(dbProducts: Awaited<ReturnType<typeof getProducts>>["products"]): Product[] {
  const conditionMap: Record<string, Product["condition"]> = {
    NEW: "new",
    USED: "used-excellent",
    REFURBISHED: "refurbished",
  };

  return dbProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.title.split(" - ")[0] || p.model?.name || "Producto",
    brand: "Apple" as const,
    model: p.model?.name || "Unknown",
    storage: p.variantNames?.join(" + ") || "N/A",
    price: p.price || 0,
    originalPrice: undefined,
    condition: conditionMap[p.condition] || "used-good",
    battery: undefined,
    warranty: undefined,
    description: undefined,
    images: p.images.map((img, idx) => ({
      src: resolveImageUrl(img.url) || "/images/placeholder.webp",
      alt: img.alt || p.title,
      priority: idx === 0,
    })),
    isFeatured: p.isFeatured,
    isNew: p.condition === "NEW",
    stock: p.stock ?? 1,
    colors: p.color ? [p.color] : undefined,
  }));
}

interface FeaturedProductsSectionProps {
  title?: string;
  subtitle?: string;
}

export async function FeaturedProductsSection({
  title = "Últimos Ingresos",
  subtitle = "Los productos más recientes agregados al catálogo",
}: FeaturedProductsSectionProps) {
  const { products } = await getProducts({ 
    isActive: true, 
    limit: 9,
  });
  
  const mappedProducts = mapProductsList(products);

  return (
    <FeaturedProductsSlider
      products={mappedProducts}
      title={title}
      subtitle={subtitle}
    />
  );
}