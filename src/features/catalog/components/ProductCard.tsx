import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/features/catalog/types/product";
import { Badge, ConditionBadge } from "./Badge";
import { cn } from "@/shared/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;
  const isLowStock = product.stock <= 3;

  return (
    <article className="group bg-card border-border relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-lg">
      {/* Entire card is clickeable */}
      <Link
        href={`/producto/${product.id}`}
        className="flex flex-1 flex-col"
        aria-label={`Ver ${product.name} ${product.storage}`}
      >
        {/* Image Container */}
        <div className="bg-surface relative aspect-4/5 overflow-hidden">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300"
            priority={product.images[0].priority}
          />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="new">Nuevo</Badge>}
            {hasDiscount && (
              <Badge variant="sale">-{discountPercentage}%</Badge>
            )}
            {product.isFeatured && !product.isNew && (
              <Badge variant="featured">Destacado</Badge>
            )}
          </div>

          {/* Low stock warning */}
          {isLowStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="low-stock">¡Solo {product.stock}!</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Model & Storage */}
          <div className="mb-2">
            <h3 className="text-text-primary line-clamp-1 text-lg font-semibold">
              {product.name}
            </h3>
            <p className="text-text-secondary text-sm">{product.storage}</p>
          </div>

          {/* Condition & Battery */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <ConditionBadge condition={product.condition} />
            {product.battery && (
              <span className="text-text-secondary text-xs">
                🔋 {product.battery}
              </span>
            )}
          </div>

          {/* Description (truncated) */}
          {product.description && (
            <p className="text-text-secondary mb-4 line-clamp-2 text-sm">
              {product.description}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & CTA */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-text-secondary text-xs line-through">
                  US$ {product.originalPrice}
                </span>
              )}
              <span className="text-text-primary text-lg font-bold">
                US$ {product.price}
              </span>
            </div>

            {/* "Ver detalles" button */}
            <span
              className={cn(
                "flex h-10 items-center gap-2 rounded-full px-4",
                "border-brand border bg-transparent",
                "text-brand text-xs font-semibold",
                "group-hover:bg-brand/5 transition-all",
              )}
            >
              Ver detalles
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
