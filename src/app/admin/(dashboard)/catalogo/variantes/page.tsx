/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - VARIANTES                                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getVariants } from "@/server/actions/catalogo/variant";
import { getModels } from "@/server/actions/catalogo/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";

export default async function VariantesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [variants, models] = await Promise.all([getVariants(), getModels()]);

  const modelMap = new Map(models.map((m) => [m.id, m.name]));

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Variantes</h1>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">
            Gestioná las variantes (capacidad, tamaño, etc.)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/catalogo/variantes/nuevo">
            <Plus className="mr-1 size-4" />
            Nueva Variante
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Variantes ({variants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              No hay variantes creadas. ¡Crea la primera!
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{variant.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {variant.model.brand.name} •{" "}
                      {modelMap.get(variant.modelId)} •{" "}
                      {variant._count.products} productos
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/admin/catalogo/variantes/${variant.id}/editar`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
