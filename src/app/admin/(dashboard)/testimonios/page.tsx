/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - TESTIMONIOS                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Página unificada con:
 * - Tab "Testimonios": tabla CRUD con acciones inline (editar, activar/desactivar, eliminar)
 * - Tab "Configuración": textos de la sección (título, subtítulo, Instagram CTA)
 * - Dialog modal para crear/editar testimonios
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getTestimonials } from "@/server/actions/testimonials/testimonials";
import { getSiteConfig } from "@/server/actions/config/siteConfig";

import { TestimoniosClient } from "./testimonios-client";

export default async function TestimoniosPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [testimonials, config] = await Promise.all([
    getTestimonials(true),
    getSiteConfig(),
  ]);

  const testimonialsWithDefaults = testimonials.map((t) => ({
    ...t,
    product: t.product ?? undefined,
    date: t.date ?? undefined,
    isActive: t.isActive ?? true,
    order: t.order ?? 0,
  }));

  return <TestimoniosClient testimonials={testimonialsWithDefaults} config={config} />;
}