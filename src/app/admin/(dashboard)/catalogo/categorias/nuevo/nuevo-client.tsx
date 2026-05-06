/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVA CATEGORÍA (CLIENT)                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCategory } from "@/server/actions/catalogo/category";
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

const categoryFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brandId: z.string().min(1, "La marca es requerida"),
  isActive: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface Brand {
  id: string;
  name: string;
}

interface Props {
  brands: Brand[];
}

export function NuevaCategoriaClient({ brands }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      brandId: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const result = await createCategory(data);
    if (result.success) {
      toast.success("Categoría creada exitosamente");
      router.push("/admin/catalogo/categorias");
    } else {
      toast.error(result.error || "Error al crear la categoría");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Nueva Categoría</h1>
        <p className="text-sm text-muted-foreground">
          Agregá una nueva categoría al catálogo
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
                <FormDescription>
                  La marca a la que pertenece esta categoría.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la categoría</FormLabel>
                <FormControl>
                  <Input placeholder="iPhone" {...field} />
                </FormControl>
                <FormDescription>
                  Ej: iPhone, Mac, iPad, etc.
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
                  <FormLabel className="text-base">Activa</FormLabel>
                  <FormDescription>
                    Las categorías inactivas no aparecen en el formulario.
                  </FormDescription>
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/catalogo/categorias")}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Categoría</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}