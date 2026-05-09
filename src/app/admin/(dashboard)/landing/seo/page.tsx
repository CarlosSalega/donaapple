import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { SiteConfigForm } from "@/features/landing/components/site-config-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";

export const metadata = { title: "SEO - Admin" };

export default async function SeoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">SEO</h1>
        <p className="text-muted-foreground text-sm">
          Configuración para motores de búsqueda
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuración de SEO</CardTitle>
          <CardDescription>
            Title y descripción que aparecen en resultados de búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SiteConfigForm config={config} section="seo" />
        </CardContent>
      </Card>
    </div>
  );
}