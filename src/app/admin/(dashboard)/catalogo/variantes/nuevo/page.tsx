/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                    ADMIN - NUEVA VARIANTE                          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getModels } from "@/server/actions/catalogo/model";
import { NuevaVarianteClient } from "./nuevo-client";

export default async function NuevaVariantePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const models = await getModels();

  return <NuevaVarianteClient models={models} />;
}