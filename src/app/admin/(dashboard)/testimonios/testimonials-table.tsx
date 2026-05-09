"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
import {
  toggleTestimonialActive,
  hardDeleteTestimonial,
  type TestimonialInput,
} from "@/server/actions/testimonials/testimonials";
import { Plus, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Testimonial = TestimonialInput & { id: string; createdAt: Date };

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
}

export function TestimonialsTable({ testimonials, onEdit }: TestimonialsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string) => {
    startTransition(async () => {
      const result = await toggleTestimonialActive(id);
      if (result.success) {
        toast.success("Estado actualizado");
        router.refresh();
      } else {
        toast.error(result.error ?? "Error al actualizar");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await hardDeleteTestimonial(id);
      if (result.success) {
        toast.success("Testimonio eliminado");
        router.refresh();
      } else {
        toast.error(result.error ?? "Error al eliminar");
      }
    });
  };

  if (testimonials.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>No hay testimonios todavía</p>
          <Button
            onClick={() => onEdit({ id: "", name: "", avatar: "", rating: 5, text: "", order: 0, isActive: true, createdAt: new Date() })}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear el primer testimonio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
              <TableRow key={testimonial.id} className={isPending ? "opacity-50" : ""}>
                <TableCell className="font-mono text-sm">
                  {testimonial.order ?? 0}
                </TableCell>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell>
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {testimonial.product || "—"}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        disabled={isPending}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(testimonial)}>
                        <Pencil className="mr-2 size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggle(testimonial.id)}
                        disabled={isPending}
                      >
                        {testimonial.isActive ? (
                          <>
                            <EyeOff className="mr-2 size-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 size-4" />
                            Activar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}