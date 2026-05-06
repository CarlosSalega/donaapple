/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR CATEGORÍA (CLIENT)              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { updateCategory, deleteCategory } from "@/server/actions/catalogo/category";
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
import { Trash2 } from "lucide-react";

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

interface Category {
  id: string;
  name: string;
  brandId: string;
  isActive: boolean;
}

interface Props {
  category: Category;
  brands: Brand[];
}

export function EditarCategoriaClient({ category, brands }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      brandId: category.brandId,
      isActive: category.isActive,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const result = await updateCategory(category.id, data);
    if (result.success) {
      toast.success("Categoría actualizada exitosamente");
      router.push("/admin/catalogo/categorias");
    } else {
      toast.error(result.error || "Error al actualizar la categoría");
    }
  };

  const onDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta categoría? También se eliminarán todos sus modelos.")) {
      return;
    }
    setDeleting(true);
    const result = await deleteCategory(category.id);
    if (result.success) {
      toast.success("Categoría eliminada");
      router.push("/admin/catalogo/categorias");
    } else {
      toast.error(result.error || "Error al eliminar la categoría");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editar Categoría</h1>
          <p className="text-sm text-muted-foreground">
            Modificá los datos de la categoría
          </p>
        </div>
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleting}>
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting ? "Eliminando..." : "Eliminar"}
        </Button>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la categoría</FormLabel>
                <FormControl>
                  <Input placeholder="iPhone" {...field} />
                </FormControl>
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/catalogo/categorias")}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}