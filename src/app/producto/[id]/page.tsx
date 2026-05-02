import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/shared/components/ui/Container";
import {
  Breadcrumbs,
  ImageGallery,
  ProductInfo,
  ProductDetailCTA,
} from "@/features/product/components";
import {
  getProductById,
  MOCK_PRODUCTS,
} from "@/features/catalog/types/products-data";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  return MOCK_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.name} ${product.storage} - Apple Store`,
    description:
      product.description ||
      `${product.name} ${product.storage} en Apple Store. ${product.condition === "new" ? "Nuevo" : "Usado"} con garantía.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-background min-h-screen py-8">
      <Container>
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Catálogo", href: "/catalogo" },
              { label: product.name },
            ]}
          />
        </div>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Gallery */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Info & CTA */}
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />
            <ProductDetailCTA product={product} />
          </div>
        </div>
      </Container>
    </main>
  );
}
