/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - EDITAR PRODUCTO                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getProductById } from "@/server/actions/products/getProducts";
import { getCatalogOptions } from "@/server/actions/products/getCatalogOptions";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";

import { ProductEditForm } from "./product-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [product, catalogOptions] = await Promise.all([
    getProductById(id),
    getCatalogOptions(),
  ]);

  if (!product) {
    redirect("/admin/productos");
  }

  const brands = catalogOptions.brands.map((b) => ({ id: b.id, name: b.name }));
  const categories = catalogOptions.categories.map((c) => ({ id: c.id, name: c.name, brandId: c.brandId }));
  const models = catalogOptions.models.map((m) => ({ id: m.id, name: m.name, categoryId: m.categoryId }));
  const variants = catalogOptions.variants.map((v) => ({ id: v.id, name: v.name, modelId: v.modelId }));

  const productData = {
    ...product,
    description: product.description ?? null,
    images: product.images.map((img) => img.url),
    brandId: product.variant.model.category.brand.id,
    categoryId: product.variant.model.category.id,
    modelId: product.variant.model.id,
    variantId: product.variant.id,
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Producto</h1>
        <p className="text-sm text-muted-foreground">
          Modificá los datos del producto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductEditForm
            product={productData}
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