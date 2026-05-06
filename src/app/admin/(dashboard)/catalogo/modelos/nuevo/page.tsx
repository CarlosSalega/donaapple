/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVO MODELO                             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getBrands } from "@/server/actions/catalogo/brand";
import { getCategories } from "@/server/actions/catalogo/category";
import { NuevoModeloClient } from "./nuevo-client";

export default async function NuevoModeloPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories(),
  ]);

  return <NuevoModeloClient brands={brands} categories={categories} />;
}