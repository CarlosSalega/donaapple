"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import type { Product } from "@/features/catalog/types/product";
import { cn } from "@/shared/lib/utils";
import { useScrollRevealMultiple } from "@/shared/hooks/useScrollReveal";

interface FeaturedProductsCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FeaturedProductsCarousel({
  products,
  subtitle,
  className,
}: FeaturedProductsCarouselProps) {
  const [mounted, setMounted] = useState(false);
  const { refs: cardRefs, visibleItems: cardVisible } = useScrollRevealMultiple(
    products.length,
  );

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div
        className={`${className ?? "mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"}`}
      >
        <div>
          {subtitle && (
            <p className="text-text-secondary text-base">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
        {products.map((product, i) => (
          <div
            key={product.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <div
              className={cn(
                "h-full transition-all duration-700",
                mounted && cardVisible[i]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
