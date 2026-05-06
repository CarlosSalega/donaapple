/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - MARCAS                                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getBrands } from "@/server/actions/catalogo/brand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";

export default async function MarcasPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const brands = await getBrands();

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marcas</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná las marcas del catálogo
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/catalogo/marcas/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Marca
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Marcas ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No hay marcas creadas. ¡Crea la primera!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{brand.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {brand._count.categories} categorías • {brand._count.models} modelos
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/catalogo/marcas/${brand.id}/editar`}>
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