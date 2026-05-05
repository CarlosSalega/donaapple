/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - EDITAR TESTIMONIO                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getTestimonialById } from "@/server/actions/testimonials/testimonials";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestimonialForm } from "../../testimonial-form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const testimonial = await getTestimonialById(id);

  if (!testimonial) {
    redirect("/admin/testimonios");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Testimonio</h1>
        <p className="text-sm text-muted-foreground">
          Modificá los datos del testimonio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Testimonio</CardTitle>
          <CardDescription>
            Editá los datos del testimonio de {testimonial.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm
            initialData={{
              name: testimonial.name,
              avatar: testimonial.avatar,
              rating: testimonial.rating,
              text: testimonial.text,
              product: testimonial.product || undefined,
              date: testimonial.date || undefined,
              isActive: testimonial.isActive,
              order: testimonial.order,
            }}
            testimonialId={testimonial.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}