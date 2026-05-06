/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR MARCA                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getBrandById, updateBrand, deleteBrand } from "@/server/actions/catalogo/brand";
import { EditarMarcaClient } from "./editar-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarMarcaPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const brand = await getBrandById(id);

  if (!brand) {
    redirect("/admin/catalogo/marcas");
  }

  return <EditarMarcaClient brand={brand} />;
}