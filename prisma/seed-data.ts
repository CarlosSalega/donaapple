/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                              SEED DATA                                        ║
 * ║              Modelos, variantes y productos para el catálogo               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Este archivo contiene los datos puros para el seed.
 * Separá del seed.ts principal para mantenerlo limpio.
 */

export type SeedModel = {
  name: string;
  slug: string;
  categorySlug: string;
  brandSlug?: string;
};

export type SeedVariant = {
  modelSlug: string;
  variantName: string;
  price: number;
  condition: "NEW" | "USED" | "REFURBISHED";
  title: string;
  description?: string;
  isFeatured?: boolean;
  color?: string;
};

// ══════════════════════════════════════════════════════════════════════════════
// ║                            MODELOS DE IPHONE                                  ║
// ══════════════════════════════════════════════════════════════════════════════

export const IPHONE_MODELS: SeedModel[] = [
  { name: "iPhone 11", slug: "iphone-11", categorySlug: "iphone" },
  { name: "iPhone 11 Pro", slug: "iphone-11-pro", categorySlug: "iphone" },
  {
    name: "iPhone 11 Pro Max",
    slug: "iphone-11-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 12", slug: "iphone-12", categorySlug: "iphone" },
  { name: "iPhone 12 mini", slug: "iphone-12-mini", categorySlug: "iphone" },
  { name: "iPhone 12 Pro", slug: "iphone-12-pro", categorySlug: "iphone" },
  {
    name: "iPhone 12 Pro Max",
    slug: "iphone-12-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 13", slug: "iphone-13", categorySlug: "iphone" },
  { name: "iPhone 13 mini", slug: "iphone-13-mini", categorySlug: "iphone" },
  { name: "iPhone 13 Pro", slug: "iphone-13-pro", categorySlug: "iphone" },
  {
    name: "iPhone 13 Pro Max",
    slug: "iphone-13-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 14", slug: "iphone-14", categorySlug: "iphone" },
  { name: "iPhone 14 Plus", slug: "iphone-14-plus", categorySlug: "iphone" },
  { name: "iPhone 14 Pro", slug: "iphone-14-pro", categorySlug: "iphone" },
  {
    name: "iPhone 14 Pro Max",
    slug: "iphone-14-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 15", slug: "iphone-15", categorySlug: "iphone" },
  { name: "iPhone 15 Plus", slug: "iphone-15-plus", categorySlug: "iphone" },
  { name: "iPhone 15 Pro", slug: "iphone-15-pro", categorySlug: "iphone" },
  {
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 16", slug: "iphone-16", categorySlug: "iphone" },
  { name: "iPhone 16 Plus", slug: "iphone-16-plus", categorySlug: "iphone" },
  { name: "iPhone 16 Pro", slug: "iphone-16-pro", categorySlug: "iphone" },
  {
    name: "iPhone 16 Pro Max",
    slug: "iphone-16-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 17", slug: "iphone-17", categorySlug: "iphone" },
  { name: "iPhone 17 Plus", slug: "iphone-17-plus", categorySlug: "iphone" },
  { name: "iPhone 17 Pro", slug: "iphone-17-pro", categorySlug: "iphone" },
  {
    name: "iPhone 17 Pro Max",
    slug: "iphone-17-pro-max",
    categorySlug: "iphone",
  },
  { name: "iPhone 17 Air", slug: "iphone-17-air", categorySlug: "iphone" },
];

// ══════════════════════════════════════════════════════════════════════════════
// ║                            MODELOS DE MAC                                    ║
// ══════════════════════════════════════════════════════════════════════════════

export const MAC_MODELS: SeedModel[] = [
  // MacBook Air
  { name: "MacBook Air M1", slug: "macbook-air-m1", categorySlug: "mac" },
  { name: "MacBook Air M2", slug: "macbook-air-m2", categorySlug: "mac" },
  { name: "MacBook Air M3", slug: "macbook-air-m3", categorySlug: "mac" },
  { name: "MacBook Air M4", slug: "macbook-air-m4", categorySlug: "mac" },
  { name: "MacBook Air M5", slug: "macbook-air-m5", categorySlug: "mac" },
  // MacBook Pro
  { name: "MacBook Pro 13 M1", slug: "macbook-pro-13-m1", categorySlug: "mac" },
  { name: "MacBook Pro 13 M2", slug: "macbook-pro-13-m2", categorySlug: "mac" },
  { name: "MacBook Pro 14 M3", slug: "macbook-pro-14-m3", categorySlug: "mac" },
  { name: "MacBook Pro 14 M4", slug: "macbook-pro-14-m4", categorySlug: "mac" },
  { name: "MacBook Pro 14 M5", slug: "macbook-pro-14-m5", categorySlug: "mac" },
  { name: "MacBook Pro 16 M3", slug: "macbook-pro-16-m3", categorySlug: "mac" },
  { name: "MacBook Pro 16 M4", slug: "macbook-pro-16-m4", categorySlug: "mac" },
  { name: "MacBook Pro 16 M5", slug: "macbook-pro-16-m5", categorySlug: "mac" },
  // iMac
  { name: "iMac 24 M1", slug: "imac-24-m1", categorySlug: "mac" },
  { name: "iMac 24 M3", slug: "imac-24-m3", categorySlug: "mac" },
  { name: "iMac 24 M4", slug: "imac-24-m4", categorySlug: "mac" },
  { name: "iMac 24 M5", slug: "imac-24-m5", categorySlug: "mac" },
  // Mac mini
  { name: "Mac mini M1", slug: "mac-mini-m1", categorySlug: "mac" },
  { name: "Mac mini M2", slug: "mac-mini-m2", categorySlug: "mac" },
  { name: "Mac mini M2 Pro", slug: "mac-mini-m2-pro", categorySlug: "mac" },
  { name: "Mac mini M4", slug: "mac-mini-m4", categorySlug: "mac" },
  { name: "Mac mini M5", slug: "mac-mini-m5", categorySlug: "mac" },
  // Mac Studio
  { name: "Mac Studio M2 Max", slug: "mac-studio-m2-max", categorySlug: "mac" },
  {
    name: "Mac Studio M2 Ultra",
    slug: "mac-studio-m2-ultra",
    categorySlug: "mac",
  },
  { name: "Mac Studio M4 Max", slug: "mac-studio-m4-max", categorySlug: "mac" },
  {
    name: "Mac Studio M4 Ultra",
    slug: "mac-studio-m4-ultra",
    categorySlug: "mac",
  },
  { name: "Mac Studio M5 Max", slug: "mac-studio-m5-max", categorySlug: "mac" },
  {
    name: "Mac Studio M5 Ultra",
    slug: "mac-studio-m5-ultra",
    categorySlug: "mac",
  },
  // Mac Pro
  { name: "Mac Pro M2 Ultra", slug: "mac-pro-m2-ultra", categorySlug: "mac" },
  {
    name: "Mac Pro M4 Extreme",
    slug: "mac-pro-m4-extreme",
    categorySlug: "mac",
  },
  // MacBook Air 15
  { name: "MacBook Air 15 M3", slug: "macbook-air-15-m3", categorySlug: "mac" },
  { name: "MacBook Air 15 M4", slug: "macbook-air-15-m4", categorySlug: "mac" },
  { name: "MacBook Air 15 M5", slug: "macbook-air-15-m5", categorySlug: "mac" },
];

// ══════════════════════════════════════════════════════════════════════════════
// ║                            MODELOS DE IPAD                                    ║
// ══════════════════════════════════════════════════════════════════════════════

export const IPAD_MODELS: SeedModel[] = [
  { name: "iPad 10", slug: "ipad-10", categorySlug: "ipad" },
  { name: "iPad 11", slug: "ipad-11", categorySlug: "ipad" },
  { name: "iPad 13", slug: "ipad-13", categorySlug: "ipad" },
  { name: "iPad Air 11 M2", slug: "ipad-air-11-m2", categorySlug: "ipad" },
  { name: "iPad Air 11 M3", slug: "ipad-air-11-m3", categorySlug: "ipad" },
  { name: "iPad Air 13 M2", slug: "ipad-air-13-m2", categorySlug: "ipad" },
  { name: "iPad Air 13 M3", slug: "ipad-air-13-m3", categorySlug: "ipad" },
  { name: "iPad Pro 11 M4", slug: "ipad-pro-11-m4", categorySlug: "ipad" },
  { name: "iPad Pro 11 M5", slug: "ipad-pro-11-m5", categorySlug: "ipad" },
  { name: "iPad Pro 13 M4", slug: "ipad-pro-13-m4", categorySlug: "ipad" },
  { name: "iPad Pro 13 M5", slug: "ipad-pro-13-m5", categorySlug: "ipad" },
  { name: "iPad mini", slug: "ipad-mini", categorySlug: "ipad" },
  {
    name: "iPad mini A17 Pro",
    slug: "ipad-mini-a17-pro",
    categorySlug: "ipad",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// ║                            MODELOS DE APPLE WATCH                             ║
// ══════════════════════════════════════════════════════════════════════════════

export const WATCH_MODELS: SeedModel[] = [
  { name: "Watch Series 7", slug: "watch-series-7", categorySlug: "watch" },
  { name: "Watch Series 8", slug: "watch-series-8", categorySlug: "watch" },
  { name: "Watch Series 9", slug: "watch-series-9", categorySlug: "watch" },
  { name: "Watch Series 10", slug: "watch-series-10", categorySlug: "watch" },
  { name: "Watch Ultra 2", slug: "watch-ultra-2", categorySlug: "watch" },
  { name: "Watch Ultra 3", slug: "watch-ultra-3", categorySlug: "watch" },
  { name: "Watch SE 2022", slug: "watch-se-2022", categorySlug: "watch" },
  { name: "Watch SE 2024", slug: "watch-se-2024", categorySlug: "watch" },
];

// ══════════════════════════════════════════════════════════════════════════════
// ║                            VARIANTES                                          ══════════════════════════════════════════════════════════════════════════════

export const VARIANTS_BY_MODEL: Record<string, string[]> = {
  // iPhone 11
  "iphone-11": ["64GB", "128GB"],
  "iphone-11-pro": ["64GB", "256GB", "512GB"],
  "iphone-11-pro-max": ["64GB", "256GB", "512GB"],
  // iPhone 12
  "iphone-12": ["64GB", "128GB", "256GB"],
  "iphone-12-mini": ["64GB", "128GB", "256GB"],
  "iphone-12-pro": ["128GB", "256GB", "512GB"],
  "iphone-12-pro-max": ["128GB", "256GB", "512GB"],
  // iPhone 13
  "iphone-13": ["128GB", "256GB", "512GB"],
  "iphone-13-mini": ["128GB", "256GB", "512GB"],
  "iphone-13-pro": ["128GB", "256GB", "512GB", "1TB"],
  "iphone-13-pro-max": ["128GB", "256GB", "512GB", "1TB"],
  // iPhone 14
  "iphone-14": ["128GB", "256GB", "512GB"],
  "iphone-14-plus": ["128GB", "256GB", "512GB"],
  "iphone-14-pro": ["128GB", "256GB", "512GB", "1TB"],
  "iphone-14-pro-max": ["128GB", "256GB", "512GB", "1TB"],
  // iPhone 15
  "iphone-15": ["128GB", "256GB", "512GB"],
  "iphone-15-plus": ["128GB", "256GB", "512GB"],
  "iphone-15-pro": ["256GB", "512GB", "1TB"],
  "iphone-15-pro-max": ["256GB", "512GB", "1TB"],
  // iPhone 16
  "iphone-16": ["128GB", "256GB", "512GB"],
  "iphone-16-plus": ["128GB", "256GB", "512GB"],
  "iphone-16-pro": ["256GB", "512GB", "1TB"],
  "iphone-16-pro-max": ["256GB", "512GB", "1TB"],
  // iPhone 17
  "iphone-17": ["128GB", "256GB", "512GB"],
  "iphone-17-plus": ["128GB", "256GB", "512GB"],
  "iphone-17-pro": ["256GB", "512GB", "1TB"],
  "iphone-17-pro-max": ["256GB", "512GB", "1TB"],
  "iphone-17-air": ["128GB", "256GB", "512GB"],
  // MacBook Air
  "macbook-air-m1": ["256GB", "512GB", "1TB"],
  "macbook-air-m2": ["256GB", "512GB", "1TB"],
  "macbook-air-m3": ["256GB", "512GB", "1TB"],
  "macbook-air-m4": ["256GB", "512GB", "1TB"],
  "macbook-air-m5": ["256GB", "512GB", "1TB"],
  "macbook-air-15-m3": ["256GB", "512GB", "1TB"],
  "macbook-air-15-m4": ["256GB", "512GB", "1TB"],
  "macbook-air-15-m5": ["256GB", "512GB", "1TB"],
  // MacBook Pro
  "macbook-pro-13-m1": ["256GB", "512GB", "1TB"],
  "macbook-pro-13-m2": ["256GB", "512GB", "1TB"],
  "macbook-pro-14-m3": ["512GB", "1TB", "2TB"],
  "macbook-pro-14-m4": ["512GB", "1TB", "2TB"],
  "macbook-pro-14-m5": ["512GB", "1TB", "2TB"],
  "macbook-pro-16-m3": ["512GB", "1TB", "2TB"],
  "macbook-pro-16-m4": ["512GB", "1TB", "2TB"],
  "macbook-pro-16-m5": ["512GB", "1TB", "2TB"],
  // iMac
  "imac-24-m1": ["256GB", "512GB", "1TB"],
  "imac-24-m3": ["256GB", "512GB", "1TB"],
  "imac-24-m4": ["256GB", "512GB", "1TB"],
  "imac-24-m5": ["256GB", "512GB", "1TB"],
  // Mac mini
  "mac-mini-m1": ["256GB", "512GB", "1TB"],
  "mac-mini-m2": ["256GB", "512GB", "1TB"],
  "mac-mini-m2-pro": ["256GB", "512GB", "1TB", "2TB"],
  "mac-mini-m4": ["256GB", "512GB", "1TB", "2TB"],
  "mac-mini-m5": ["256GB", "512GB", "1TB", "2TB"],
  // Mac Studio
  "mac-studio-m2-max": ["512GB", "1TB", "2TB", "4TB"],
  "mac-studio-m2-ultra": ["1TB", "2TB", "4TB", "8TB"],
  "mac-studio-m4-max": ["512GB", "1TB", "2TB", "4TB"],
  "mac-studio-m4-ultra": ["1TB", "2TB", "4TB", "8TB"],
  "mac-studio-m5-max": ["512GB", "1TB", "2TB", "4TB"],
  "mac-studio-m5-ultra": ["1TB", "2TB", "4TB", "8TB"],
  // Mac Pro
  "mac-pro-m2-ultra": ["1TB", "2TB", "4TB", "8TB"],
  "mac-pro-m4-extreme": ["1TB", "2TB", "4TB", "8TB"],
  // iPad
  "ipad-10": ["64GB", "256GB"],
  "ipad-11": ["128GB", "256GB", "512GB"],
  "ipad-13": ["128GB", "256GB", "512GB", "1TB"],
  "ipad-air-11-m2": ["128GB", "256GB", "512GB"],
  "ipad-air-11-m3": ["128GB", "256GB", "512GB"],
  "ipad-air-13-m2": ["128GB", "256GB", "512GB"],
  "ipad-air-13-m3": ["128GB", "256GB", "512GB"],
  "ipad-pro-11-m4": ["256GB", "512GB", "1TB", "2TB"],
  "ipad-pro-11-m5": ["256GB", "512GB", "1TB", "2TB"],
  "ipad-pro-13-m4": ["256GB", "512GB", "1TB", "2TB"],
  "ipad-pro-13-m5": ["256GB", "512GB", "1TB", "2TB"],
  "ipad-mini": ["64GB", "256GB"],
  "ipad-mini-a17-pro": ["128GB", "256GB", "512GB"],
  // Apple Watch
  "watch-series-7": ["40mm", "41mm", "44mm", "45mm"],
  "watch-series-8": ["40mm", "41mm", "44mm", "45mm"],
  "watch-series-9": ["40mm", "41mm", "44mm", "45mm"],
  "watch-series-10": ["42mm", "44mm", "46mm"],
  "watch-ultra-2": ["49mm"],
  "watch-ultra-3": ["49mm"],
  "watch-se-2022": ["40mm", "44mm"],
  "watch-se-2024": ["40mm", "44mm"],
};

// ══════════════════════════════════════════════════════════════════════════════
// ║                       BASE PRICES BY MODEL                                   ║
// ══════════════════════════════════════════════════════════════════════════════

const BASE_PRICES: Record<string, number> = {
  // iPhone 11 (usados)
  "iphone-11": 250,
  "iphone-11-pro": 350,
  "iphone-11-pro-max": 400,
  // iPhone 12 (usados)
  "iphone-12": 350,
  "iphone-12-mini": 300,
  "iphone-12-pro": 500,
  "iphone-12-pro-max": 550,
  // iPhone 13 (usados)
  "iphone-13": 450,
  "iphone-13-mini": 400,
  "iphone-13-pro": 650,
  "iphone-13-pro-max": 750,
  // iPhone 14 (usados)
  "iphone-14": 550,
  "iphone-14-plus": 600,
  "iphone-14-pro": 800,
  "iphone-14-pro-max": 900,
  // iPhone 15 (usados)
  "iphone-15": 700,
  "iphone-15-plus": 750,
  "iphone-15-pro": 1000,
  "iphone-15-pro-max": 1100,
  // iPhone 16 (nuevos)
  "iphone-16": 900,
  "iphone-16-plus": 1000,
  "iphone-16-pro": 1200,
  "iphone-16-pro-max": 1300,
  // iPhone 17 (nuevos)
  "iphone-17": 950,
  "iphone-17-plus": 1050,
  "iphone-17-pro": 1250,
  "iphone-17-pro-max": 1450,
  "iphone-17-air": 850,
  // MacBook Air
  "macbook-air-m1": 800,
  "macbook-air-m2": 950,
  "macbook-air-m3": 1100,
  "macbook-air-m4": 1200,
  "macbook-air-m5": 1300,
  "macbook-air-15-m3": 1300,
  "macbook-air-15-m4": 1400,
  "macbook-air-15-m5": 1500,
  // MacBook Pro
  "macbook-pro-13-m1": 1000,
  "macbook-pro-13-m2": 1200,
  "macbook-pro-14-m3": 1800,
  "macbook-pro-14-m4": 2000,
  "macbook-pro-14-m5": 2200,
  "macbook-pro-16-m3": 2500,
  "macbook-pro-16-m4": 2800,
  "macbook-pro-16-m5": 3000,
  // iMac
  "imac-24-m1": 1100,
  "imac-24-m3": 1300,
  "imac-24-m4": 1500,
  "imac-24-m5": 1700,
  // Mac mini
  "mac-mini-m1": 700,
  "mac-mini-m2": 800,
  "mac-mini-m2-pro": 1300,
  "mac-mini-m4": 600,
  "mac-mini-m5": 700,
  // Mac Studio
  "mac-studio-m2-max": 3000,
  "mac-studio-m2-ultra": 5500,
  "mac-studio-m4-max": 3500,
  "mac-studio-m4-ultra": 6000,
  "mac-studio-m5-max": 4000,
  "mac-studio-m5-ultra": 6500,
  // Mac Pro
  "mac-pro-m2-ultra": 7000,
  "mac-pro-m4-extreme": 10000,
  // iPad
  "ipad-10": 350,
  "ipad-11": 450,
  "ipad-13": 600,
  "ipad-air-11-m2": 500,
  "ipad-air-11-m3": 550,
  "ipad-air-13-m2": 650,
  "ipad-air-13-m3": 700,
  "ipad-pro-11-m4": 800,
  "ipad-pro-11-m5": 900,
  "ipad-pro-13-m4": 1100,
  "ipad-pro-13-m5": 1200,
  "ipad-mini": 400,
  "ipad-mini-a17-pro": 500,
  // Apple Watch
  "watch-series-7": 250,
  "watch-series-8": 300,
  "watch-series-9": 350,
  "watch-series-10": 400,
  "watch-ultra-2": 700,
  "watch-ultra-3": 800,
  "watch-se-2022": 200,
  "watch-se-2024": 250,
};

// ══════════════════════════════════════════════════════════════════════════════
// ║                       PRODUCTOS GENERADOS                                    ║
// ══════════════════════════════════════════════════════════════════════════════

function getCondition(modelSlug: string): "NEW" | "USED" {
  const iphone15AndBelow = [
    "iphone-11",
    "iphone-11-pro",
    "iphone-11-pro-max",
    "iphone-12",
    "iphone-12-mini",
    "iphone-12-pro",
    "iphone-12-pro-max",
    "iphone-13",
    "iphone-13-mini",
    "iphone-13-pro",
    "iphone-13-pro-max",
    "iphone-14",
    "iphone-14-plus",
    "iphone-14-pro",
    "iphone-14-pro-max",
    "iphone-15",
    "iphone-15-plus",
    "iphone-15-pro",
    "iphone-15-pro-max",
  ];

  if (iphone15AndBelow.includes(modelSlug)) {
    return "USED";
  }
  return "NEW";
}

function getDescription(
  modelSlug: string,
  variantName: string,
  condition: "NEW" | "USED",
): string {
  const isNew = condition === "NEW";
  const base = `Producto Apple ${isNew ? "nuevo sellado" : "usado"}`;

  if (modelSlug.startsWith("iphone-")) {
    return isNew
      ? `${base}. Garantía Apple incluida. Libre de fábrica.`
      : `${base}. Batería verificada. Sin detalles. Incluye accesorios.`;
  }

  if (modelSlug.startsWith("macbook") || modelSlug.startsWith("mac-")) {
    return isNew
      ? `${base}. Modelo reciente con garantía Apple.`
      : `${base}. Revisado y listo para usar.`;
  }

  if (modelSlug.startsWith("ipad") || modelSlug.startsWith("watch")) {
    return isNew ? `${base}. Garantía oficial.` : `${base}. Excelente estado.`;
  }

  return `${base}.`;
}

export function generateProductsData(): SeedVariant[] {
  const products: SeedVariant[] = [];

  // Solo generamos productos para iPhones
  // Mac, iPad y Apple Watch solo tienen modelos y variantes en la DB
  const models = IPHONE_MODELS;

  for (const model of models) {
    const variants = VARIANTS_BY_MODEL[model.slug];
    if (!variants) continue;

    const basePrice = BASE_PRICES[model.slug] || 500;
    const condition = getCondition(model.slug);

    for (let i = 0; i < variants.length; i++) {
      const variantName = variants[i];
      const priceMultiplier = 1 + i * 0.2;
      const price = Math.round(basePrice * priceMultiplier);

      products.push({
        modelSlug: model.slug,
        variantName,
        price,
        condition,
        title: `${model.name} ${variantName}`,
        description: getDescription(model.slug, variantName, condition),
        isFeatured: condition === "NEW" && i === 0,
      });
    }
  }

  return products;
}

export const ALL_MODELS = [
  ...IPHONE_MODELS,
  ...MAC_MODELS,
  ...IPAD_MODELS,
  ...WATCH_MODELS,
];
