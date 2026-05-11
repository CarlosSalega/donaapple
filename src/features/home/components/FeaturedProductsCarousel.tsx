"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@/shared/components/ui";
import type { Product } from "@/features/catalog/types/product";
import { ProductCard } from "@/features/catalog/components/ProductCard";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

    setCanScrollRight(el.scrollWidth > el.clientWidth);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollByDirection = useCallback((direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const cardEl = el.querySelector<HTMLElement>("[data-product-card]");
    const cardWidth = cardEl ? cardEl.offsetWidth + 24 : 340;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByDirection("left")}
            disabled={canScrollLeft ? false : true}
            aria-label="Anterior"
            className="border-border bg-surface text-text-primary hover:bg-surface-muted disabled:hover:bg-surface flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-25 disabled:hover:scale-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByDirection("right")}
            disabled={canScrollRight ? false : true}
            aria-label="Siguiente"
            className="border-border bg-surface text-text-primary hover:bg-surface-muted disabled:hover:bg-surface flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-25 disabled:hover:scale-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="md:scrollbar-hidden flex [scroll-snap-type:x_mandatory] gap-5 overflow-x-auto pb-4 [-webkit-scrollbar-hidden]:hidden"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-product-card
            className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </>
  );
}
