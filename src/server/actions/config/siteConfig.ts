"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const siteConfigSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  bannerText: z.string().optional(),
  bannerEnabled: z.boolean().optional(),
  storeName: z.string().optional(),
  storeWhatsapp: z.string().optional(),
  storeAddress: z.string().optional(),
  storeSchedule: z.string().optional(),
  storeInstagram: z.string().optional(),
  storeEmail: z.string().optional(),
  paymentMethods: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaButtonText: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  footerText: z.string().optional(),
});

export type SiteConfigInput = z.infer<typeof siteConfigSchema>;

export async function getSiteConfig() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "default" },
  });

  if (!config) {
    return {
      heroTitle: "",
      heroSubtitle: "",
      heroImage: "",
      bannerText: "",
      bannerEnabled: false,
      storeName: "",
      storeWhatsapp: "",
      storeAddress: "",
      storeSchedule: "",
      storeInstagram: "",
      storeEmail: "",
      paymentMethods: "[]",
      ctaTitle: "",
      ctaButtonText: "",
      seoTitle: "",
      seoDescription: "",
      footerText: "",
    };
  }

  return {
    ...config,
    paymentMethods:
      typeof config.paymentMethods === "string"
        ? config.paymentMethods
        : JSON.stringify(config.paymentMethods || []),
  };
}

export async function updateSiteConfig(data: SiteConfigInput) {
  try {
    const validated = siteConfigSchema.parse(data);

    await prisma.siteConfig.upsert({
      where: { id: "default" },
      update: validated,
      create: {
        id: "default",
        ...validated,
        paymentMethods: validated.paymentMethods || "[]",
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
