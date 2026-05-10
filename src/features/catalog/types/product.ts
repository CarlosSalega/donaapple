// ============================================
// Product Type - Core domain type for the catalog
// ============================================

export type ProductCondition =
  | "new"
  | "refurbished"
  | "used-excellent"
  | "used-good";

export interface ProductImage {
  src: string;
  alt: string;
  priority?: boolean;
  preset?: ProductImagePreset;
}

export type ProductImagePreset = "thumbnail" | "card" | "detail" | "zoom";

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: "Apple";
  model: string;
  storage: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  battery?: string;
  warranty?: string;
  description?: string;
  images: ProductImage[];
  isFeatured?: boolean;
  isNew?: boolean;
  stock: number;
  colors?: string[];
}

export interface FilterState {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  storage?: string;
}

// ============================================
// Condition display helpers
// ============================================
export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "Nuevo",
  refurbished: "Reacondicionado",
  "used-excellent": "Semi-Nuevo",
  "used-good": "Semi-Nuevo",
};

export const CONDITION_COLORS: Record<ProductCondition, string> = {
  new: "bg-success",
  refurbished: "bg-brand",
  "used-excellent": "bg-warning",
  "used-good": "bg-text-secondary",
};

// ============================================
// Storage options
// ============================================
export const STORAGE_OPTIONS = [
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
] as const;

// ============================================
// iPhone models
// ============================================
export const IPHONE_MODELS = [
  "iPhone 11",
  "iPhone 12",
  "iPhone 13",
  "iPhone 14",
  "iPhone 15",
  "iPhone 16",
  "iPhone 17",
] as const;

export type IPhoneModel = (typeof IPHONE_MODELS)[number];
