/**
 * ╔══════════════════════════════════════════╗
 * ║    IMAGES FEATURE — RESOLVE IMAGE URL    ║
 * ╚══════════════════════════════════════════╝
 *
 * Función utilitaria para usar en componentes y páginas.
 * Delega al provider activo — no tiene lógica de URL propia.
 *
 * USO:
 *   import { resolveImageUrl } from "@/features/images"
 *   const url = resolveImageUrl(car.images[0], "card")
 */

import { FALLBACK_IMAGE, type ImageVariant } from "../config";
import { ImageService } from "./image-service";

export function resolveImageUrl(
  key: string | null | undefined,
  variant: ImageVariant = "card",
): string {
  if (!key) return FALLBACK_IMAGE;

  try {
    return ImageService.resolveUrl(key, variant);
  } catch {
    return FALLBACK_IMAGE;
  }
}
