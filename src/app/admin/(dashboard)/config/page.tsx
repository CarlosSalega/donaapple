/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - CONFIGURACIÓN DEL SITIO                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getSiteConfig, SiteConfigInput } from "@/server/actions/config/siteConfig";

import { SiteConfigForm } from "./site-config-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ConfigPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración del Sitio</h1>
        <p className="text-sm text-muted-foreground">
          Personalizá el contenido de tu tienda pública
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Banner de Urgencia</CardTitle>
            <CardDescription>
              Un banner destacado que aparece en la parte superior del sitio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="banner" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero - Sección Principal</CardTitle>
            <CardDescription>
              El contenido principal que aparece en la parte superior de la landing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="hero" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Destacados</CardTitle>
            <CardDescription>
              Título y subtítulo de la sección de productos destacados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="featured" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testimonios</CardTitle>
            <CardDescription>
              Textos de la sección de testimonios (los testimonios mismos se gestionan desde la sección dedicada)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="testimonials" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
            <CardDescription>
              Datos de contacto, ubicación y financiación que se muestran en el sitio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="store" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>
              Opciones de pago disponibles en la tienda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="payment" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CTA Final</CardTitle>
            <CardDescription>
              Llamada a la acción que aparece antes del footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="cta" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer</CardTitle>
            <CardDescription>
              Texto que aparece al final del sitio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="footer" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>
              Configuración para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteConfigForm config={config} section="seo" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}