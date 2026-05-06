/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - EDITAR VARIANTE                          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getVariantById } from "@/server/actions/catalogo/variant";
import { getModels } from "@/server/actions/catalogo/model";
import { EditarVarianteClient } from "./editar-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarVariantePage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [variant, models] = await Promise.all([
    getVariantById(id),
    getModels(),
  ]);

  if (!variant) {
    redirect("/admin/catalogo/variantes");
  }

  return <EditarVarianteClient variant={variant} models={models} />;
}