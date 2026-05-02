import type { Product } from "@/features/catalog/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-5xl">📱</div>
        <h3 className="text-text-primary mb-2 text-xl font-semibold">
          No hay productos
        </h3>
        <p className="text-text-secondary">
          Probá ajustando los filtros para ver más resultados.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
