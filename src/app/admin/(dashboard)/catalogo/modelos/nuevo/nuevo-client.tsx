/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVO MODELO (CLIENT)                     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { createModel } from "@/server/actions/catalogo/model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const modelFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brandId: z.string().min(1, "La marca es requerida"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  isActive: z.boolean().optional(),
});

type ModelFormValues = z.infer<typeof modelFormSchema>;

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  brandId: string;
}

interface Props {
  brands: Brand[];
  categories: Category[];
}

export function NuevoModeloClient({ brands, categories }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: "",
      brandId: "",
      categoryId: "",
      isActive: true,
    },
  });

  const selectedBrand = form.watch("brandId");

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.brandId === selectedBrand),
    [categories, selectedBrand],
  );

  const onSubmit = async (data: ModelFormValues) => {
    const result = await createModel(data);
    if (result.success) {
      toast.success("Modelo creado exitosamente");
      router.push("/admin/catalogo/modelos");
    } else {
      toast.error(result.error || "Error al crear el modelo");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo Modelo</h1>
        <p className="text-sm text-muted-foreground">
          Agregá un nuevo modelo al catálogo
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
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
                      <SelectValue placeholder={selectedBrand ? "Seleccionar categoría" : "Primero seleccioná una marca"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del modelo</FormLabel>
                <FormControl>
                  <Input placeholder="iPhone 15 Pro" {...field} />
                </FormControl>
                <FormDescription>
                  Ej: iPhone 15 Pro, MacBook Air M3, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Activo</FormLabel>
                  <FormDescription>
                    Los modelos inactivos no aparecen en el formulario.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/catalogo/modelos")}>
              Cancelar
            </Button>
            <Button type="submit">Crear Modelo</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}