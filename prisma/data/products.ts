export interface SeedProduct {
  modelSlug: string;
  variantName: string;
  condition: "NEW" | "USED";
  price: number;
  description: string;
  isFeatured?: boolean;
  color?: string;
}

export const PRODUCTS: SeedProduct[] = [
  // iPhone 12 (USED)
  {
    modelSlug: "iphone-12",
    variantName: "128GB",
    condition: "USED",
    price: 420,
    description: "Usado. Excelente estado. Batería 85%+.",
    isFeatured: true,
  },

  // iPhone 13 (USED)
  {
    modelSlug: "iphone-13",
    variantName: "128GB",
    condition: "USED",
    price: 480,
    description: "Usado. Muy buen estado. Sin detalles.",
    isFeatured: true,
  },

  // iPhone 14 (USED)
  {
    modelSlug: "iphone-14",
    variantName: "128GB",
    condition: "USED",
    price: 550,
    description: "Usado. Excelente estado. Sin detalles. Incluye cargador.",
    isFeatured: true,
  },
  {
    modelSlug: "iphone-14",
    variantName: "256GB",
    condition: "USED",
    price: 650,
    description: "Usado. Batería 90%+. Excelente estado. Incluye cargador.",
    isFeatured: false,
  },

  // iPhone 14 Pro (USED)
  {
    modelSlug: "iphone-14-pro",
    variantName: "256GB",
    condition: "USED",
    price: 750,
    description: "Usado. Batería 88%+. Titanium pristine.",
    isFeatured: true,
  },

  // iPhone 15 (USED)
  {
    modelSlug: "iphone-15",
    variantName: "128GB",
    condition: "USED",
    price: 700,
    description: "Usado. Batería 92%+. Sin detalles.",
    isFeatured: true,
  },
  {
    modelSlug: "iphone-15",
    variantName: "256GB",
    condition: "USED",
    price: 800,
    description: "Usado. Batería 90%+. Perfecto estado.",
    isFeatured: false,
  },

  // iPhone 15 Plus (USED)
  {
    modelSlug: "iphone-15-plus",
    variantName: "256GB",
    condition: "USED",
    price: 850,
    description: "Usado. Batería 85%+. Like new.",
    isFeatured: false,
  },

  // iPhone 15 Pro (USED)
  {
    modelSlug: "iphone-15-pro",
    variantName: "256GB",
    condition: "USED",
    price: 1000,
    description: "Usado. Batería 85%+. Titanium pristine.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-15-pro",
    variantName: "512GB",
    condition: "USED",
    price: 1100,
    description: "Usado. Batería 87%+. Excelente estado.",
    isFeatured: false,
  },

  // iPhone 16 (NEW)
  {
    modelSlug: "iphone-16",
    variantName: "128GB",
    condition: "NEW",
    price: 899,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: true,
  },
  {
    modelSlug: "iphone-16",
    variantName: "256GB",
    condition: "NEW",
    price: 999,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },

  // iPhone 16 Plus (NEW)
  {
    modelSlug: "iphone-16-plus",
    variantName: "256GB",
    condition: "NEW",
    price: 1099,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },

  // iPhone 16 Pro (NEW)
  {
    modelSlug: "iphone-16-pro",
    variantName: "256GB",
    condition: "NEW",
    price: 1199,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-16-pro",
    variantName: "512GB",
    condition: "NEW",
    price: 1399,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-16-pro",
    variantName: "1TB",
    condition: "NEW",
    price: 1599,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },

  // iPhone 17 (NEW)
  {
    modelSlug: "iphone-17",
    variantName: "128GB",
    condition: "NEW",
    price: 949,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-17",
    variantName: "256GB",
    condition: "NEW",
    price: 1049,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },

  // iPhone 17 Pro (NEW)
  {
    modelSlug: "iphone-17-pro",
    variantName: "256GB",
    condition: "NEW",
    price: 1249,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-17-pro",
    variantName: "512GB",
    condition: "NEW",
    price: 1449,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-17-pro",
    variantName: "1TB",
    condition: "NEW",
    price: 1649,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },

  // iPhone 17 Air (NEW)
  {
    modelSlug: "iphone-17-air",
    variantName: "256GB",
    condition: "NEW",
    price: 1149,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
  {
    modelSlug: "iphone-17-air",
    variantName: "512GB",
    condition: "NEW",
    price: 1349,
    description: "Nuevo sellado. Garantía Apple 1 año.",
    isFeatured: false,
  },
];
