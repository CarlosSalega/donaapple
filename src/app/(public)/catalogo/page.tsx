import { Metadata } from "next";
import { Container } from "@/shared/components/ui/Container";
import { CatalogSection } from "@/features/catalog/components";
import { getProducts } from "@/server/actions/products/getProducts";
import type { Product } from "@/features/catalog/types/product";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";

export const metadata: Metadata = {
  title: "Catálogo de iPhones | Apple Store",
  description:
    "Explorá todos nuestros iPhones disponibles. Nuevos y usados con garantía. Filtros por modelo, almacenamiento, estado y precio.",
};

const ITEMS_PER_PAGE = 12;
const FETCH_LIMIT = 500;

function mapProductsList(
  dbProducts: Awaited<ReturnType<typeof getProducts>>["products"],
): Product[] {
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
      src: resolveImageUrl(img.url, "product", "card"),
      alt: img.alt || p.title,
      priority: idx === 0,
    })),
    isFeatured: p.isFeatured,
    isNew: p.condition === "NEW",
    stock: p.stock ?? 1,
    colors: p.color ? [p.color] : undefined,
  }));
}

export default async function CatalogoPage() {
  const { products, total } = await getProducts({
    isActive: true,
    limit: FETCH_LIMIT,
  });

  const mappedProducts = mapProductsList(products);

  return (
    <main className="bg-background min-h-screen py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-text-primary mb-2 text-3xl font-bold md:text-4xl">
            Catálogo
          </h1>
          <p className="text-text-secondary text-sm">
            {total} productos disponibles | Todos con garantía
          </p>
        </div>

        <CatalogSection
          products={mappedProducts}
          showFilters={true}
          itemsPerPage={ITEMS_PER_PAGE}
          subtitle={`${total} productos`}
        />
      </Container>
    </main>
  );
}