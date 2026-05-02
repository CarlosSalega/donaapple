"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/features/catalog/types/product";
import type { FiltersState } from "@/features/filters/hooks/useFilters";
import type { Category } from "@/features/filters/components/CategoryFilter";
import { ProductGrid } from "@/features/catalog/components";
import { FilterBar } from "@/features/filters/components/FilterBar";
import { CategoryFilter } from "@/features/filters/components/CategoryFilter";
import { CategoryFilterWithState } from "@/features/filters/components/CategoryFilterWithState";
import {
  usePagination,
  PaginationControls,
} from "@/features/filters/hooks/usePagination";

interface CatalogSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  showCategoryFilter?: boolean;
  itemsPerPage?: number;
  className?: string;
}

const ITEMS_PER_PAGE_DEFAULT = 9;

export function CatalogSection({
  products,
  title,
  subtitle,
  showFilters = true,
  showCategoryFilter = true,
  itemsPerPage = ITEMS_PER_PAGE_DEFAULT,
  className,
}: CatalogSectionProps) {
  const [category, setCategory] = useState<Category>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters] = useState<FiltersState>({
    model: null,
    minPrice: null,
    maxPrice: null,
    condition: null,
    storage: null,
  });

  const filteredProducts = useMemo(() => {
    if (category !== "all" && category !== "iphone") {
      return [];
    }

    return products.filter((product) => {
      if (filters.model && product.model !== filters.model) {
        return false;
      }
      if (filters.storage && product.storage !== filters.storage) {
        return false;
      }
      if (filters.condition && product.condition !== filters.condition) {
        return false;
      }
      if (filters.minPrice !== null && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && product.price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }, [products, filters, category]);

  const pagination = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage,
    onPageChange: setCurrentPage,
  });

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(pagination.startIndex, pagination.endIndex);
  }, [filteredProducts, pagination.startIndex, pagination.endIndex]);

  const showUnavailableCategory = category !== "all" && category !== "iphone";

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== null,
  ).length;

  const handleCloseMobileFilters = () => {
    setShowMobileFilters(false);
    // Reset page when filters change
    setCurrentPage(1);
  };

  return (
    <section className={className}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h2 className="text-text-primary mb-2 text-2xl font-bold md:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-text-secondary">
              {filteredProducts.length} productos
            </p>
          )}
        </div>
      )}

      {/* Category Filter - Desktop & Mobile */}
      {showCategoryFilter && (
        <div className="mb-6">
          {showUnavailableCategory ? (
            <CategoryFilterWithState
              selected={category}
              onSelect={setCategory}
            />
          ) : (
            <CategoryFilter selected={category} onSelect={setCategory} />
          )}
        </div>
      )}

      {/* FilterBar - Solo visible en desktop (lg+) */}
      {showFilters && !showUnavailableCategory && (
        <div className="hidden lg:block">
          <FilterBar />
        </div>
      )}

      {/* Botón flotante de filtros - Solo visible en mobile/tablet */}
      {showFilters && !showUnavailableCategory && (
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-brand hover:bg-brand-hover fixed right-4 bottom-2 z-30 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 lg:hidden"
          aria-label="Abrir filtros"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <span className="text-brand flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* Drawer de filtros para mobile */}
      {showFilters && !showUnavailableCategory && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden ${
              showMobileFilters
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onClick={handleCloseMobileFilters}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={`bg-card fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl transition-transform duration-300 ease-out lg:hidden ${
              showMobileFilters ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ maxHeight: "85vh", overflowY: "auto" }}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            {/* Header */}
            <div className="border-border bg-card sticky top-0 flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <h2 className="text-text-primary text-lg font-semibold">
                  Filtros
                </h2>
                {activeFilterCount > 0 && (
                  <span className="bg-brand flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseMobileFilters}
                className="hover:bg-surface-muted flex h-10 w-10 items-center justify-center rounded-full"
                aria-label="Cerrar filtros"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <FilterBar />
            </div>

            {/* Footer */}
            <div className="border-border bg-card sticky bottom-0 flex gap-3 border-t p-4">
              <button
                onClick={handleCloseMobileFilters}
                className="border-border bg-card text-text-primary hover:bg-surface-muted flex h-12 flex-1 items-center justify-center rounded-full border font-semibold transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleCloseMobileFilters}
                className="bg-brand hover:bg-brand-hover flex h-12 flex-1 items-center justify-center rounded-full font-semibold text-white transition-colors"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}

      {/* Product Grid */}
      <ProductGrid products={paginatedProducts} />

      {/* Pagination */}
      {!showUnavailableCategory && pagination.totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-text-secondary text-sm">
            Mostrando{" "}
            <span className="text-text-primary font-medium">
              {pagination.startIndex + 1}
            </span>{" "}
            -{" "}
            <span className="text-text-primary font-medium">
              {pagination.endIndex}
            </span>{" "}
            de{" "}
            <span className="text-text-primary font-medium">
              {filteredProducts.length}
            </span>
          </p>
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            pages={pagination.pages}
            canGoPrevious={pagination.canGoPrevious}
            canGoNext={pagination.canGoNext}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </section>
  );
}
