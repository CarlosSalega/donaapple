import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { SiteConfigForm } from "@/features/landing/components/site-config-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";

export const metadata = { title: "Footer - Admin" };

export default async function FooterPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Footer</h1>
        <p className="text-muted-foreground text-sm">
          Texto que aparece al final del sitio
        </p>
      </div>
      <Card className="max-w-5xl">
        <CardHeader>
          <CardTitle>Configuración del Footer</CardTitle>
          <CardDescription>Marca y texto del pie de página</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteConfigForm config={config} section="footer" />
        </CardContent>
      </Card>
    </div>
  );
}
