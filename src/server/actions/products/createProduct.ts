"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateProductSlug } from "@/shared/lib/slug";

/**
 * Schema para crear producto.
 * AHORA: modelId directo, variantId opcional.
 */
const productSchema = z.object({
  modelId: z.string().min(1, "El modelo es requerido"),
  variantId: z.string().optional(),

  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  price: z.number().optional(),
  currency: z.enum(["ARS", "USD"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),

  color: z.string().optional(),
  stock: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "Al menos una imagen es requerida"),
  isFeatured: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof productSchema>;

export async function createProduct(data: CreateProductInput) {
  try {
    const validated = productSchema.parse(data);

    // Obtener modelo con relaciones (brand, category)
    const model = await prisma.model.findUnique({
      where: { id: validated.modelId },
      include: {
        category: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!model) {
      return { success: false, error: "Modelo no encontrado" };
    }

    // Obtener variant (si aplica) - es global
    let variantName: string | undefined;
    if (validated.variantId) {
      const variant = await prisma.variant.findUnique({
        where: { id: validated.variantId },
      });
      variantName = variant?.name;
    }

    const color = validated.color || undefined;

    // Generar slug semántico
    let slug = generateProductSlug({
      brand: model.category.brand.slug,
      category: model.category.slug,
      modelName: model.name,
      variantName,
      color,
    });

    // Verificar colisión y usar sufijo si es necesario
    const existing = await prisma.product.findUnique({
      where: { slug },
    });

    if (existing) {
      slug = generateProductSlug({
        brand: model.category.brand.slug,
        category: model.category.slug,
        modelName: model.name,
        variantName,
        color,
        withSuffix: true,
      });
    }

    const product = await prisma.product.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        price: validated.price ?? 0,
        currency: validated.currency,
        condition: validated.condition,
        isFeatured: validated.isFeatured ?? false,
        color: validated.color || null,
        stock: validated.stock ?? null,
        modelId: validated.modelId,
        variantId: validated.variantId || null,
      },
    });

    for (const url of validated.images) {
      await prisma.image.create({
        data: {
          url,
          publicId: url.split("/").pop() || "image",
          alt: validated.title,
          isPrimary: validated.images.indexOf(url) === 0,
          productId: product.id,
        },
      });
    }

    revalidatePath("/admin/productos");
    revalidatePath("/catalogo");
    revalidatePath("/");

    return { success: true, productId: product.id, slug: product.slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating product:", error);
    return { success: false, error: "Error al crear el producto" };
  }
}