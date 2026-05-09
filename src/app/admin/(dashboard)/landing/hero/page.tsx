import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { SiteConfigForm } from "@/features/landing/components/site-config-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

export const metadata = { title: "Hero - Admin" };

export default async function HeroPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Hero - Sección Principal</h1>
        <p className="text-muted-foreground text-sm">
          El contenido principal que aparece en la parte superior de la landing
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Hero</CardTitle>
          <CardDescription>
            Título, descripción, CTAs e imágenes del carrusel principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SiteConfigForm config={config} section="hero" />
        </CardContent>
      </Card>
    </div>
  );
}