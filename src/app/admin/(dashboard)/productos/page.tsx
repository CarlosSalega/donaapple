/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - LISTADO DE PRODUCTOS                             ║
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
import { formatPrice, getConditionLabel } from "@/features/products/lib/format";
import { ProductActions } from "./product-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Star } from "lucide-react";

type Product = Awaited<ReturnType<typeof getProducts>>["products"][number];

type CatalogOptions = Awaited<ReturnType<typeof getCatalogOptions>>;

function ProductRow({
  product,
}: {
  product: Product;
  catalogOptions: CatalogOptions;
}) {
  const modelName = product.model?.name || "Sin modelo";
  const categoryName = product.model?.category?.name || "Sin categoría";
  const brandName = product.model?.category?.brand?.name || "Sin marca";
  const variantNames = product.variantNames?.join(" + ");

  return (
    <tr key={product.id} className="border-b">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-md">
            {product.images[0] ? (
              <Image
                src={resolveImageUrl(product.images[0].url, "product", "thumbnail")}
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
            <p className="truncate font-medium">{product.title}</p>
            <p className="text-muted-foreground text-xs">
              {brandName} • {categoryName} • {modelName}
              {variantNames ? ` • ${variantNames}` : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <Badge variant="outline">{categoryName}</Badge>
      </td>
      <td className="px-4 py-3 text-sm font-medium">
        {formatPrice(product.price, product.currency)}
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline">{getConditionLabel(product.condition)}</Badge>
      </td>
      <td className="px-4 py-3">
        {product.isFeatured ? (
          <Badge variant="default" className="bg-yellow-500">
            <Star className="mr-1 size-3" />
            Destacado
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <ProductActions
            productId={product.id}
            productSlug={product.slug}
            isActive={product.isActive}
            isFeatured={product.isFeatured}
          />
        </div>
      </td>
    </tr>
  );
}

function EmptyProducts() {
  return (
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
  );
}

function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {page > 1 && (
        <Link href={`/admin/productos?page=${page - 1}`}>
          <Button variant="outline" size="sm">
            Anterior
          </Button>
        </Link>
      )}
      <span className="text-muted-foreground text-sm">
        Página {page} de {totalPages}
      </span>
      {page < totalPages && (
        <Link href={`/admin/productos?page=${page + 1}`}>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </Link>
      )}
    </div>
  );
}

const TABLE_HEADERS = [
  "Producto",
  "Categoría",
  "Precio",
  "Estado",
  "Destacado",
  "Acciones",
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const search = (params.search as string) || "";
  const brandId = params.brandId as string;
  const categoryId = params.categoryId as string;
  const condition = params.condition as Condition | "all" | undefined;
  const isActive = params.isActive as string;

  const [productsData, catalogOptions] = await Promise.all([
    getProducts({
      page,
      search,
      brandId: brandId || undefined,
      categoryId: categoryId || undefined,
      condition: condition || undefined,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
    }),
    getCatalogOptions(),
  ]);

  const brandOptions = catalogOptions.brands.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Productos</h1>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Gestioná y filtrá los productos del catálogo
        </p>

        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <ProductFilters
        catalogOptions={{
          brands: brandOptions,
        }}
        search={search}
        brandId={brandId}
        condition={condition}
        isActive={isActive}
      />

      <Card>
        <CardHeader>
          <CardTitle>Todos los Productos ({productsData.total})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {productsData.products.length === 0 ? (
            <EmptyProducts />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    {TABLE_HEADERS.map((header, i) => (
                      <th
                        key={header}
                        className={`px-4 py-3 text-sm font-medium ${i === TABLE_HEADERS.length - 1 ? "text-right" : "text-left"}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsData.products.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      catalogOptions={catalogOptions}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination page={page} totalPages={productsData.totalPages} />
    </div>
  );
}
