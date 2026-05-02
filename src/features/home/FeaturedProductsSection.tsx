import { FeaturedProductsSlider } from "./components/FeaturedProductsSlider";
import { MOCK_PRODUCTS } from "@/features/catalog/types/products-data";

const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured);

export function FeaturedProductsSection() {
  return (
    <FeaturedProductsSlider
      products={featuredProducts}
      title="Productos Destacados"
      subtitle="Los más buscados por nuestros clientes"
    />
  );
}
