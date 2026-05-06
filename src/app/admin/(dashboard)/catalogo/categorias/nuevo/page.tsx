/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVA CATEGORÍA                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getBrands } from "@/server/actions/catalogo/brand";
import { NuevaCategoriaClient } from "./nuevo-client";

export default async function NuevaCategoriaPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const brands = await getBrands();

  return <NuevaCategoriaClient brands={brands} />;
}