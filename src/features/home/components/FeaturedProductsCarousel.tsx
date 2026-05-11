"use client";

import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { Product } from "@/features/catalog/types/product";

interface FeaturedProductsCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FeaturedProductsCarousel({
  products,
  title = "Productos Destacados",
  subtitle,
  className,
}: FeaturedProductsCarouselProps) {
  return (
    <>
      <div
        className={`${className ?? "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"}`}
      >
        <div>
          <h2 className="text-text-primary mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="text-text-secondary text-base">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}
