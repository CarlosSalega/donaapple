import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { SiteConfigForm } from "@/features/landing/components/site-config-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

export const metadata = { title: "Información del Negocio - Admin" };

export default async function NegocioPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Información del Negocio</h1>
        <p className="text-muted-foreground text-sm">
          Datos de contacto, ubicación y financiación que se muestran en el sitio
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Negocio</CardTitle>
          <CardDescription>
            Datos de contacto, redes sociales y opciones de financiación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SiteConfigForm config={config} section="store" />
        </CardContent>
      </Card>
    </div>
  );
}