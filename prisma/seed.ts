/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                              DONAAPPLE SEED                                   ║
 * ║                    Datos de ejemplo para el catálogo                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Usage:
 *   pnpm prisma db seed
 * 
 * Prerequisites:
 *   - npm install -D tsx
 *   - Add "prisma": { "seed": "tsx prisma/seed.ts" } to package.json
 */

import { PrismaClient, Condition, Currency } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { ALL_MODELS, VARIANTS_BY_MODEL, generateProductsData } from "./seed-data";
import { LANDING_CONTENT, DEFAULT_TESTIMONIALS } from "./landing-content";

const prisma = new PrismaClient();

function generateProductSlug(modelName: string, variantName: string, color?: string): string {
  const baseSlug = slugify(modelName, { lower: true });
  const variantSlug = slugify(variantName, { lower: true });
  
  const colorSlug = color ? slugify(color, { lower: true }) : null;
  
  const parts = [baseSlug, variantSlug];
  if (colorSlug) parts.push(colorSlug);
  
  const suffix = nanoid(6);
  
  return `${parts.join("-")}-${suffix}`;
}

async function main() {
  console.log("🌱 Starting seed...\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                USUARIO ADMIN                                 ║
  // ══════════════════════════════════════════════════════════════════════════════
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

  console.log("   ✓ Admin created: admin@donaapple.com / admin123\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                  MARCAS                                      ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("🏷️ Creating brands...");

  const apple = await prisma.brand.upsert({
    where: { slug: "apple" },
    update: {},
    create: { name: "Apple", slug: "apple" },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: "samsung" },
    update: {},
    create: { name: "Samsung", slug: "samsung" },
  });

  console.log("   ✓ Apple, Samsung created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                CATEGORÍAS                                   ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📂 Creating categories...");

  const categories = {
    iphone: await prisma.category.upsert({
      where: { slug: "iphone" },
      update: {},
      create: { name: "iPhone", slug: "iphone", brandId: apple.id },
    }),
    mac: await prisma.category.upsert({
      where: { slug: "mac" },
      update: {},
      create: { name: "Mac", slug: "mac", brandId: apple.id },
    }),
    ipad: await prisma.category.upsert({
      where: { slug: "ipad" },
      update: {},
      create: { name: "iPad", slug: "ipad", brandId: apple.id },
    }),
    "apple-watch": await prisma.category.upsert({
      where: { slug: "apple-watch" },
      update: {},
      create: { name: "Apple Watch", slug: "apple-watch", brandId: apple.id },
    }),
    samsung: await prisma.category.upsert({
      where: { slug: "samsung-smartphones" },
      update: {},
      create: { name: "Smartphones", slug: "samsung-smartphones", brandId: samsung.id },
    }),
  };

  console.log("   ✓ Categories created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                 MODELOS (desde seed-data.ts)                ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📱 Creating models...");

  const createdModels: Record<string, { id: string; name: string; slug: string }> = {};

  for (const model of ALL_MODELS) {
    const categorySlug = model.categorySlug as keyof typeof categories;
    const categoryId = categories[categorySlug]?.id;
    
    if (!categoryId) {
      console.log(`   ⚠️ Skipping ${model.name} - categoría no encontrada: ${categorySlug}`);
      continue;
    }

    const created = await prisma.model.upsert({
      where: { slug: model.slug },
      update: {},
      create: {
        name: model.name,
        slug: model.slug,
        categoryId,
        brandId: apple.id,
      },
    });
    createdModels[model.slug] = created;
  }

  console.log(`   ✓ ${Object.keys(createdModels).length} Models created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                VARIANTES (desde seed-data.ts)               ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("🔧 Creating variants...");

  const createdVariants: Record<string, string> = {};

  for (const [modelSlug, variants] of Object.entries(VARIANTS_BY_MODEL)) {
    const modelId = createdModels[modelSlug]?.id;
    if (!modelId) continue;

    for (const variantName of variants) {
      const variant = await prisma.variant.create({
        data: {
          name: variantName,
          modelId,
        },
      });
      createdVariants[`${modelSlug}-${variantName}`] = variant.id;
    }
  }

  console.log(`   ✓ ${Object.keys(createdVariants).length} Variants created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                               PRODUCTOS (desde seed-data.ts)                ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📦 Creating products...");

  const productsData = generateProductsData();

  for (const p of productsData) {
    const variantId = createdVariants[`${p.modelSlug}-${p.variantName}`];
    if (!variantId) {
      console.log(`   ⚠️ Variant not found: ${p.modelSlug}-${p.variantName}`);
      continue;
    }

    const modelName = createdModels[p.modelSlug]?.name || p.modelSlug;
    const slug = generateProductSlug(modelName, p.variantName);
    
    const productCondition = p.condition === "NEW" ? Condition.NEW : Condition.USED;

    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug,
        description: p.description,
        price: p.price,
        currency: Currency.USD,
        condition: productCondition,
        isFeatured: p.isFeatured || false,
        variantId,
      },
    });

    await prisma.image.create({
      data: {
        url: `/images/placeholder.webp`,
        publicId: "placeholder",
        alt: p.title,
        isPrimary: true,
        productId: product.id,
      },
    });
  }

  console.log(`   ✓ ${productsData.length} Products created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                              SITE CONFIG                                     ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("⚙️ Creating site config...");

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      
      // Hero
      heroTitle: "iPhones y Productos Apple con Garantía",
      heroSubtitle: "Encontrá el iPhone perfecto para vos. Nuevos y usados, todos con garantía real.",
      
      // Banner
      bannerText: "🔥 Nuevos ingresos de iPhone 16 Pro - Stock limitado",
      bannerEnabled: true,
      
      // Store info
      storeName: "Donaapple",
      storeWhatsapp: "+54 9 2324 687617",
      storeAddress: "Calle 25 N° 465, Mercedes, Buenos Aires",
      storeSchedule: "Lunes a viernes: 09:00 - 20:30\nSábado: 09:00 - 13:00",
      storeInstagram: "donaapple",
      storeEmail: "donaapplemercedes@gmail.com",
      
      // Payment
      paymentMethods: JSON.stringify(["Efectivo", "Transferencia", "MercadoPago", "Tarjetas de crédito"]),
      
      // CTA
      ctaTitle: "¿No encontrás lo que buscas?",
      ctaButtonText: "Escribinos por WhatsApp",
      
      // SEO
      seoTitle: "Donaapple | iPhones y Productos Apple en Mercedes, Buenos Aires",
      seoDescription: "iPhones, iPads, Macs y accesorios Apple nuevos y usados con garantía. Reparaciones profesionales y plan canje.",
      
      // Footer
      footerText: "© 2024 Donaapple. Todos los derechos reservados.",
    },
  });

  console.log("   ✓ Site config created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                          LANDING CONTENT                                      ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("⚙️ Creating landing content...");

  await prisma.siteConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      // Banner
      bannerEnabled: LANDING_CONTENT.banner.enabled,
      bannerEmoji: LANDING_CONTENT.banner.emoji,
      bannerText: LANDING_CONTENT.banner.message,
      // Hero
      heroTitle: LANDING_CONTENT.hero.title,
      heroSubtitle: LANDING_CONTENT.hero.subtitle,
      heroDescription: LANDING_CONTENT.hero.description,
      heroCtaPrimary: LANDING_CONTENT.hero.ctaPrimary,
      heroCtaSecondary: LANDING_CONTENT.hero.ctaSecondary,
      heroImages: JSON.stringify(LANDING_CONTENT.hero.images),
      // Featured
      featuredTitle: LANDING_CONTENT.featured.title,
      featuredSubtitle: LANDING_CONTENT.featured.subtitle,
      // Testimonials
      testimonialsTitle: LANDING_CONTENT.testimonials.sectionTitle,
      testimonialsSubtitle: LANDING_CONTENT.testimonials.sectionSubtitle,
      testimonialsRatingText: LANDING_CONTENT.testimonials.ratingText,
      testimonialsInstagramCta: LANDING_CONTENT.testimonials.instagramCta,
      testimonialsInstagramUrl: LANDING_CONTENT.testimonials.instagramUrl,
      // Store
      storeName: LANDING_CONTENT.store.name,
      storeAddress: LANDING_CONTENT.store.address,
      storeNeighborhood: LANDING_CONTENT.store.neighborhood,
      storeCity: LANDING_CONTENT.store.city,
      storePhone: LANDING_CONTENT.store.phone,
      storeWhatsapp: LANDING_CONTENT.store.whatsapp,
      storeEmail: LANDING_CONTENT.store.email,
      storeInstagram: LANDING_CONTENT.store.instagram,
      storeSchedule: `${LANDING_CONTENT.store.schedule.weekdays}\nSábados: ${LANDING_CONTENT.store.schedule.saturday}\nDomingos: ${LANDING_CONTENT.store.schedule.sunday}`,
      storeFeatures: JSON.stringify(LANDING_CONTENT.store.features),
      storeFinancingTitle: LANDING_CONTENT.store.financing.title,
      storeFinancingSubtitle: LANDING_CONTENT.store.financing.subtitle,
      // CTA Final
      ctaTitle: LANDING_CONTENT.finalCta.title,
      ctaDescription: LANDING_CONTENT.finalCta.description,
      ctaButtonText: LANDING_CONTENT.finalCta.buttonSecondary,
      ctaBadge1: LANDING_CONTENT.finalCta.badges[0],
      ctaBadge2: LANDING_CONTENT.finalCta.badges[1],
      ctaBadge3: LANDING_CONTENT.finalCta.badges[2],
      // Footer
      footerBrand: LANDING_CONTENT.footer.brand,
      footerText: LANDING_CONTENT.footer.description,
      // SEO
      seoTitle: LANDING_CONTENT.seo.title,
      seoDescription: LANDING_CONTENT.seo.description,
    },
  });

  console.log("   ✓ Landing content created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                               TESTIMONIOS                                     ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("💬 Creating testimonials...");

  for (let i = 0; i < DEFAULT_TESTIMONIALS.length; i++) {
    const t = DEFAULT_TESTIMONIALS[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i + 1}` },
      update: {},
      create: {
        id: `testimonial-${i + 1}`,
        name: t.name,
        avatar: t.avatar,
        rating: t.rating,
        text: t.text,
        product: t.product,
        date: t.date,
        order: i,
        isActive: true,
      },
    });
  }

  console.log(`   ✓ ${DEFAULT_TESTIMONIALS.length} Testimonials created\n`);

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                RESUMEN                                       ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("=".repeat(60));
  console.log("✅ SEED COMPLETADO EXITOSAMENTE");
  console.log("=".repeat(60));
  console.log("\n📋 Credenciales de acceso:");
  console.log("   Email: admin@donaapple.com");
  console.log("   Password: admin123");
  console.log("\n🔗 Rutas:");
  console.log("   Frontend: http://localhost:3000");
  console.log("   Admin: http://localhost:3000/admin");
  console.log("   Login: http://localhost:3000/admin/login");
  console.log("\n📊 Resumen:");
  console.log(`   - 2 Marcas (Apple, Samsung)`);
  console.log(`   - 5 Categorías`);
  console.log(`   - ${Object.keys(createdModels).length} Modelos`);
  console.log(`   - ${productsData.length} Productos`);
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("\n❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });