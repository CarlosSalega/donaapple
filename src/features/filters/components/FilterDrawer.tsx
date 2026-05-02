"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { FilterBar } from "./FilterBar";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilterCount: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  activeFilterCount,
}: FilterDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "bg-card fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl transition-transform duration-300 ease-out",
          "max-h-[85vh] overflow-y-auto",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
      >
        {/* Header */}
        <div className="border-border bg-card sticky top-0 flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-text-primary text-lg font-semibold">Filtros</h2>
            {activeFilterCount > 0 && (
              <span className="bg-brand flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
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
            onClick={onClose}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-full text-sm",
              "border-border bg-card text-text-primary border font-semibold",
              "hover:bg-surface-muted transition-colors",
            )}
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className={cn(
              "flex h-10 flex-1 items-center justify-center rounded-full text-sm",
              "bg-brand font-semibold text-white",
              "hover:bg-brand-hover transition-colors",
            )}
          >
            Ver resultados
          </button>
        </div>
      </div>
    </>
  );
}

interface FilterFloatingButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

export function FilterFloatingButton({
  onClick,
  activeFilterCount,
}: FilterFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-6 bottom-6 z-30 flex items-center gap-2 rounded-full",
        "bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg",
        "hover:bg-brand-hover transition-all hover:scale-105",
        "lg:hidden",
      )}
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
  );
}
