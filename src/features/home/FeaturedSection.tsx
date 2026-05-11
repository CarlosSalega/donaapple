"use client";

import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/server/actions/products/getFeaturedProducts";
import { FeaturedProductsCarousel } from "./components/FeaturedProductsCarousel";
import { EmptyFeaturedState } from "./components/EmptyFeaturedState";
import { LandingSection } from "@/shared/components/ui/LandingSection";
import { useScrollReveal } from "@/shared/hooks/useScrollReveal";
import { cn } from "@/shared/lib/utils";
import type { Product } from "@/features/catalog/types/product";

interface FeaturedSectionProps {
  title?: string;
  subtitle?: string;
  id?: string;
}

export function FeaturedSection({
  title = "Productos Destacados",
  subtitle,
  id,
}: FeaturedSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollReveal();

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    getFeaturedProducts().then((data) => {
      setProducts(data);
    });
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LandingSection ref={sectionRef} id={id}>
      <div
        className={cn(
          "transition-all duration-700",
          mounted && isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0",
        )}
      >
        <div className="mb-2 text-center">
          <h2 className="text-text-primary text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>

        {products.length === 0 ? (
          <EmptyFeaturedState />
        ) : (
          <FeaturedProductsCarousel products={products} />
        )}
      </div>
    </LandingSection>
  );
}
