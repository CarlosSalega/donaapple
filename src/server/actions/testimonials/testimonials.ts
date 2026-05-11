"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  avatar: z.string().min(1, "Las iniciales son requeridas"),
  rating: z.number().min(1).max(5).default(5),
  text: z.string().min(10, "El texto debe tener al menos 10 caracteres"),
  product: z.string().optional(),
  date: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export async function getTestimonials(includeInactive = false) {
  try {
    const where = includeInactive ? {} : { isActive: true };
    
    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function getTestimonialById(id: string) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  return testimonial;
}

export async function createTestimonial(data: TestimonialInput) {
  try {
    const validated = testimonialSchema.parse(data);

    const count = await prisma.testimonial.count();
    
    const testimonial = await prisma.testimonial.create({
      data: {
        ...validated,
        order: validated.order ?? count,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true, testimonial };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Error al crear el testimonio" };
  }
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true, testimonial };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Error al actualizar el testimonio" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Error al eliminar el testimonio" };
  }
}

export async function hardDeleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true };
  } catch (error) {
    console.error("Error hard deleting testimonial:", error);
    return { success: false, error: "Error al eliminar el testimonio" };
  }
}

export async function toggleTestimonialActive(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return { success: false, error: "Testimonio no encontrado" };
    }

    await prisma.testimonial.update({
      where: { id },
      data: { isActive: !testimonial.isActive },
    });

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true };
  } catch (error) {
    console.error("Error toggling testimonial:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }
}

export async function reorderTestimonials(orderedIds: string[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.testimonial.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/admin/testimonios");

    return { success: true };
  } catch (error) {
    console.error("Error reordering testimonials:", error);
    return { success: false, error: "Error al reordenar los testimonios" };
  }
}