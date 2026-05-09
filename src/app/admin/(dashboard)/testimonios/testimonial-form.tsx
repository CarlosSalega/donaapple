"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Switch } from "@/shared/components/ui/switch";
import { createTestimonial, updateTestimonial, TestimonialInput } from "@/server/actions/testimonials/testimonials";

interface TestimonialFormValues {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  date?: string;
  isActive: boolean;
  order: number;
}

interface TestimonialFormProps {
  initialData?: Partial<TestimonialFormValues>;
  testimonialId?: string;
  onSuccess?: () => void;
}

export function TestimonialForm({ initialData, testimonialId, onSuccess }: TestimonialFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TestimonialFormValues>({
    defaultValues: {
      name: initialData?.name || "",
      avatar: initialData?.avatar || "",
      rating: initialData?.rating || 5,
      text: initialData?.text || "",
      product: initialData?.product || "",
      date: initialData?.date || "",
      isActive: initialData?.isActive ?? true,
      order: initialData?.order ?? 0,
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    setSubmitting(true);
    try {
      const formData = {
        ...data,
        rating: Number(data.rating),
        order: Number(data.order),
      };
      const result = testimonialId
        ? await updateTestimonial(testimonialId, formData)
        : await createTestimonial(formData as TestimonialInput);

      if (result.success) {
        toast.success(testimonialId ? "Testimonio actualizado" : "Testimonio creado");
        onSuccess?.();
      } else {
        toast.error(result.error || "Error al guardar");
      }
    } catch (err) {
      toast.error("Error al guardar el testimonio");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar (iniciales)</FormLabel>
                <FormControl>
                  <Input placeholder="JP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (1-5)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="iPhone 15 Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Hace 2 semanas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Escribí el testimonio del cliente..." 
                  className="min-h-[120px]"
                  {...field} 
                />
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
                <FormLabel className="text-base">Activo</FormLabel>
                <p className="text-sm text-muted-foreground">
                  El testimonio aparecerá en la landing
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value ?? true}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}