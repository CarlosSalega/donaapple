"use client";

import { useMemo } from "react";
import { cn } from "@/shared/lib/utils";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface PaginationResult {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  pages: (number | "...")[];
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: UsePaginationProps): PaginationResult {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const pages = useMemo(() => {
    const result: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      result.push(1);

      if (currentPage > 3) {
        result.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        result.push(i);
      }

      if (currentPage < totalPages - 2) {
        result.push("...");
      }

      result.push(totalPages);
    }

    return result;
  }, [totalPages, currentPage]);

  return {
    totalPages,
    startIndex,
    endIndex,
    pages,
    canGoNext,
    canGoPrevious,
  };
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pages: (number | "...")[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pages,
  canGoPrevious,
  canGoNext,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-2", className)}
      aria-label="Paginación"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Página anterior"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border",
          "text-sm font-medium transition-colors",
          canGoPrevious
            ? "border-border bg-card text-text-primary hover:border-brand hover:text-brand"
            : "border-border/50 bg-surface-muted text-text-secondary/50 cursor-not-allowed",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="text-text-secondary flex h-10 w-10 items-center justify-center"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Página ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
              "transition-colors",
              currentPage === page
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-text-primary hover:border-brand hover:text-brand",
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Página siguiente"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border",
          "text-sm font-medium transition-colors",
          canGoNext
            ? "border-border bg-card text-text-primary hover:border-brand hover:text-brand"
            : "border-border/50 bg-surface-muted text-text-secondary/50 cursor-not-allowed",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
