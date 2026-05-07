"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/features/images/components/image-upload";

import { updateProduct } from "@/server/actions/products/updateProduct";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";

/**
 * Schema para editar producto.
 * AHORA: modelId directo, variantId opcional, color, stock.
 */
const productSchema = z.object({
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  variantId: z.string().optional(), // OPCIONAL ahora

  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  price: z.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  color: z.string().optional(),
  stock: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Option = { id: string; name: string };
type OptionWithRelation = { id: string; name: string; brandId?: string; categoryId?: string };

interface ProductData {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  condition: string;
  isActive: boolean;
  isFeatured: boolean;
  description: string | null;
  images: string[];
  brandId: string;
  categoryId: string;
  modelId: string;
  variantId: string | null;
  color: string | null;
  stock: number | null;
}

interface Props {
  product: ProductData;
  brands: Option[];
  categories: OptionWithRelation[];
  models: OptionWithRelation[];
  variants: Option[];
}

export function ProductEditForm({ product, brands, categories, models, variants }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brandId: product.brandId,
      categoryId: product.categoryId,
      modelId: product.modelId,
      variantId: product.variantId || "__none__",
      title: product.title,
      price: product.price ?? undefined,
      currency: product.currency as "ARS" | "USD",
      condition: product.condition as "NEW" | "USED" | "REFURBISHED",
      color: product.color || "",
      stock: product.stock ?? undefined,
      description: product.description ?? "",
      images: product.images,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    },
  });

  const selectedBrand = form.watch("brandId");
  const selectedCategory = form.watch("categoryId");

  // Filtrar categorías por marca
  const filteredCategories = useMemo(
    () => categories.filter((c) => c.brandId === selectedBrand),
    [categories, selectedBrand],
  );

  // Filtrar modelos por categoría
  const filteredModels = useMemo(
    () => models.filter((m) => m.categoryId === selectedCategory),
    [models, selectedCategory],
  );

  // Variantes GLOBALES (todas)
  const filteredVariants = variants;

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const result = await updateProduct(product.id, {
        title: data.title,
        price: data.price,
        currency: data.currency,
        condition: data.condition,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        description: data.description,
        modelId: data.modelId,
        variantId: data.variantId === "__none__" ? null : data.variantId,
        color: data.color,
        stock: data.stock,
        images: data.images,
      });
      if (result.success) {
        toast.success("Producto actualizado exitosamente");
      } else {
        toast.error(result.error || "Error al actualizar el producto");
      }
    } catch (err) {
      toast.error("Error al actualizar el producto");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Selects dependientes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedBrand}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Variante y Color */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="variantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variante (opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar variante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none__">Sin variante</SelectItem>
                    {filteredVariants.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Azul, Space Gray, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Título */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del producto</FormLabel>
              <FormControl>
                <Input placeholder="iPhone 13 128GB Azul - Estado Excelente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Precio, Moneda, Estado */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="650"
                    {...field}
                    value={(field.value as number) ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólares</SelectItem>
                    <SelectItem value="ARS">ARS - Pesos</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NEW">Nuevo</SelectItem>
                    <SelectItem value="USED">Usado</SelectItem>
                    <SelectItem value="REFURBISHED">Reacondicionado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Stock (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  {...field}
                  value={(field.value as number) ?? ""}
                  onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Switches */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Producto activo</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    El producto será visible en la tienda
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Producto destacado</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Mostrar en la sección de destacados
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el producto, estado de la batería, accesorios incluidos, etc."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Imágenes */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imágenes</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}