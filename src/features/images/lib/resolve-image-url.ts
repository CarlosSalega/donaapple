/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║    IMAGES FEATURE — RESOLVE IMAGE URL                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Función utilitaria para resolver URLs de imágenes.
 * Construye URLs de Cloudinary directamente sin importar el SDK del servidor.
 */

import { FALLBACK_IMAGE, IMAGE_VARIANTS, type ImageVariant } from "../config";

function buildCloudinaryUrl(key: string, variant: ImageVariant): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return key;

  const { width, height } = IMAGE_VARIANTS[variant];
  const parts = key.split("/");
  const publicId = parts.slice(-2).join("/").replace(/\.[^.]+$/, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}`;
}

export function resolveImageUrl(
  key: string | null | undefined,
  variant: ImageVariant = "card",
): string {
  if (!key) return FALLBACK_IMAGE;

  if (key.startsWith("http://") || key.startsWith("https://") || key.includes("/images/")) {
    return key;
  }

  return buildCloudinaryUrl(key, variant);
}