/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - CATEGORÍAS                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getCategories } from "@/server/actions/catalogo/category";
import { getBrands } from "@/server/actions/catalogo/brand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";

export default async function CategoriasPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  const brandMap = new Map(brands.map((b) => [b.id, b.name]));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">
            Gestioná las categorías del catálogo
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/catalogo/categorias/nuevo">
            <Plus className="mr-1 size-4" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Categorías ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No hay categorías creadas. ¡Crea la primera!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {brandMap.get(category.brandId) || "Sin marca"} •{" "}
                      {category._count.models} modelos
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/admin/catalogo/categorias/${category.id}/editar`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
