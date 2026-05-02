import { cn } from "@/shared/lib/utils";
import type { ProductCondition } from "@/features/catalog/types/product";

interface BadgeProps {
  variant: "new" | "sale" | "featured" | "condition" | "low-stock";
  condition?: ProductCondition;
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  new: "bg-success text-white",
  sale: "bg-error text-white",
  featured: "bg-brand text-white",
  condition: "bg-surface text-text-secondary",
  "low-stock": "bg-warning text-white",
};

const conditionStyles: Record<ProductCondition, string> = {
  new: "bg-success text-white",
  refurbished: "bg-brand text-white",
  "used-excellent": "bg-warning text-white",
  "used-good": "bg-text-secondary text-white",
};

export function Badge({ variant, condition, children, className }: BadgeProps) {
  const baseStyle =
    variant === "condition" && condition
      ? conditionStyles[condition]
      : variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        baseStyle,
        className,
      )}
    >
      {children}
    </span>
  );
}

interface ConditionBadgeProps {
  condition: ProductCondition;
  className?: string;
}

const conditionLabels: Record<ProductCondition, string> = {
  new: "Nuevo",
  refurbished: "Reacondicionado",
  "used-excellent": "Excelente",
  "used-good": "Bueno",
};

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge variant="condition" condition={condition} className={className}>
      {conditionLabels[condition]}
    </Badge>
  );
}
