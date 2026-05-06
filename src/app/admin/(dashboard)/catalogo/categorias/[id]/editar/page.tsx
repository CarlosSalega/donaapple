/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR CATEGORÍA                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getCategoryById } from "@/server/actions/catalogo/category";
import { getBrands } from "@/server/actions/catalogo/brand";
import { EditarCategoriaClient } from "./editar-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [category, brands] = await Promise.all([
    getCategoryById(id),
    getBrands(),
  ]);

  if (!category) {
    redirect("/admin/catalogo/categorias");
  }

  return <EditarCategoriaClient category={category} brands={brands} />;
}