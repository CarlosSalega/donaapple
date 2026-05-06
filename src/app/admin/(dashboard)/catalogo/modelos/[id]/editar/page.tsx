/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR MODELO                             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getModelById } from "@/server/actions/catalogo/model";
import { getBrands } from "@/server/actions/catalogo/brand";
import { getCategories } from "@/server/actions/catalogo/category";
import { EditarModeloClient } from "./editar-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarModeloPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [model, brands, categories] = await Promise.all([
    getModelById(id),
    getBrands(),
    getCategories(),
  ]);

  if (!model) {
    redirect("/admin/catalogo/modelos");
  }

  return <EditarModeloClient model={model} brands={brands} categories={categories} />;
}