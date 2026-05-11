"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { updateSiteConfig, SiteConfigInput } from "@/server/actions/config/siteConfig";

import { PaymentMethodsEditor } from "./PaymentMethodsEditor";
import { BannerMessagesEditor } from "./BannerMessagesEditor";
import { StoreFeaturesEditor } from "./StoreFeaturesEditor";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { SubmitButton } from "@/shared/components/ui/submit-button";
import { ImageUpload } from "@/features/images/components/image-upload";

const storeFeatureSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const configSchema = z.object({
  bannerMessages: z.array(z.string()).optional(),
  bannerEnabled: z.boolean().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroCtaPrimary: z.string().optional(),
  heroCtaSecondary: z.string().optional(),
  heroImages: z.array(z.string()).optional(),
  featuredTitle: z.string().optional(),
  featuredSubtitle: z.string().optional(),
  testimonialsTitle: z.string().optional(),
  testimonialsSubtitle: z.string().optional(),
  testimonialsRatingText: z.string().optional(),
  testimonialsInstagramCta: z.string().optional(),
  testimonialsInstagramUrl: z.string().optional(),
  storeName: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeAddress: z.string().optional(),
  storeNeighborhood: z.string().optional(),
  storeCity: z.string().optional(),
  storePhone: z.string().optional(),
  storeSchedule: z.string().optional(),
  storeInstagram: z.string().optional(),
  storeEmail: z.string().optional(),
  storeFinancingTitle: z.string().optional(),
  storeFinancingSubtitle: z.string().optional(),
  paymentMethods: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaSubtitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaBadge1: z.string().optional(),
  ctaBadge2: z.string().optional(),
  ctaBadge3: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  footerBrand: z.string().optional(),
  footerText: z.string().optional(),
  storeFeatures: z.array(storeFeatureSchema).optional(),
});

type ConfigFormData = z.infer<typeof configSchema>;

type ConfigData = {
  bannerMessages?: string[];
  bannerEnabled?: boolean;
  storeFeatures?: { title: string; description: string }[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroImages?: string | string[];
  featuredTitle?: string;
  featuredSubtitle?: string;
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  testimonialsRatingText?: string;
  testimonialsInstagramCta?: string;
  testimonialsInstagramUrl?: string;
  storeName?: string;
  storeWhatsapp?: string;
  storeAddress?: string;
  storeNeighborhood?: string;
  storeCity?: string;
  storePhone?: string;
  storeSchedule?: string;
  storeInstagram?: string;
  storeEmail?: string;
  storeFinancingTitle?: string;
  storeFinancingSubtitle?: string;
  paymentMethods?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaBadge1?: string;
  ctaBadge2?: string;
  ctaBadge3?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerBrand?: string;
  footerText?: string;
};

interface Props {
  config: ConfigData;
  section: string;
}

const sectionFields: Record<string, string[]> = {
  banner: ["bannerMessages", "bannerEnabled"],
  hero: ["heroTitle", "heroSubtitle", "heroDescription", "heroCtaPrimary", "heroCtaSecondary", "heroImages"],
  featured: ["featuredTitle", "featuredSubtitle"],
  testimonials: ["testimonialsTitle", "testimonialsSubtitle", "testimonialsRatingText", "testimonialsInstagramCta", "testimonialsInstagramUrl"],
  store: ["storeName", "storeWhatsapp", "storeAddress", "storeNeighborhood", "storeCity", "storePhone", "storeSchedule", "storeInstagram", "storeEmail", "storeFinancingTitle", "storeFinancingSubtitle", "storeFeatures"],
  payment: ["paymentMethods"],
  cta: ["ctaTitle", "ctaSubtitle", "ctaDescription", "ctaButtonText", "ctaBadge1", "ctaBadge2", "ctaBadge3"],
  footer: ["footerBrand", "footerText"],
  seo: ["seoTitle", "seoDescription"],
};

function getDefaultValues(section: string, config: ConfigData): Partial<ConfigFormData> {
  const fields = sectionFields[section as keyof typeof sectionFields] || [];
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    const value = (config as Record<string, unknown>)[field];
    if (field === "bannerEnabled") {
      defaults[field] = value === true;
    } else if (field === "bannerMessages") {
      if (Array.isArray(value)) {
        defaults[field] = value;
      } else if (typeof value === "string") {
        try {
          defaults[field] = JSON.parse(value);
        } catch {
          defaults[field] = [];
        }
      } else {
        defaults[field] = [];
      }
    } else if (field === "heroImages") {
      if (Array.isArray(value)) {
        defaults[field] = value;
      } else if (typeof value === "string") {
        try {
          defaults[field] = JSON.parse(value);
        } catch {
          defaults[field] = [];
        }
      } else {
        defaults[field] = [];
      }
    } else if (field === "storeFeatures") {
      if (Array.isArray(value)) {
        defaults[field] = value;
      } else if (typeof value === "string") {
        try {
          defaults[field] = JSON.parse(value);
        } catch {
          defaults[field] = [];
        }
      } else {
        defaults[field] = [];
      }
    } else if (typeof value === "string") {
      defaults[field] = value;
    } else {
      defaults[field] = "";
    }
  }
  return defaults as Partial<ConfigFormData>;
}

