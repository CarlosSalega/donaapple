"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { Product } from "@/features/catalog/types/product";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ChevronLeft, ChevronRight } from "@/shared/components/ui";

interface FeaturedProductsSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function FeaturedProductsSlider({
  products,
  title = "Productos Destacados",
  subtitle,
}: FeaturedProductsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);

  // Drag state
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);

    // Initialize arrow state after mount
    setCanScrollRight(el.scrollWidth > el.clientWidth);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollByDirection = useCallback((direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardEl = el.querySelector<HTMLElement>("[data-product-slide]");
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 340;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft =
      scrollLeftRef.current - (x - startXRef.current);
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  return (
    <section className="border-border-subtle bg-surface border-t px-4 py-16">
      {/* Header */}
      <div className="mb-6 px-4 pb-4 md:px-8 lg:px-24">
        <div className="mx-auto flex max-w-7xl items-end justify-between">
          <div>
            {title && (
              <h2 className="text-text-primary mb-2 text-2xl font-bold md:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-text-secondary">{subtitle}</p>}
          </div>

          {/* Arrow buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => scrollByDirection("left")}
              disabled={!canScrollLeft}
              aria-label="Anterior"
              className="border-border bg-surface text-text-primary hover:bg-surface-muted disabled:hover:bg-surface flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-25 disabled:hover:scale-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollByDirection("right")}
              disabled={!canScrollRight}
              aria-label="Siguiente"
              className="border-border bg-surface text-text-primary hover:bg-surface-muted disabled:hover:bg-surface flex h-11 w-11 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-25 disabled:hover:scale-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="md:scrollbar-hidden flex [scroll-snap-type:x_mandatory] gap-6 overflow-x-auto px-4 pb-4 md:px-8 lg:flex lg:flex-row lg:justify-center md:[-webkit-scrollbar-hidden]:hidden"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-product-slide
            className="w-[clamp(260px,78vw,320px)] shrink-0 snap-start transition-all duration-700 sm:w-[clamp(280px,40vw,320px)] lg:w-[clamp(280px,22vw,320px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
