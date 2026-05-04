/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - LISTADO DE PRODUCTOS                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getProducts } from "@/server/actions/products/getProducts";
import { getCatalogOptions } from "@/server/actions/products/getCatalogOptions";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Package,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  StarOff,
} from "lucide-react";

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
  const condition = params.condition as string;
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
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <form className="flex flex-wrap gap-4">
            <div className="min-w-50 flex-1">
              <Input
                name="search"
                placeholder="Buscar productos..."
                defaultValue={search}
                className="w-full"
              />
            </div>
            <div className="w-37.5">
              <Select name="brandId" defaultValue={brandId || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {catalogOptions.brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-37.5">
              <Select name="condition" defaultValue={condition || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="USED">Usado</SelectItem>
                  <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-37.5">
              <Select name="isActive" defaultValue={isActive || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="secondary">
              Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {productsData.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="text-muted-foreground h-12 w-12" />
              <p className="text-muted-foreground mt-4">No hay productos</p>
              <Link href="/admin/productos/nuevo">
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
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
                          <div className="bg-muted h-12 w-12 shrink-0 overflow-hidden rounded-md">
                            {product.images[0] ? (
                              <img
                                src={resolveImageUrl(product.images[0].url)}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <Package className="h-6 w-6" />
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
                            <Star className="mr-1 h-3 w-3" />
                            Destacado
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/productos/${product.id}/editar`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/producto/${product.id}`}
                                target="_blank"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver en tienda
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <form
                                action={async () => {
                                  "use server";
                                  const { toggleProductActive } =
                                    await import("@/server/actions/products/manageProducts");
                                  await toggleProductActive(product.id);
                                }}
                              >
                                <button className="flex w-full items-center">
                                  {product.isActive ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Desactivar
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Activar
                                    </>
                                  )}
                                </button>
                              </form>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <form
                                action={async () => {
                                  "use server";
                                  const { toggleProductFeatured } =
                                    await import("@/server/actions/products/manageProducts");
                                  await toggleProductFeatured(product.id);
                                }}
                              >
                                <button className="flex w-full items-center">
                                  {product.isFeatured ? (
                                    <>
                                      <StarOff className="mr-2 h-4 w-4" />
                                      Quitar destacado
                                    </>
                                  ) : (
                                    <>
                                      <Star className="mr-2 h-4 w-4" />
                                      Destacar
                                    </>
                                  )}
                                </button>
                              </form>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <form
                                action={async () => {
                                  "use server";
                                  const { duplicateProduct } =
                                    await import("@/server/actions/products/manageProducts");
                                  await duplicateProduct(product.id);
                                }}
                              >
                                <button className="flex w-full items-center">
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicar
                                </button>
                              </form>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <form
                                action={async () => {
                                  "use server";
                                  const { deleteProduct } =
                                    await import("@/server/actions/products/manageProducts");
                                  await deleteProduct(product.id);
                                }}
                              >
                                <button className="text-destructive flex w-full items-center">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </button>
                              </form>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
