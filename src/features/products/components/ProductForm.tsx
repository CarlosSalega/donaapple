"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/features/images/components/image-upload";
import {
  EntityCombobox,
  type EntityOption,
} from "@/shared/components/entity-combobox";
import { VariantCombobox } from "@/shared/components/variant-combobox";

import { createProduct } from "@/server/actions/products/createProduct";
import { updateProduct } from "@/server/actions/products/updateProduct";
import { createBrand } from "@/server/actions/catalogo/brand";
import { createCategory } from "@/server/actions/catalogo/category";
import { createModel } from "@/server/actions/catalogo/model";

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
import { Switch } from "@/shared/components/ui/switch";

type OptionWithRelation = {
  id: string;
  name: string;
  brandId?: string;
  categoryId?: string;
};

export type ProductData = {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  condition: "NEW" | "USED" | "REFURBISHED";
  isActive: boolean;
  isFeatured: boolean;
  description: string | null;
  images: string[];
  brandId: string;
  categoryId: string;
  modelId: string;
  variantIds: string[];
  color: string | null;
  stock: number | null;
};

const baseSchema = z.object({
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  modelId: z.string().min(1, "El modelo es requerido"),
  variantIds: z.array(z.string()).max(3, "Máximo 3 variantes permitidas"),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  price: z.coerce.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  color: z.string().optional(),
  stock: z.coerce.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type BaseProductFormValues = z.infer<typeof baseSchema>;

interface Props {
  mode: "create" | "edit";
  product?: ProductData;
  brands: EntityOption[];
  categories: OptionWithRelation[];
  models: OptionWithRelation[];
  variants: EntityOption[];
  onSuccess?: () => void;
}

const defaultValues = {
  brandId: "",
  categoryId: "",
  modelId: "",
  variantIds: [] as string[],
  title: "",
  price: undefined as number | undefined,
  currency: "USD" as const,
  condition: "USED" as const,
  color: "",
  stock: undefined as number | undefined,
  description: "",
  images: [] as string[],
  isFeatured: false,
  isActive: true,
};

export function ProductForm({
  mode,
  product,
  brands,
  categories,
  models,
  variants,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const schema = baseSchema;

  const initialValues = useMemo(() => {
    if (mode === "edit" && product) {
      return {
        brandId: product.brandId,
        categoryId: product.categoryId,
        modelId: product.modelId,
        variantIds: product.variantIds || [],
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
      };
    }
    return defaultValues;
  }, [mode, product]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const selectedBrand = form.watch("brandId");
  const selectedCategory = form.watch("categoryId");
  const selectedModel = form.watch("modelId");
  const selectedVariantIds = form.watch("variantIds");
  const selectedColor = form.watch("color");

  const filteredCategories = useMemo(
    () => (selectedBrand ? categories.filter((c) => c.brandId === selectedBrand) : []),
    [categories, selectedBrand],
  );

  const filteredModels = useMemo(
    () => models.filter((m) => m.categoryId === selectedCategory),
    [models, selectedCategory],
  );

  const filteredVariants = variants;

  const brandName = useMemo(() => {
    return brands.find((b) => b.id === selectedBrand)?.name || "";
  }, [brands, selectedBrand]);

  const modelName = useMemo(() => {
    return models.find((m) => m.id === selectedModel)?.name || "";
  }, [models, selectedModel]);

  const variantNames = useMemo(() => {
    if (!selectedVariantIds || selectedVariantIds.length === 0) return "";
    return selectedVariantIds
      .map((id) => variants.find((v) => v.id === id)?.name)
      .filter(Boolean)
      .join(" + ");
  }, [variants, selectedVariantIds]);

  useEffect(() => {
    if (selectedBrand) {
      form.setValue("categoryId", "");
      form.setValue("modelId", "");
    }
  }, [selectedBrand, form]);

  useEffect(() => {
    if (selectedCategory) {
      form.setValue("modelId", "");
    }
  }, [selectedCategory, form]);

  const autoTitle = useMemo(() => {
    const parts = [brandName, modelName, variantNames, selectedColor].filter(
      Boolean,
    );
    return parts.join(" ");
  }, [brandName, modelName, variantNames, selectedColor]);

  useEffect(() => {
    if (autoTitle && autoTitle.length >= 3 && mode === "create") {
      const currentTitle = form.getValues("title");
      if (!currentTitle || currentTitle.length < 3) {
        form.setValue("title", autoTitle);
      }
    }
  }, [autoTitle, form, mode]);

  const handleBrandCreate = async (name: string) => {
    const result = await createBrand({ name, isActive: true });
    if (result.success && result.brand) {
      return {
        success: true,
        entity: { id: result.brand.id, name: result.brand.name },
      };
    }
    return { success: false, error: result.error };
  };

  const handleCategoryCreate = async (name: string) => {
    if (!selectedBrand) {
      return { success: false, error: "Seleccioná una marca primero" };
    }
    const result = await createCategory({
      name,
      brandId: selectedBrand,
      isActive: true,
    });
    if (result.success && result.category) {
      return {
        success: true,
        entity: { id: result.category.id, name: result.category.name },
      };
    }
    return { success: false, error: result.error };
  };

  const handleModelCreate = async (name: string) => {
    if (!selectedBrand || !selectedCategory) {
      return { success: false, error: "Seleccioná marca y categoría primero" };
    }
    const result = await createModel({
      name,
      brandId: selectedBrand,
      categoryId: selectedCategory,
      isActive: true,
    });
    if (result.success && result.model) {
      return {
        success: true,
        entity: { id: result.model.id, name: result.model.name },
      };
    }
    return { success: false, error: result.error };
  };

  const onSubmit = async (data: BaseProductFormValues) => {
    const validated = baseSchema.safeParse(data);
    if (!validated.success) {
      const firstError = validated.error.issues[0];
      toast.error(firstError?.message || "Validación fallida");
      return;
    }

    setSubmitting(true);
    try {
      let result;

      if (mode === "create") {
        result = await createProduct({
          modelId: validated.data.modelId,
          variantIds: validated.data.variantIds,
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
      } else {
        result = await updateProduct(product!.id, {
          title: validated.data.title,
          price: validated.data.price,
          currency: validated.data.currency,
          condition: validated.data.condition,
          isActive: validated.data.isActive,
          isFeatured: validated.data.isFeatured,
          description: validated.data.description,
          modelId: validated.data.modelId,
          variantIds: validated.data.variantIds,
          color: validated.data.color,
          stock: validated.data.stock,
          images: validated.data.images,
        });

        if (result.success) {
          toast.success("Producto actualizado exitosamente");
          onSuccess?.();
          router.push("/admin/productos");
        } else {
          toast.error(result.error || "Error al actualizar el producto");
        }
      }
    } catch (err) {
      toast.error(
        mode === "create"
          ? "Error al crear el producto"
          : "Error al actualizar el producto",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <EntityCombobox
                    entity="brand"
                    value={field.value}
                    onChange={field.onChange}
                    options={brands}
                    onCreate={handleBrandCreate}
                    placeholder="Buscar o crear marca..."
                  />
                </FormControl>
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
                <FormControl>
                  <EntityCombobox
                    entity="category"
                    value={field.value}
                    onChange={field.onChange}
                    options={filteredCategories}
                    onCreate={handleCategoryCreate}
                    placeholder="Buscar o crear categoría..."
                    disabled={!selectedBrand}
                  />
                </FormControl>
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
                <FormControl>
                  <EntityCombobox
                    entity="model"
                    value={field.value}
                    onChange={field.onChange}
                    options={filteredModels}
                    onCreate={handleModelCreate}
                    placeholder="Buscar o crear modelo..."
                    disabled={!selectedCategory}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="variantIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variantes (opcional, máximo 3)</FormLabel>
                <FormControl>
                  <VariantCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={filteredVariants}
                    maxItems={3}
                    placeholder="Buscar o crear variantes..."
                  />
                </FormControl>
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

        {autoTitle && autoTitle.length >= 3 && (
          <div className="bg-muted text-muted-foreground rounded-md p-3 text-sm">
            <span className="font-medium">Vista previa del título:</span>{" "}
            {autoTitle}
          </div>
        )}

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

        {mode === "edit" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Producto activo</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      El producto será visible en la tienda
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
                    <FormLabel className="text-base">
                      Producto destacado
                    </FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Mostrar en la sección de destacados
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

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
            {submitting
              ? "Guardando..."
              : mode === "create"
                ? "Guardar producto"
                : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
