"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const siteConfigSchema = z.object({
  // Banner de urgencia
  bannerMessages: z.string().optional(),
  bannerEnabled: z.boolean().optional(),

  // Hero Section
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  heroCtaPrimary: z.string().optional(),
  heroCtaSecondary: z.string().optional(),
  heroImages: z.string().optional(),

  // Featured Products
  featuredTitle: z.string().optional(),
  featuredSubtitle: z.string().optional(),

  // Testimonials
  testimonialsTitle: z.string().optional(),
  testimonialsSubtitle: z.string().optional(),
  testimonialsRatingText: z.string().optional(),
  testimonialsInstagramCta: z.string().optional(),
  testimonialsInstagramUrl: z.string().optional(),

  // Info del negocio
  storeName: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeAddress: z.string().optional(),
  storeNeighborhood: z.string().optional(),
  storeCity: z.string().optional(),
  storePhone: z.string().optional(),
  storeSchedule: z.string().optional(),
  storeInstagram: z.string().optional(),
  storeEmail: z.string().optional(),
  storeFeatures: z.string().optional(),
  storeFinancingTitle: z.string().optional(),
  storeFinancingSubtitle: z.string().optional(),

  // Métodos de pago
  paymentMethods: z.string().optional(),

  // CTA final
  ctaTitle: z.string().optional(),
  ctaSubtitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  ctaButtonText: z.string().optional(),
  ctaBadge1: z.string().optional(),
  ctaBadge2: z.string().optional(),
  ctaBadge3: z.string().optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),

  // Footer
  footerBrand: z.string().optional(),
  footerText: z.string().optional(),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;

export async function getSiteConfig() {
  const defaultBannerMessages = [
    "Nuevos ingresos de iPhone 16 Pro",
    "Mejoramos cualquier presupuesto",
    "Envío en 24-48hs a todo el país",
  ];

  const defaultStoreFeatures = [
    { title: "Garantía", description: "Todos nuestros productos incluyen garantía" },
    { title: "Envío Rápido", description: "Entregas en 24-48hs" },
    { title: "Atención Personal", description: "Te ayudamos a elegir el mejor equipo" },
    { title: "Precio Justo", description: "Los mejores precios del mercado" },
  ];

  let config;
  try {
    config = await prisma.siteConfig.findUnique({
      where: { id: "default" },
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
    config = null;
  }

  if (!config) {
    return {
      bannerMessages: defaultBannerMessages,
      bannerEnabled: false,
      heroTitle: "",
      heroSubtitle: "",
      heroDescription: "",
      heroImage: "",
      heroCtaPrimary: "",
      heroCtaSecondary: "",
      heroImages: "[]",
      featuredTitle: "",
      featuredSubtitle: "",
      testimonialsTitle: "",
      testimonialsSubtitle: "",
      testimonialsRatingText: "",
      testimonialsInstagramCta: "",
      testimonialsInstagramUrl: "",
      storeName: "",
      storeWhatsapp: "",
      storeAddress: "",
      storeNeighborhood: "",
      storeCity: "",
      storePhone: "",
      storeSchedule: "",
      storeInstagram: "",
      storeEmail: "",
      storeFeatures: defaultStoreFeatures,
      storeFinancingTitle: "Servicio Técnico",
      storeFinancingSubtitle: "Contamos con servicio técnico especializado para iPhone",
      paymentMethods: "[]",
      ctaTitle: "",
      ctaSubtitle: "",
      ctaDescription: "",
      ctaButtonText: "",
      ctaBadge1: "",
      ctaBadge2: "",
      ctaBadge3: "",
      seoTitle: "",
      seoDescription: "",
      footerBrand: "",
      footerText: "",
    };
  }

  const defaultConfig = {
    bannerMessages: defaultBannerMessages,
    bannerEnabled: false,
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroImage: "",
    heroCtaPrimary: "",
    heroCtaSecondary: "",
    heroImages: "[]",
    featuredTitle: "",
    featuredSubtitle: "",
    testimonialsTitle: "",
    testimonialsSubtitle: "",
    testimonialsRatingText: "",
    testimonialsInstagramCta: "",
    testimonialsInstagramUrl: "",
    storeName: "",
    storeWhatsapp: "",
    storeAddress: "",
    storeNeighborhood: "",
    storeCity: "",
    storePhone: "",
    storeSchedule: "",
    storeInstagram: "",
    storeEmail: "",
    storeFeatures: "[]",
    storeFinancingTitle: "Servicio Técnico",
    storeFinancingSubtitle: "Contamos con servicio técnico especializado para iPhone",
    paymentMethods: "[]",
    ctaTitle: "",
    ctaSubtitle: "",
    ctaDescription: "",
    ctaButtonText: "",
    ctaBadge1: "",
    ctaBadge2: "",
    ctaBadge3: "",
    seoTitle: "",
    seoDescription: "",
    footerBrand: "",
    footerText: "",
  };

  return Object.fromEntries(
    Object.keys(defaultConfig).map((key) => {
      const value = config[key as keyof typeof config];
      if (key === "bannerMessages" || key === "storeFeatures") {
        if (typeof value === "string" && value) {
          try {
            return [key, JSON.parse(value)];
          } catch {
            return [key, key === "bannerMessages" ? defaultBannerMessages : defaultStoreFeatures];
          }
        }
        return [key, key === "bannerMessages" ? defaultBannerMessages : defaultStoreFeatures];
      }
      if (key === "heroImages" || key === "paymentMethods") {
        return [key, typeof value === "string" ? value : "[]"];
      }
      return [key, value ?? defaultConfig[key as keyof typeof defaultConfig]];
    })
  ) as typeof defaultConfig;
}

export async function updateSiteConfig(data: SiteConfigInput) {
  try {
    const validated = siteConfigSchema.parse(data);

    const payload = {
      ...validated,
      bannerMessages: validated.bannerMessages
        ? JSON.stringify(validated.bannerMessages)
        : undefined,
      storeFeatures: validated.storeFeatures
        ? JSON.stringify(validated.storeFeatures)
        : undefined,
      paymentMethods: validated.paymentMethods || "[]",
    };

    await prisma.siteConfig.upsert({
      where: { id: "default" },
      update: payload,
      create: {
        id: "default",
        ...payload,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/config");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error updating site config:", error);
    return { success: false, error: "Error al actualizar la configuración" };
  }
}
