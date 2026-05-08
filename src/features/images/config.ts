/**
 * ╔══════════════════════════════════════════╗
 * ║       IMAGES FEATURE — CONFIG            ║
 * ║  Ajustá estos valores por proyecto       ║
 * ╚══════════════════════════════════════════╝
 */

// ─── Provider activo ──────────────────────────────────────────────────────────
// Cambiá IMAGE_PROVIDER en tu .env para switchear de provider.
// Valores válidos: "cloudinary" | "vercel-blob" | "s3" | "r2" | "local"
export const ACTIVE_PROVIDER = (process.env.IMAGE_PROVIDER ??
  "cloudinary") as ImageProviderName;

export type ImageProviderName =
  | "cloudinary"
  | "vercel-blob"
  | "s3"
  | "r2"
  | "local";

// ─── Image Presets por Dominio (v2) ──────────────────────────────────────────
// Configuraciones de transformacion agrupadas por proposito visual.
// Reemplazan a IMAGE_VARIANTS (flat) para suportarecommerce, banners, etc.
//
// - product: usa c_pad/c_limit + aspect-square para preservar productos verticales
// - banner: usa c_fill + object-cover para cobertura total del layout
// - brand: usa c_limit para logos sin recortar
//
// Usar con resolveImageUrl(key, domain, preset)
import type {
  MediaDomain,
  CropMode,
  ImagePresetConfig,
  ProductPresets,
  BannerPresets,
  BrandPresets,
  EditorialPresets,
  ProductPreset,
  BannerPreset,
  BrandPreset,
  EditorialPreset,
} from "./types/images";

export type { MediaDomain, CropMode, ImagePresetConfig };

export const IMAGE_PRESETS = {
  product: {
    thumbnail: { width: 200, height: 200, crop: "pad" as CropMode, background: "white" },
    card:      { width: 500, height: 500, crop: "pad" as CropMode, background: "white" },
    detail:    { width: 1200, height: 1200, crop: "limit" as CropMode },
    zoom:      { width: 2000, height: 2000, crop: "limit" as CropMode },
  },

  banner: {
    heroDesktop: { width: 1920, height: 1080, crop: "fill" as CropMode },
    heroMobile:  { width: 1080, height: 1350, crop: "fill" as CropMode },
    section:     { width: 1600, height: 900, crop: "fill" as CropMode },
  },

  brand: {
    logo: { width: 300, height: 300, crop: "limit" as CropMode },
  },

  editorial: {
    gallery: { width: 1200, height: 800, crop: "fill" as CropMode },
  },
} as const satisfies Record<MediaDomain, Record<string, ImagePresetConfig>>;

export type { ProductPresets, BannerPresets, BrandPresets, EditorialPresets };
export type { ProductPreset, BannerPreset, BrandPreset, EditorialPreset };

// ─── Backward Compatibility ───────────────────────────────────────────────────
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: 225, crop: "fill" as CropMode },
  card:      { width: 400, height: 300, crop: "fill" as CropMode },
  detail:    { width: 800, height: 600, crop: "fill" as CropMode },
  fullscreen:{ width: 1200, height: 900, crop: "limit" as CropMode },
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

// ─── Límites de upload ────────────────────────────────────────────────────────
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

// ─── Fallback ─────────────────────────────────────────────────────────────────
// Imagen que se muestra si la key es inválida o el provider falla.
// Ajustá al path de tu proyecto.
export const FALLBACK_IMAGE = "/placeholder.webp";

// ─── Cache ────────────────────────────────────────────────────────────────────
export const CACHE_TTL_SECONDS = 31536000; // 1 año
