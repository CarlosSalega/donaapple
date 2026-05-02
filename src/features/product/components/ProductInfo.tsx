import type { Product } from "@/features/catalog/types/product";
import { CONDITION_LABELS } from "@/features/catalog/types/product";
import { Badge, ConditionBadge } from "@/features/catalog/components/Badge";
import { cn } from "@/shared/lib/utils";

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export function ProductInfo({ product, className }: ProductInfoProps) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {product.isNew && <Badge variant="new">Nuevo</Badge>}
          {product.isFeatured && <Badge variant="featured">Destacado</Badge>}
          <ConditionBadge condition={product.condition} />
        </div>

        <h1 className="text-text-primary mb-1 text-2xl font-bold md:text-3xl">
          {product.name}
        </h1>
        <p className="text-text-secondary text-lg">{product.storage}</p>
      </div>

      {/* Price */}
      <div className="border-border bg-surface-muted rounded-xl border p-4">
        <div className="flex items-end gap-3">
          {hasDiscount && (
            <span className="text-text-secondary text-lg line-through">
              US$ {product.originalPrice}
            </span>
          )}
          <span className="text-text-primary text-4xl font-bold">
            US$ {product.price}
          </span>
          {hasDiscount && <Badge variant="sale">-{discountPercentage}%</Badge>}
        </div>
        {hasDiscount && (
          <p className="text-success mt-1 text-sm">
            ¡Ahorraste US$ {product.originalPrice! - product.price}!
          </p>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h2 className="text-text-primary text-lg font-semibold">
          Detalles del producto
        </h2>

        <dl className="grid grid-cols-2 gap-4">
          {product.battery && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔋</span>
                <div>
                  <dt className="text-text-secondary text-xs">Batería</dt>
                  <dd className="text-text-primary font-medium">
                    {product.battery}
                  </dd>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <div>
              <dt className="text-text-secondary text-xs">Condición</dt>
              <dd className="text-text-primary font-medium">
                {CONDITION_LABELS[product.condition]}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <div>
              <dt className="text-text-secondary text-xs">Almacenamiento</dt>
              <dd className="text-text-primary font-medium">
                {product.storage}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">🏷️</span>
            <div>
              <dt className="text-text-secondary text-xs">Modelo</dt>
              <dd className="text-text-primary font-medium">{product.model}</dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <dt className="text-text-secondary text-xs">Garantía</dt>
              <dd className="text-text-primary font-medium">
                {product.warranty || "Sin garantía"}
              </dd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <div>
              <dt className="text-text-secondary text-xs">Stock</dt>
              <dd
                className={cn(
                  "font-medium",
                  product.stock <= 3 ? "text-warning" : "text-text-primary",
                )}
              >
                {product.stock <= 3
                  ? `¡Solo ${product.stock} restantes!`
                  : `${product.stock} disponibles`}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-2">
          <h2 className="text-text-primary text-lg font-semibold">
            Descripción
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-text-primary text-lg font-semibold">
            Colores disponibles
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="border-border bg-card text-text-primary inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
