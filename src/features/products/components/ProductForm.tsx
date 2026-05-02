"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/features/images/components/ImageUpload";

import { createProduct } from "@/server/actions/products/createProduct";

// ---- SCHEMA ----

const productSchema = z.object({
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  modelId: z.string().min(1),
  variantId: z.string().min(1),

  title: z.string().min(3),
  price: z.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Subí al menos una imagen"),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ---- TYPES ----

type Option = { id: string; name: string };

interface Props {
  brands: Option[];
  categories: Option[];
  models: Option[];
  variants: Option[];
}

// ---- COMPONENT ----

export function ProductForm({ brands, categories, models, variants }: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      currency: "USD",
      condition: "USED",
      images: [],
    },
  });

  const { watch, setValue } = form;

  const selectedBrand = watch("brandId");
  const selectedCategory = watch("categoryId");
  const selectedModel = watch("modelId");
  const images = form.watch("images") || [];

  // ---- FILTERS ----

  const filteredCategories = useMemo(
    () => categories.filter((c: any) => c.brandId === selectedBrand),
    [categories, selectedBrand],
  );

  const filteredModels = useMemo(
    () => models.filter((m: any) => m.categoryId === selectedCategory),
    [models, selectedCategory],
  );

  const filteredVariants = useMemo(
    () => variants.filter((v: any) => v.modelId === selectedModel),
    [variants, selectedModel],
  );

  // ---- IMAGE HANDLER ----

  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;

    setImages((prev) => {
      const next = [...prev, url];
      setValue("images", next);
      return next;
    });
  };

  // ---- SUBMIT ----

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProduct(data);
      alert("Producto creado");
      form.reset({
        currency: "USD",
        condition: "USED",
        images: [],
      });
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  // ---- UI ----

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-2xl space-y-6"
    >
      {/* Marca */}
      <div>
        <label>Marca</label>
        <select {...form.register("brandId")} className="w-full border p-2">
          <option value="">Seleccionar</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Categoría */}
      <div>
        <label>Categoría</label>
        <select {...form.register("categoryId")} className="w-full border p-2">
          <option value="">Seleccionar</option>
          {filteredCategories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Modelo */}
      <div>
        <label>Modelo</label>
        <select {...form.register("modelId")} className="w-full border p-2">
          <option value="">Seleccionar</option>
          {filteredModels.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Variante */}
      <div>
        <label>Variante</label>
        <select {...form.register("variantId")} className="w-full border p-2">
          <option value="">Seleccionar</option>
          {filteredVariants.map((v: any) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Título */}
      <div>
        <label>Título</label>
        <input
          {...form.register("title")}
          className="w-full border p-2"
          placeholder="iPhone 13 128GB Azul"
        />
      </div>

      {/* Precio */}
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          {...form.register("price", { valueAsNumber: true })}
          placeholder="Precio"
          className="w-full border p-2"
        />

        <select {...form.register("currency")} className="border p-2">
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>
      </div>

      {/* Estado */}
      <div>
        <label>Estado</label>
        <select {...form.register("condition")} className="w-full border p-2">
          <option value="NEW">Nuevo</option>
          <option value="USED">Usado</option>
          <option value="REFURBISHED">Reacondicionado</option>
        </select>
      </div>

      {/* Imágenes */}
      <div>
        <label className="mb-2 block font-medium">Imágenes</label>

        <ImageUpload
          value={images}
          onChange={(value) => form.setValue("images", value)}
        />

        {form.formState.errors.images && (
          <p className="mt-1 text-sm text-red-500">
            {form.formState.errors.images.message}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label>Descripción</label>
        <textarea
          {...form.register("description")}
          className="w-full border p-2"
        />
      </div>

      {/* Submit */}
      <button type="submit" className="bg-black px-4 py-2 text-white">
        Guardar producto
      </button>
    </form>
  );
}
