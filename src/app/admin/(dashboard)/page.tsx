/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        ADMIN DASHBOARD                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { Package, Tag, Layers, Smartphone, LucideIcon } from "lucide-react";
import Image from "next/image";

import { getDashboardStats } from "@/server/actions/products/getDashboardStats";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";
import { formatPrice, getConditionLabel } from "@/features/products/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Condition } from "@prisma/client";

// — Tipos —

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

interface RecentProduct {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  condition: Condition;
  isActive: boolean;
  images: { url: string }[];
}

// — Subcomponentes —

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground size-4" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

function RecentProductItem({ product }: { product: RecentProduct }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <div className="bg-muted size-12 shrink-0 overflow-hidden rounded-md">
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
        <p className="truncate text-sm font-medium">{product.title}</p>
        <span
          className={
            product.isActive ? "text-xs text-green-600" : "text-xs text-red-600"
          }
        >
          {product.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium">
          {formatPrice(product.price, product.currency)}
        </p>
        <p className="text-muted-foreground text-xs">
          {getConditionLabel(product.condition)}
        </p>
      </div>
    </div>
  );
}

// — Page —

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards: StatCardProps[] = [
    {
      title: "Productos",
      icon: Package,
      value: stats.totalProducts,
      description: `${stats.activeProducts} activos, ${stats.inactiveProducts} inactivos`,
    },
    {
      title: "Marcas",
      icon: Tag,
      value: stats.totalBrands,
      description: "En el catálogo",
    },
    {
      title: "Categorías",
      icon: Layers,
      value: stats.totalCategories,
      description: "Activas",
    },
    {
      title: "Modelos",
      icon: Smartphone,
      value: stats.totalModels,
      description: "En el catálogo",
    },
  ];

  return (
    <div className="flex max-w-5xl flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos Recientes</CardTitle>
          <CardDescription className="text-xs">
            Últimos 6 productos agregados al catálogo
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
                <RecentProductItem key={product.id} product={product} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
