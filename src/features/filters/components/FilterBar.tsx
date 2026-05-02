"use client";

import {
  useFilters,
  type FiltersState,
} from "@/features/filters/hooks/useFilters";
import { FilterSelect } from "./FilterSelect";
import {
  IPHONE_MODELS,
  STORAGE_OPTIONS,
  CONDITION_LABELS,
} from "@/features/catalog/types/product";
import type { ProductCondition } from "@/features/catalog/types/product";
import { cn } from "@/shared/lib/utils";

const PRICE_RANGES = [
  { value: "0-300", label: "Hasta $300", min: 0, max: 300 },
  { value: "300-500", label: "$300 - $500", min: 300, max: 500 },
  { value: "500-800", label: "$500 - $800", min: 500, max: 800 },
  { value: "800-1000", label: "$800 - $1000", min: 800, max: 1000 },
  { value: "1000+", label: "Más de $1000", min: 1000, max: null },
];

interface FilterBarProps {
  onFilterChange?: (filters: FiltersState) => void;
  className?: string;
}

export function FilterBar({ onFilterChange, className }: FilterBarProps) {
  const {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useFilters();

  // Notify parent of filter changes
  if (onFilterChange) {
    onFilterChange(filters);
  }

  const modelOptions = IPHONE_MODELS.map((m) => ({
    value: m,
    label: m,
  }));

  const storageOptions = STORAGE_OPTIONS.map((s) => ({
    value: s,
    label: s,
  }));

  const conditionOptions: { value: ProductCondition; label: string }[] = [
    { value: "new", label: CONDITION_LABELS["new"] },
    { value: "refurbished", label: CONDITION_LABELS["refurbished"] },
    { value: "used-excellent", label: CONDITION_LABELS["used-excellent"] },
    { value: "used-good", label: CONDITION_LABELS["used-good"] },
  ];

  const priceOptions = PRICE_RANGES.map((p) => ({
    value: p.value,
    label: p.label,
  }));

  return (
    <div
      className={cn(
        "border-border bg-card mb-8 flex flex-col gap-4 rounded-2xl border p-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
            className="text-text-secondary"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span className="text-text-primary font-semibold">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-brand flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-brand hover:text-brand-hover text-sm font-medium"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <FilterSelect
          label="Modelo"
          value={filters.model}
          options={modelOptions}
          onChange={(v) => setFilter("model", v as string | null)}
        />

        <FilterSelect
          label="Almacenamiento"
          value={filters.storage}
          options={storageOptions}
          onChange={(v) => setFilter("storage", v as string | null)}
        />

        <FilterSelect
          label="Estado"
          value={filters.condition}
          options={conditionOptions}
          onChange={(v) => setFilter("condition", v as ProductCondition | null)}
        />

        <FilterSelect
          label="Precio"
          value={
            filters.minPrice !== null && filters.maxPrice !== null
              ? `${filters.minPrice}-${filters.maxPrice}`
              : filters.minPrice !== null
                ? `${filters.minPrice}+`
                : null
          }
          options={priceOptions}
          onChange={(v) => {
            if (!v) {
              setFilter("minPrice", null);
              setFilter("maxPrice", null);
              return;
            }
            const range = PRICE_RANGES.find((r) => r.value === v);
            if (range) {
              setFilter("minPrice", range.min);
              setFilter("maxPrice", range.max);
            }
          }}
        />
      </div>
    </div>
  );
}
