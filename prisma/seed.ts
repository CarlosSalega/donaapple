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

const prisma = new PrismaClient();

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
    applewatch: await prisma.category.upsert({
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
  // ║                                 MODELOS                                     ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📱 Creating models...");

  // iPhone models (Apple)
  const iphoneModels = [
    { name: "iPhone 11", slug: "iphone-11", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 12", slug: "iphone-12", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 13", slug: "iphone-13", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 13 Pro", slug: "iphone-13-pro", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 14", slug: "iphone-14", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 14 Pro", slug: "iphone-14-pro", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 15", slug: "iphone-15", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 15 Pro", slug: "iphone-15-pro", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 16", slug: "iphone-16", categoryId: categories.iphone.id, brandId: apple.id },
    { name: "iPhone 16 Pro", slug: "iphone-16-pro", categoryId: categories.iphone.id, brandId: apple.id },
  ];

  // Mac models (Apple)
  const macModels = [
    { name: "MacBook Air M2", slug: "macbook-air-m2", categoryId: categories.mac.id, brandId: apple.id },
    { name: "MacBook Air M3", slug: "macbook-air-m3", categoryId: categories.mac.id, brandId: apple.id },
    { name: "MacBook Pro 14", slug: "macbook-pro-14", categoryId: categories.mac.id, brandId: apple.id },
    { name: "MacBook Pro 16", slug: "macbook-pro-16", categoryId: categories.mac.id, brandId: apple.id },
    { name: "iMac 24", slug: "imac-24", categoryId: categories.mac.id, brandId: apple.id },
  ];

  // iPad models (Apple)
  const ipadModels = [
    { name: "iPad 10", slug: "ipad-10", categoryId: categories.ipad.id, brandId: apple.id },
    { name: "iPad Air", slug: "ipad-air", categoryId: categories.ipad.id, brandId: apple.id },
    { name: "iPad Pro 11", slug: "ipad-pro-11", categoryId: categories.ipad.id, brandId: apple.id },
    { name: "iPad Pro 13", slug: "ipad-pro-13", categoryId: categories.ipad.id, brandId: apple.id },
    { name: "iPad mini", slug: "ipad-mini", categoryId: categories.ipad.id, brandId: apple.id },
  ];

  // Apple Watch models (Apple)
  const watchModels = [
    { name: "Watch Series 8", slug: "watch-series-8", categoryId: categories.applewatch.id, brandId: apple.id },
    { name: "Watch Series 9", slug: "watch-series-9", categoryId: categories.applewatch.id, brandId: apple.id },
    { name: "Watch Ultra 2", slug: "watch-ultra-2", categoryId: categories.applewatch.id, brandId: apple.id },
  ];

  const createdModels: Record<string, { id: string; name: string; slug: string }> = {};

  for (const model of [...iphoneModels, ...macModels, ...ipadModels, ...watchModels]) {
    const created = await prisma.model.upsert({
      where: { slug: model.slug },
      update: {},
      create: model,
    });
    createdModels[model.slug] = created;
  }

  console.log("   ✓ Models created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                                VARIANTES                                     ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("🔧 Creating variants...");

  const storageVariants = [
    { name: "64GB" },
    { name: "128GB" },
    { name: "256GB" },
    { name: "512GB" },
    { name: "1TB" },
  ];

  const macVariants = [
    { name: "8GB RAM" },
    { name: "16GB RAM" },
    { name: "24GB RAM" },
  ];

  const watchVariants = [
    { name: "40mm" },
    { name: "41mm" },
    { name: "44mm" },
    { name: "45mm" },
  ];

  // Create variants for key models
  const variantMap: Record<string, string[]> = {
    "iphone-11": ["64GB", "128GB"],
    "iphone-12": ["64GB", "128GB", "256GB"],
    "iphone-13": ["128GB", "256GB", "512GB"],
    "iphone-13-pro": ["128GB", "256GB", "512GB", "1TB"],
    "iphone-14": ["128GB", "256GB", "512GB"],
    "iphone-14-pro": ["128GB", "256GB", "512GB", "1TB"],
    "iphone-15": ["128GB", "256GB", "512GB"],
    "iphone-15-pro": ["256GB", "512GB", "1TB"],
    "iphone-16": ["128GB", "256GB", "512GB"],
    "iphone-16-pro": ["256GB", "512GB", "1TB"],
  };

  const createdVariants: Record<string, string> = {};

  for (const [modelSlug, storages] of Object.entries(variantMap)) {
    const modelId = createdModels[modelSlug]?.id;
    if (!modelId) continue;

    for (const storage of storages) {
      const variant = await prisma.variant.create({
        data: {
          name: storage,
          modelId,
        },
      });
      createdVariants[`${modelSlug}-${storage}`] = variant.id;
    }
  }

  console.log("   ✓ Variants created\n");

  // ══════════════════════════════════════════════════════════════════════════════
  // ║                               PRODUCTOS                                       ║
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("📦 Creating products...");

  const productsData = [
    {
      modelSlug: "iphone-13",
      variantName: "128GB",
      title: "iPhone 13 128GB - Estado EXCELENTE",
      price: 650,
      currency: Currency.USD,
      condition: Condition.USED,
      description: "iPhone 13 128GB color Negro. Batería 89%. Libre de fábrica. Incluye caja y cable. Sin detalles.",
      isFeatured: true,
    },
    {
      modelSlug: "iphone-13-pro",
      variantName: "256GB",
      title: "iPhone 13 Pro 256GB - COMO NUEVO",
      price: 850,
      currency: Currency.USD,
      condition: Condition.USED,
      description: "iPhone 13 Pro 256GB color Sierra Blue. Batería 92%.Excelente estado, sin rayones. Incluye completo.",
      isFeatured: true,
    },
    {
      modelSlug: "iphone-14",
      variantName: "128GB",
      title: "iPhone 14 128GB - NUEVO SELLADO",
      price: 950,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "iPhone 14 128GB color Midnight. Nuevo sellado, garantía Apple hasta 2025. Libre de fábrica.",
      isFeatured: false,
    },
    {
      modelSlug: "iphone-14-pro",
      variantName: "256GB",
      title: "iPhone 14 Pro 256GB - USADO EXCELENTE",
      price: 1050,
      currency: Currency.USD,
      condition: Condition.USED,
      description: "iPhone 14 Pro 256GB color Space Black. Batería 88%.Excelente estado. Incluye cargador.",
      isFeatured: true,
    },
    {
      modelSlug: "iphone-15",
      variantName: "256GB",
      title: "iPhone 15 256GB - NUEVO SELLADO",
      price: 1150,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "iPhone 15 256GB color Blue. Nuevo sellado, garantía Apple. Libre de fábrica.",
      isFeatured: false,
    },
    {
      modelSlug: "iphone-15-pro",
      variantName: "256GB",
      title: "iPhone 15 Pro 256GB - TITANIUM",
      price: 1350,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "iPhone 15 Pro 256GB color Titanium. Nuevo sellado. Garantía Apple.",
      isFeatured: true,
    },
    {
      modelSlug: "iphone-16",
      variantName: "128GB",
      title: "iPhone 16 128GB - NEGRO",
      price: 1250,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "iPhone 16 128GB color Black. Nuevo sellado. Disponible ahora.",
      isFeatured: false,
    },
    {
      modelSlug: "iphone-16-pro",
      variantName: "256GB",
      title: "iPhone 16 Pro 256GB - NATURAL TITANIUM",
      price: 1550,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "iPhone 16 Pro 256GB color Natural Titanium. Nuevo sellado. El más nuevo!",
      isFeatured: true,
    },
    {
      modelSlug: "macbook-air-m3",
      variantName: "256GB",
      title: "MacBook Air M3 256GB - SPACE GRAY",
      price: 1450,
      currency: Currency.USD,
      condition: Condition.NEW,
      description: "MacBook Air M3 256GB/8GB RAM color Space Gray. Nuevo sellado. Modelo 2024.",
      isFeatured: false,
    },
  ];

  for (const p of productsData) {
    const variantId = createdVariants[`${p.modelSlug}-${p.variantName}`];
    if (!variantId) continue;

    const product = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        price: p.price,
        currency: p.currency,
        condition: p.condition,
        isFeatured: p.isFeatured,
        variantId,
      },
    });

    // Add placeholder image (in real app, would upload to Cloudinary)
    await prisma.image.create({
      data: {
        url: `/images/placeholder.webp`,
        publicId: "placeholder",
        alt: p.title,
        isPrimary: true,
        productId: product.id,
      },
    });

    console.log(`   ✓ ${p.title}`);
  }

  console.log("\n   ✓ Products created\n");

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