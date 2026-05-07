/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - EDITAR PRODUCTO                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * AHORA: Usa ProductForm unificado con mode="edit"
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getProductById } from "@/server/actions/products/getProducts";
import { getCatalogOptions } from "@/server/actions/products/getCatalogOptions";

import { ProductForm, type ProductData } from "@/features/products/components/ProductForm";
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
  const variants = catalogOptions.variants.map((v) => ({ id: v.id, name: v.name }));

  const productData: ProductData = {
    id: product.id,
    title: product.title,
    price: product.price,
    currency: product.currency,
    condition: product.condition,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    description: product.description ?? null,
    images: product.images.map((img) => img.url),
    brandId: product.model?.category?.brand?.id || "",
    categoryId: product.model?.category?.id || "",
    modelId: product.model?.id || "",
    variantId: product.variant?.id || null,
    color: product.color || null,
    stock: product.stock ?? null,
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
          <ProductForm
            mode="edit"
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