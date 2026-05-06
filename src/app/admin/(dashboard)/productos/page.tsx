/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - LISTADO DE PRODUCTOS                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { Condition } from "@prisma/client";
import Image from "next/image";

import { ProductFilters } from "@/features/filters/components/ProductFilters";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getProducts } from "@/server/actions/products/getProducts";
import { getCatalogOptions } from "@/server/actions/products/getCatalogOptions";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";
import { ProductActions } from "./product-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Star } from "lucide-react";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const search = (params.search as string) || "";
  const brandId = params.brandId as string;
  const categoryId = params.categoryId as string;
  const condition = params.condition as Condition | "all" | undefined;
  const isActive = params.isActive as string;

  const filters = {
    page,
    search,
    brandId: brandId || undefined,
    categoryId: categoryId || undefined,
    condition: condition || undefined,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
  };

  const [productsData, catalogOptions] = await Promise.all([
    getProducts(filters),
    getCatalogOptions(),
  ]);

  const formatPrice = (price: number | null, currency: string) => {
    if (!price) return "Sin precio";
    return `${currency === "ARS" ? "$" : "U$S"}${price.toLocaleString()}`;
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      NEW: "Nuevo",
      USED: "Usado",
      REFURBISHED: "Reacondicionado",
    };
    return labels[condition] || condition;
  };

  const getConditionVariant = (condition: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      NEW: "default",
      USED: "secondary",
      REFURBISHED: "outline",
    };
    return variants[condition] || "secondary";
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm">
            {productsData.total} producto{productsData.total !== 1 ? "s" : ""}{" "}
            en el catálogo
          </p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters
        catalogOptions={catalogOptions}
        search={search}
        brandId={brandId}
        condition={condition}
        isActive={isActive}
      />

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {productsData.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="text-muted-foreground size-12" />
              <p className="text-muted-foreground mt-4">No hay productos</p>
              <Link href="/admin/productos/nuevo">
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 size-4" />
                  Crear primer producto
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Destacado
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-md">
                            {product.images[0] ? (
                              <Image
                                src={resolveImageUrl(product.images[0].url)}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="text-muted-foreground flex size-full items-center justify-center">
                                <Package className="size-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {product.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {product.variant.model.category.brand.name} •{" "}
                              {product.variant.model.category.name} •{" "}
                              {product.variant.model.name} •{" "}
                              {product.variant.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">
                          {product.variant.model.category.name}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatPrice(product.price, product.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getConditionVariant(product.condition)}>
                          {getConditionLabel(product.condition)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {product.isFeatured ? (
                          <Badge variant="default" className="bg-yellow-500">
                            <Star className="mr-1 size-3" />
                            Destacado
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ProductActions
                          productId={product.id}
                          isActive={product.isActive}
                          isFeatured={product.isFeatured}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {productsData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/admin/productos?page=${page - 1}`}>
              <Button variant="outline" size="sm">
                Anterior
              </Button>
            </Link>
          )}
          <span className="text-muted-foreground text-sm">
            Página {page} de {productsData.totalPages}
          </span>
          {page < productsData.totalPages && (
            <Link href={`/admin/productos?page=${page + 1}`}>
              <Button variant="outline" size="sm">
                Siguiente
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
