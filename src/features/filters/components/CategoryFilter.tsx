import { cn } from "@/shared/lib/utils";

export type Category =
  | "all"
  | "iphone"
  | "mac"
  | "ipad"
  | "watch"
  | "airpods"
  | "accesorios";

interface CategoryOption {
  id: Category;
  label: string;
  emoji: string;
  hasProducts: boolean;
}

export const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "Todos", emoji: "📱", hasProducts: true },
  { id: "iphone", label: "iPhone", emoji: "📱", hasProducts: true },
  { id: "mac", label: "Mac", emoji: "💻", hasProducts: false },
  { id: "ipad", label: "iPad", emoji: "📲", hasProducts: false },
  { id: "watch", label: "Watch", emoji: "⌚", hasProducts: false },
  { id: "airpods", label: "AirPods", emoji: "🎧", hasProducts: false },
  { id: "accesorios", label: "Accesorios", emoji: "🔌", hasProducts: false },
];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
  className?: string;
}

export function CategoryFilter({
  selected,
  onSelect,
  className,
}: CategoryFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
      aria-label="Categorías de productos"
    >
      {CATEGORIES.map((category) => {
        const isSelected = selected === category.id;

        return (
          <button
            key={category.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(category.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
              "border transition-all",
              isSelected
                ? "border-brand bg-brand text-white"
                : "border-border bg-card text-text-primary hover:border-brand hover:text-brand",
            )}
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
