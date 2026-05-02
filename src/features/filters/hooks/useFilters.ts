"use client";

import { useState, useCallback, useMemo } from "react";
import type { ProductCondition } from "@/features/catalog/types/product";

export interface FiltersState {
  model: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  condition: ProductCondition | null;
  storage: string | null;
}

const initialFilters: FiltersState = {
  model: null,
  minPrice: null,
  maxPrice: null,
  condition: null,
  storage: null,
};

export function useFilters() {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  const setFilter = useCallback(
    <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((v) => v !== null);
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== null).length;
  }, [filters]);

  return {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
