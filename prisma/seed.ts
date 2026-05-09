/**
 * ╔══════════════════════════════════════════════════════════════════════════════════════╗
 * ║                              DONAAPPLE SEED                                   ║
 * ║                    Datos de ejemplo para el catálogo                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════════════╝
 *
 * Usage:
 *   pnpm prisma db seed
 */

import { prisma } from "@/shared/lib/prisma";
import { Condition, Currency } from "@prisma/client";
import bcrypt from "bcryptjs";

import { BRANDS } from "./data/brands";
import { CATEGORIES } from "./data/categories";
import { MODELS } from "./data/models";
import { VARIANTS } from "./data/variants";
import { PRODUCTS } from "./data/products";
import { TESTIMONIALS } from "./data/testimonials";
import { SITE_CONFIG } from "./content/site-config";

import { generateProductSlug } from "@/shared/lib/slug";

async function main() {
  console.log("🌱 Starting seed...\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                USUARIO ADMIN                                 ║
  // ══════════════════════════════════════════════════════════════════════════════════════
  console.log("👤 Creating admin user...");

  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@donaapple.com" },
    update: {},
    create: {
      email: "admin@donaapple.com",
      password: passwordHash,
      name: "Donaapple Admin",
      role: "ADMIN",
    },
  });

  console.log("   ✓ Admin: admin@donaapple.com / admin123\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                  MARCAS                                      ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("🏷️ Creating brands...");

  const brandIds: Record<string, string> = {};

  for (const brand of BRANDS) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { name: brand.name, slug: brand.slug },
    });
    brandIds[brand.slug] = created.id;
  }

  console.log(`   ✓ ${BRANDS.length} brands created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                CATEGORÍAS                                   ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📂 Creating categories...");

  const categoryIds: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        brandId: brandIds[cat.brandSlug],
      },
    });
    categoryIds[cat.slug] = created.id;
  }

  console.log(`   ✓ ${CATEGORIES.length} categories created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                 MODELOS                                    ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📱 Creating models...");

  const modelIds: Record<string, string> = {};

  for (const model of MODELS) {
    const created = await prisma.model.upsert({
      where: { slug: model.slug },
      update: {},
      create: {
        name: model.name,
        slug: model.slug,
        categoryId: categoryIds[model.categorySlug],
        brandId: brandIds[model.brandSlug],
      },
    });
    modelIds[model.slug] = created.id;
  }

  console.log(`   ✓ ${MODELS.length} models created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                VARIANTES                                    ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("💾 Creating variants...");

  const variantIds: Record<string, string> = {};

  for (const variant of VARIANTS) {
    const created = await prisma.variant.upsert({
      where: { name: variant },
      update: {},
      create: { name: variant },
    });
    variantIds[variant] = created.id;
  }

  console.log(`   ✓ ${VARIANTS.length} variants created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                PRODUCTOS                                   ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📦 Creating products...");

  for (const p of PRODUCTS) {
    const variantId = variantIds[p.variantName];
    const modelId = modelIds[p.modelSlug];

    if (!variantId || !modelId) {
      console.log(`   ⚠️ Skipping ${p.title || p.modelSlug} - missing variant or model`);
      continue;
    }

    const modelInfo = MODELS.find((m) => m.slug === p.modelSlug);
    // Model name sin "iPhone" - solo "14 Pro" porque category ya es "iPhone"
    const modelNameClean = modelInfo?.name.replace(/^iPhone\s+/i, "").trim() || p.modelSlug;

    // Generar título automáticamente: Apple iPhone 14 Pro 256GB
    const brandName = "Apple";
    const categoryName = "iPhone";
    const variantDisplay = p.variantName;

    let productTitle = `${brandName} ${categoryName} ${modelNameClean} ${variantDisplay}`;
    if (p.color) {
      productTitle += ` ${p.color}`;
    }

    // Agregar info de batería en la descripción para usados
    let productDescription = p.description;

    const slug = generateProductSlug({
      brand: brandName.toLowerCase(),
      category: categoryName.toLowerCase(),
      modelName: modelNameClean,
      variantName: p.variantName,
      color: p.color,
      withSuffix: true, // Siempre agregar nanoId para URLs únicas
    });

    const condition = p.condition === "NEW" ? Condition.NEW : Condition.USED;

    // Extraer batería de la descripción si dice "Batería XX%"
    let battery: number | null = null;
    if (p.condition === "USED" && p.description) {
      const batteryMatch = p.description.match(/Batería\s*(\d+)%?/i);
      if (batteryMatch) {
        battery = parseInt(batteryMatch[1], 10);
      }
    }

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        title: productTitle,
        slug,
        description: productDescription,
        price: p.price,
        currency: Currency.USD,
        condition,
        isFeatured: p.isFeatured || false,
        color: p.color || null,
        modelId,
        variantIds: JSON.stringify([variantId]),
        stock: 1,
        battery,
      },
    });

    // Crear imagen placeholder
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product) {
      await prisma.image.upsert({
        where: { id: `${product.id}-primary` },
        update: {},
        create: {
          id: `${product.id}-primary`,
          url: "/images/placeholder.webp",
          publicId: "placeholder",
          alt: p.title,
          isPrimary: true,
          productId: product.id,
        },
      });
    }
  }

  console.log(`   ✓ ${PRODUCTS.length} products created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                              SITE CONFIG                                     ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("⚙️ Creating site config...");

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      ...SITE_CONFIG,
    },
  });

  console.log("   ✓ Site config created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                               TESTIMONIOS                                   ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("💬 Creating testimonials...");

  for (let i = 0; i < TESTIMONIALS.length; i++) {
    const t = TESTIMONIALS[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i + 1}` },
      update: {},
      create: {
        id: `testimonial-${i + 1}`,
        name: t.name,
        avatar: t.avatar,
        rating: t.rating,
        text: t.text,
        product: t.product || null,
        date: t.date || null,
        order: i,
        isActive: true,
      },
    });
  }

  console.log(`   ✓ ${TESTIMONIALS.length} testimonials created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                RESUMEN                                       ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("=".repeat(50));
  console.log("✅ SEED COMPLETADO");
  console.log("=".repeat(50));
  console.log("\n📋 Acceso:");
  console.log("   admin@donaapple.com / admin123");
  console.log("\n📊 Resume:");
  console.log(`   - ${BRANDS.length} brands`);
  console.log(`   - ${CATEGORIES.length} categories`);
  console.log(`   - ${MODELS.length} models`);
  console.log(`   - ${VARIANTS.length} variants`);
  console.log(`   - ${PRODUCTS.length} products`);
  console.log(`   - ${TESTIMONIALS.length} testimonials`);
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("\n❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
