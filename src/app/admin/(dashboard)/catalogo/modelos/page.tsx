/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - MODELOS                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getModels } from "@/server/actions/catalogo/model";
import { getCategories } from "@/server/actions/catalogo/category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";

export default async function ModelosPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [models, categories] = await Promise.all([
    getModels(),
    getCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, { name: c.name, brand: c.brand?.name || "" }]));

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Modelos</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná los modelos del catálogo
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/catalogo/modelos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Modelo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Modelos ({models.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No hay modelos creados. ¡Crea el primero!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => {
                const catInfo = categoryMap.get(model.categoryId);
                return (
                  <div
                    key={model.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{model.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {catInfo?.brand || ""} • {catInfo?.name || ""} • {model._count.variants} variantes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={model.isActive ? "default" : "secondary"}>
                        {model.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/catalogo/modelos/${model.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}