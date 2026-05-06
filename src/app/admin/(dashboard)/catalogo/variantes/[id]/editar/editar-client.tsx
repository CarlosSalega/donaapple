/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR VARIANTE (CLIENT)                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { updateVariant, deleteVariant } from "@/server/actions/catalogo/variant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const variantFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  modelId: z.string().min(1, "El modelo es requerido"),
  sku: z.string().optional(),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface Model {
  id: string;
  name: string;
  brand: { name: string };
}

interface Variant {
  id: string;
  name: string;
  modelId: string;
  sku: string | null;
}

interface Props {
  variant: Variant;
  models: Model[];
}

export function EditarVarianteClient({ variant, models }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      name: variant.name,
      modelId: variant.modelId,
      sku: variant.sku || "",
    },
  });

  const onSubmit = async (data: VariantFormValues) => {
    const result = await updateVariant(variant.id, data);
    if (result.success) {
      toast.success("Variante actualizada exitosamente");
      router.push("/admin/catalogo/variantes");
    } else {
      toast.error(result.error || "Error al actualizar la variante");
    }
  };

  const onDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta variante? También se eliminarán todos los productos.")) {
      return;
    }
    setDeleting(true);
    const result = await deleteVariant(variant.id);
    if (result.success) {
      toast.success("Variante eliminada");
      router.push("/admin/catalogo/variantes");
    } else {
      toast.error(result.error || "Error al eliminar la variante");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editar Variante</h1>
          <p className="text-sm text-muted-foreground">
            Modificá los datos de la variante
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
            name="modelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.brand.name} {model.name}
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
                <FormLabel>Nombre de la variante</FormLabel>
                <FormControl>
                  <Input placeholder="256GB" {...field} />
                </FormControl>
                <FormDescription>
                  Ej: 128GB, 256GB, 512GB, 1TB, 13", 15", etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="A1234" {...field} />
                </FormControl>
                <FormDescription>
                  Código interno opcional para inventario.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/catalogo/variantes")}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}