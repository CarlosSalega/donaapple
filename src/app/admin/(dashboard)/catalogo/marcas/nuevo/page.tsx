/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVA MARCA                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createBrand } from "@/server/actions/catalogo/brand";
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

const brandFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  isActive: z.boolean().optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export default function NuevaMarcaPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: BrandFormValues) => {
    const result = await createBrand(data);
    if (result.success) {
      toast.success("Marca creada exitosamente");
      router.push("/admin/catalogo/marcas");
    } else {
      toast.error(result.error || "Error al crear la marca");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Nueva Marca</h1>
        <p className="text-sm text-muted-foreground">
          Agregá una nueva marca al catálogo
        </p>
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
                <FormDescription>
                  Ej: Apple, Samsung, Motorola, etc.
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
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/catalogo/marcas")}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Marca</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}