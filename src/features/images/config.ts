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

// ─── Variantes de transformación ──────────────────────────────────────────────
// Cada provider implementa estas variantes a su manera.
// Cloudinary: usa transformaciones en la URL
// S3/Blob/R2: sirve la imagen original (sin transformación server-side)
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: 225 },
  card:      { width: 400, height: 300 },
  detail:    { width: 800, height: 600 },
  fullscreen:{ width: 1200, height: 900 },
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
