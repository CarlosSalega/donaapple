/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - NUEVO TESTIMONIO                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/lib/session";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestimonialForm } from "../testimonial-form";

export default async function NewTestimonialPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold">Nuevo Testimonio</h1>
        <p className="text-sm text-muted-foreground">
          Agregá un nuevo testimonio de cliente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del Testimonio</CardTitle>
          <CardDescription>
            Completá los datos del nuevo testimonio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TestimonialForm />
        </CardContent>
      </Card>
    </div>
  );
}