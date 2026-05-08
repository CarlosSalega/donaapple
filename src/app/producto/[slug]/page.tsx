import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/shared/components/ui/Container";
import {
  Breadcrumbs,
  ImageGallery,
  ProductInfo,
  ProductDetailCTA,
} from "@/features/product/components";
import { getProductBySlug, getProducts } from "@/server/actions/products/getProducts";
import type { Product } from "@/features/catalog/types/product";
import { resolveImageUrl } from "@/features/images";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Mapea producto de DB a formato del catálogo.
 * AHORA: model directo, no variant → model.
 */
function mapDbToProduct(dbProduct: Awaited<ReturnType<typeof getProductBySlug>>): Product | null {
  if (!dbProduct) return null;
  
  const modelName = dbProduct.model?.name || "Unknown";
  const conditionMap: Record<string, Product["condition"]> = {
    NEW: "new",
    USED: "used-excellent",
    REFURBISHED: "refurbished",
  };
  
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.title.split(" - ")[0] || modelName,
    brand: "Apple" as const,
    model: modelName,
    storage: dbProduct.variantNames?.join(" + ") || "N/A",
    price: dbProduct.price || 0,
    originalPrice: undefined,
    condition: conditionMap[dbProduct.condition] || "used-good",
    battery: undefined,
    warranty: undefined,
    description: dbProduct.description || undefined,
    images: dbProduct.images.map((img, idx) => ({
      src: resolveImageUrl(img.url) || "/images/placeholder.webp",
      alt: img.alt || dbProduct.title,
      priority: idx === 0,
    })),
    isFeatured: dbProduct.isFeatured,
    isNew: dbProduct.condition === "NEW",
    stock: dbProduct.stock ?? 1,
    colors: dbProduct.color ? [dbProduct.color] : undefined,
  };
}

export async function generateStaticParams() {
  const { products } = await getProducts({ isActive: true, limit: 100 });
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = await getProductBySlug(slug);
  
  if (!dbProduct) {
    return { title: "Producto no encontrado" };
  }
  
  const product = mapDbToProduct(dbProduct);
  const primaryImage = dbProduct.images[0];
  const imageUrl = primaryImage ? resolveImageUrl(primaryImage.url) : null;
  const productName = product?.name || "Producto";
  const storage = product?.storage || "";
  
  return {
    title: storage ? `${productName} ${storage} - Apple Store` : `${productName} - Apple Store`,
    description: product?.description || `${productName} ${storage ? storage + " " : ""}${product?.condition === "new" ? "Nuevo" : "Usado"} con garantía.`,
    openGraph: {
      title: storage ? `${productName} ${storage} - Apple Store` : `${productName} - Apple Store`,
      description: product?.description || `${productName} - ${product?.condition === "new" ? "Nuevo" : "Usado"} con garantía`,
      type: "website",
      url: `/producto/${slug}`,
      siteName: "Donaapple",
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: storage ? `${productName} ${storage} - Apple Store` : `${productName} - Apple Store`,
      description: product?.description || `${productName} - ${product?.condition === "new" ? "Nuevo" : "Usado"} con garantía`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const dbProduct = await getProductBySlug(slug);
  
  if (!dbProduct) {
    notFound();
  }
  
  const product = mapDbToProduct(dbProduct);
  
  if (!product) {
    notFound();
  }
  
  return (
    <main className="bg-background min-h-screen py-8">
      <Container>
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Catálogo", href: "/catalogo" },
              { label: product.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />
            <ProductDetailCTA product={product} />
          </div>
        </div>
      </Container>
    </main>
  );
}