"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { updateSiteConfig, SiteConfigInput } from "@/server/actions/config/siteConfig";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

const heroSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
});

const bannerSchema = z.object({
  bannerText: z.string().optional(),
  bannerEnabled: z.boolean().optional(),
});

const storeSchema = z.object({
  storeName: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeAddress: z.string().optional(),
  storeSchedule: z.string().optional(),
  storeInstagram: z.string().optional(),
  storeEmail: z.string().optional(),
});

const ctaSchema = z.object({
  ctaTitle: z.string().optional(),
  ctaButtonText: z.string().optional(),
});

const seoSchema = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const footerSchema = z.object({
  footerText: z.string().optional(),
});

type ConfigSection = "hero" | "banner" | "store" | "cta" | "seo" | "footer";

interface ConfigData extends SiteConfigInput {
  [key: string]: string | boolean | undefined;
}

interface Props {
  config: ConfigData;
  section: ConfigSection;
}

function getSchema(section: ConfigSection) {
  switch (section) {
    case "hero": return heroSchema;
    case "banner": return bannerSchema;
    case "store": return storeSchema;
    case "cta": return ctaSchema;
    case "seo": return seoSchema;
    case "footer": return footerSchema;
  }
}

function getDefaultValues(section: ConfigSection, config: ConfigData) {
  switch (section) {
    case "hero": return { heroTitle: config.heroTitle || "", heroSubtitle: config.heroSubtitle || "" };
    case "banner": return { bannerText: config.bannerText || "", bannerEnabled: config.bannerEnabled || false };
    case "store": return {
      storeName: config.storeName || "",
      storeWhatsapp: config.storeWhatsapp || "",
      storeAddress: config.storeAddress || "",
      storeSchedule: config.storeSchedule || "",
      storeInstagram: config.storeInstagram || "",
      storeEmail: config.storeEmail || "",
    };
    case "cta": return { ctaTitle: config.ctaTitle || "", ctaButtonText: config.ctaButtonText || "" };
    case "seo": return { seoTitle: config.seoTitle || "", seoDescription: config.seoDescription || "" };
    case "footer": return { footerText: config.footerText || "" };
  }
}

export function SiteConfigForm({ config, section }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const schema = getSchema(section);
  const defaultValues = getDefaultValues(section, config);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmitting(true);
    try {
      const result = await updateSiteConfig(data);
      if (result.success) {
        toast.success("Configuración guardada");
      } else {
        toast.error(result.error || "Error al guardar");
      }
    } catch (err) {
      toast.error("Error al guardar la configuración");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {section === "hero" && (
          <>
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título principal</FormLabel>
                  <FormControl>
                    <Input placeholder="iPhones y Productos Apple con Garantía" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Encontrá el iPhone perfecto para vos..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "banner" && (
          <>
            <FormField
              control={form.control}
              name="bannerEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Banner habilitado</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mostrar el banner de urgencia
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto del banner</FormLabel>
                  <FormControl>
                    <Input placeholder="🔥 Nuevos ingresos de iPhone 16 Pro - Stock limitado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "store" && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la tienda</FormLabel>
                    <FormControl>
                      <Input placeholder="Donaapple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeWhatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="+54 9 2324 687617" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle 25 N° 465, Mercedes, Buenos Aires" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeInstagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="donaapple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="donaapple@gmail.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="storeSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horario de atención</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lunes a viernes: 09:00 - 20:30&#10;Sábado: 09:00 - 13:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "cta" && (
          <>
            <FormField
              control={form.control}
              name="ctaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del CTA</FormLabel>
                  <FormControl>
                    <Input placeholder="¿No encontrás lo que buscás?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaButtonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto del botón</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribinos por WhatsApp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "seo" && (
          <>
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (SEO)</FormLabel>
                  <FormControl>
                    <Input placeholder="Donaapple | iPhones y Productos Apple..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (SEO)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="iPhones, iPads, Macs y accesorios Apple..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "footer" && (
          <FormField
            control={form.control}
            name="footerText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto del footer</FormLabel>
                <FormControl>
                  <Input placeholder="© 2024 Donaapple. Todos los derechos reservados." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}