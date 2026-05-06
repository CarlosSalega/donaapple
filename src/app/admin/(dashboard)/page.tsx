/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        ADMIN DASHBOARD                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { Package, Tag } from "lucide-react";
import Image from "next/image";

import { getDashboardStats } from "@/server/actions/products/getDashboardStats";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

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

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-muted-foreground text-xs">
              {stats.activeProducts} activos, {stats.inactiveProducts} inactivos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas</CardTitle>
            <Tag className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBrands}</div>
            <p className="text-muted-foreground text-xs">En el catálogo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-muted-foreground text-xs">Activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modelos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalModels}</div>
            <p className="text-muted-foreground text-xs">En el catálogo</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Recientes</CardTitle>
          <CardDescription>
            Últimos productos agregados al catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No hay productos aún
              </p>
            ) : (
              stats.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="bg-muted h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    {product.images[0] ? (
                      <Image
                        src={resolveImageUrl(product.images[0].url)}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center">
                        <Package className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {product.variant.model.category.name} •{" "}
                      {product.variant.model.name} •{" "}
                      <span
                        className={
                          product.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {getConditionLabel(product.condition)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
