/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - NUEVO PRODUCTO                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Nuevo flujo UX según FUNCIONALIDAD_PRODUCTO.md:
 * - Selects dependientes: Marca → Categoría → Modelo
 * - Variantes globales (todas, sin filtrar por modelo)
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getCatalogOptions } from "@/server/actions/products/getCatalogOptions";

import { ProductForm } from "@/features/products/components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const catalogOptions = await getCatalogOptions();

  // Mapear para el formulario
  const brands = catalogOptions.brands.map((b) => ({ id: b.id, name: b.name }));
  const categories = catalogOptions.categories.map((c) => ({ 
    id: c.id, 
    name: c.name, 
    brandId: c.brandId 
  }));
  const models = catalogOptions.models.map((m) => ({ 
    id: m.id, 
    name: m.name, 
    categoryId: m.categoryId,
    brandId: m.brandId 
  }));
  // Variantes globales - todas juntas
  const variants = catalogOptions.variants.map((v) => ({ 
    id: v.id, 
    name: v.name 
  }));

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo Producto</h1>
        <p className="text-sm text-muted-foreground">
          Agregá un nuevo producto al catálogo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            brands={brands}
            categories={categories}
            models={models}
            variants={variants}
          />
        </CardContent>
      </Card>
    </div>
  );
}