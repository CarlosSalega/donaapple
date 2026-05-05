/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     ADMIN - GESTIÓN DE TESTIMONIOS                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/features/auth/lib/session";
import { getTestimonials } from "@/server/actions/testimonials/testimonials";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default async function TestimoniosPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const testimonials = await getTestimonials(true);

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonios</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná los testimonios que aparecen en la landing
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Testimonio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Testimonios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-mono text-sm">
                    {testimonial.order}
                  </TableCell>
                  <TableCell className="font-medium">{testimonial.name}</TableCell>
                  <TableCell>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {testimonial.product || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < testimonial.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                      {testimonial.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/testimonios/${testimonial.id}/editar`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {testimonial.isActive ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {testimonials.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>No hay testimonios todavía</p>
              <Button asChild className="mt-4">
                <Link href="/admin/testimonios/nuevo">Crear el primer testimonio</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}