export function SiteConfigForm({ config, section }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const fields = sectionFields[section as keyof typeof sectionFields] || [];

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: getDefaultValues(section, config),
  });

  const onSubmit = async (data: ConfigFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        bannerMessages: data.bannerMessages
          ? JSON.stringify(data.bannerMessages)
          : "[]",
        storeFeatures: data.storeFeatures
          ? JSON.stringify(data.storeFeatures)
          : "[]",
        heroImages:
          data.heroImages && Array.isArray(data.heroImages)
            ? JSON.stringify(data.heroImages)
            : data.heroImages,
      };
      const result = await updateSiteConfig(payload);
      if (result.success) {
        toast.success("Configuración guardada");
      } else {
        toast.error(result.error || "Error al guardar");
      }
    } catch {
      toast.error("Error al guardar la configuración");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerMessages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensajes del banner</FormLabel>
                  <FormControl>
                    <BannerMessagesEditor
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "hero" && (
          <>
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo (badge superior)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu tienda Apple en Mercedes, Buenos Aires" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título principal</FormLabel>
                  <FormControl>
                    <Input placeholder="Encontrá tu iPhone, iPad o Mac con garantía" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Equipos Apple nuevos y usados seleccionados..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heroCtaPrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Botón principal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ver catálogo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heroCtaSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Botón secundario</FormLabel>
                    <FormControl>
                      <Input placeholder="Envianos un mensaje" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="heroImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imágenes del carrusel</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "featured" && (
          <>
            <FormField
              control={form.control}
              name="featuredTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Últimos Ingresos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featuredSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Los productos más recientes agregados al catálogo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "testimonials" && (
          <>
            <FormField
              control={form.control}
              name="testimonialsTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la sección</FormLabel>
                  <FormControl>
                    <Input placeholder="Lo que dicen nuestros clientes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="testimonialsSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Miles de personas ya confiaron en nosotros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="testimonialsRatingText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de rating</FormLabel>
                    <FormControl>
                      <Input placeholder="4.9/5 basado en +500 ventas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testimonialsInstagramCta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto botón Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Seguinos en Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="testimonialsInstagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/donaapple" {...field} />
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
                name="storePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+54 9 2324 687617" {...field} />
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
              <FormField
                control={form.control}
                name="storeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle 25 N° 465" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeNeighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barrio</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Mercedes, Buenos Aires" {...field} />
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
                    <FormLabel>Instagram (sin @)</FormLabel>
                    <FormControl>
                      <Input placeholder="donaapple" {...field} />
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
                    <Textarea
                      placeholder="Lunes a viernes: 09:00 - 20:30&#10;Sábados: 09:00 - 13:00&#10;Domingos: Cerrado"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storeFinancingTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Título financiación</FormLabel>
                    <FormControl>
                      <Input placeholder="¡Financiación disponible!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storeFinancingSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo financiación</FormLabel>
                    <FormControl>
                      <Input placeholder="Cuotas sin interés con tarjeta de crédito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="storeFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features de la tienda</FormLabel>
                  <FormControl>
                    <StoreFeaturesEditor
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {section === "payment" && (
          <FormField
            control={form.control}
            name="paymentMethods"
            render={({ field }) => {
              const methods = (() => {
                try {
                  return field.value && field.value !== "[]" 
                    ? JSON.parse(field.value) 
                    : [];
                } catch {
                  return [];
                }
              })();

              return (
                <FormItem>
                  <FormLabel>Métodos de pago</FormLabel>
                  <FormControl>
                    <PaymentMethodsEditor
                      value={methods}
                      onChange={(newMethods) => {
                        field.onChange(JSON.stringify(newMethods));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {section === "cta" && (
          <>
            <FormField
              control={form.control}
              name="ctaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Encontrá tu próximo iPhone hoy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nosotros te lo trabajamos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Miles de clientes satisfechos ya confiaron en nosotros..." {...field} />
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
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ctaBadge1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Garantía incluida" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ctaBadge2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Envío en 24-48hs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ctaBadge3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge 3</FormLabel>
                    <FormControl>
                      <Input placeholder="+500 clientes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {section === "footer" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="footerBrand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="Donaapple" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu mejor opción en iPhones nuevos y usados..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

        <SubmitButton submitting={submitting} />
      </form>
    </Form>
  );
}