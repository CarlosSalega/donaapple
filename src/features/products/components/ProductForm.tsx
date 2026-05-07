"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/features/images/components/image-upload";

import { createProduct } from "@/server/actions/products/createProduct";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

/**
 * Schema para el formulario de productos.
 * AHORA: modelId directo, variantId opcional, color, stock.
 */
const productSchema = z.object({
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  variantId: z.string().optional(),
  
  title: z.string().min(8, "El título debe tener al menos 8 caracteres"),
  price: z.coerce.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  color: z.string().optional(),
  stock: z.coerce.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Option = { id: string; name: string };
type OptionWithRelation = {
  id: string;
  name: string;
  brandId?: string;
  categoryId?: string;
};

interface Props {
  brands: Option[];
  categories: OptionWithRelation[];
  models: OptionWithRelation[];
  variants: Option[];
  onSuccess?: () => void;
}

export function ProductForm({
  brands,
  categories,
  models,
  variants,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brandId: "",
      categoryId: "",
      modelId: "",
      variantId: "__none__",
      title: "",
      price: undefined,
      currency: "USD",
      condition: "USED",
      color: "",
      stock: undefined,
      description: "",
      images: [],
      isFeatured: false,
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

  // Variantes GLOBALES - todas juntas (sin filtrar por modelo)
  const filteredVariants = variants;

  const onSubmit = async (data: ProductFormValues) => {
    const validated = productSchema.safeParse(data);
    if (!validated.success) {
      const firstError = validated.error.issues[0];
      toast.error(firstError?.message || "Validación fallida");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createProduct({
        modelId: validated.data.modelId,
        variantId: validated.data.variantId === "__none__" ? undefined : validated.data.variantId,
        title: validated.data.title,
        price: validated.data.price,
        currency: validated.data.currency,
        condition: validated.data.condition,
        color: validated.data.color,
        stock: validated.data.stock,
        description: validated.data.description,
        images: validated.data.images,
        isFeatured: validated.data.isFeatured,
      });
      if (result.success) {
        toast.success("Producto creado exitosamente");
        onSuccess?.();
        router.push("/admin/productos");
      } else {
        toast.error(result.error || "Error al crear el producto");
      }
    } catch (err) {
      toast.error("Error al crear el producto");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Selects dependientes: Marca → Categoría → Modelo */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedBrand}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedBrand
                            ? "Seleccionar categoría"
                            : "Primero seleccioná una marca"
                        }
                      />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCategory}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedCategory
                            ? "Seleccionar modelo"
                            : "Primero seleccioná una categoría"
                        }
                      />
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

        {/* Variante - GLOBALES (todas las opciones) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="variantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variante (opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                  <Input
                    placeholder="Azul, Space Gray, etc."
                    {...field}
                  />
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
                <Input
                  placeholder="iPhone 13 128GB Azul - Estado Excelente"
                  {...field}
                />
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
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="650"
                    {...field}
                    value={(value as number | undefined) ?? ""}
                    onChange={(e) =>
                      onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Stock (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  {...field}
                  value={(value as number | undefined) ?? ""}
                  onChange={(e) =>
                    onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className="min-h-25"
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
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSuccess?.();
              router.push("/admin/productos");
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}