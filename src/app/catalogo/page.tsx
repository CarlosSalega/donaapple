import { Metadata } from "next";
import { Container } from "@/shared/components/ui/Container";
import { CatalogSection } from "@/features/catalog/components";
import { MOCK_PRODUCTS } from "@/features/catalog/types/products-data";

export const metadata: Metadata = {
  title: "Catálogo de iPhones | Apple Store",
  description:
    "Explorá todos nuestros iPhones disponibles. Nuevos y usados con garantía. Filtros por modelo, almacenamiento, estado y precio.",
};

export default function CatalogoPage() {
  return (
    <main className="bg-background min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-text-primary mb-2 text-3xl font-bold md:text-4xl">
            Catálogo
          </h1>
          <p className="text-text-secondary text-sm">
            {MOCK_PRODUCTS.length} productos disponibles | Todos con garantía
          </p>
        </div>

        {/* Catalog with Filters */}
        <CatalogSection products={MOCK_PRODUCTS} showFilters={true} />
      </Container>
    </main>
  );
}
