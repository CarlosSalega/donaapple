/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR MARCA (CLIENT)                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { updateBrand, deleteBrand } from "@/server/actions/catalogo/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const brandFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  isActive: z.boolean().optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

interface Brand {
  id: string;
  name: string;
  isActive: boolean;
}

interface Props {
  brand: Brand;
}

export function EditarMarcaClient({ brand }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: brand.name,
      isActive: brand.isActive,
    },
  });

  const onSubmit = async (data: BrandFormValues) => {
    const result = await updateBrand(brand.id, data);
    if (result.success) {
      toast.success("Marca actualizada exitosamente");
      router.push("/admin/catalogo/marcas");
    } else {
      toast.error(result.error || "Error al actualizar la marca");
    }
  };

  const onDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta marca? También se eliminarán todas sus categorías y modelos.")) {
      return;
    }
    setDeleting(true);
    const result = await deleteBrand(brand.id);
    if (result.success) {
      toast.success("Marca eliminada");
      router.push("/admin/catalogo/marcas");
    } else {
      toast.error(result.error || "Error al eliminar la marca");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editar Marca</h1>
          <p className="text-sm text-muted-foreground">
            Modificá los datos de la marca
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la marca</FormLabel>
                <FormControl>
                  <Input placeholder="Apple" {...field} />
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
                    Las marcas inactivas no aparecen en el formulario de productos.
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
            <Button type="button" variant="outline" onClick={() => router.push("/admin/catalogo/marcas")}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}