/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║    IMAGES FEATURE — RESOLVE IMAGE URL                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Función utilitaria para resolver URLs de imágenes.
 * Construye URLs de Cloudinary directamente sin importar el SDK del servidor.
 *
 * API v2 (3 args): resolveImageUrl(key, domain, preset)
 *   ej: resolveImageUrl(img, "product", "card")
 *
 * Backward compat (2 args): resolveImageUrl(key, variant)
 *   ej: resolveImageUrl(img, "card")
 *
 * Backward compat (1 arg): resolveImageUrl(key)
 *   ej: resolveImageUrl(img) — usa "card" como default
 */

import { FALLBACK_IMAGE, IMAGE_PRESETS, IMAGE_VARIANTS } from "../config";
import type {
  MediaDomain,
  ImageVariant,
  ImagePresetConfig,
} from "../config";
import { buildCloudinaryTransform } from "./build-transform";

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildCloudinaryUrl(
  key: string,
  config: ImagePresetConfig,
): string {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return key;

  const cleanKey = key.replace(/\.(webp|jpg|jpeg|png|gif)$/i, "");
  const transform = buildCloudinaryTransform(config);
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${cleanKey}`;
}

function isExternalOrLocal(key: string): boolean {
  return (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.includes("/images/")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPreset = Record<string, any>;

// ─── Overloads ────────────────────────────────────────────────────────────────

// v2: 3 args (domain + preset)
export function resolveImageUrl(
  key: string | null | undefined,
  domain: MediaDomain,
  preset: string,
): string;
// legacy: 2 args (variant flat)
export function resolveImageUrl(
  key: string | null | undefined,
  variant: ImageVariant,
): string;
// legacy: 1 arg (usa "card" default)
export function resolveImageUrl(key: string | null | undefined): string;

// ─── Implementación ────────────────────────────────────────────────────────────

export function resolveImageUrl(
  key: string | null | undefined,
  domainOrVariant?: MediaDomain | ImageVariant,
  preset?: string,
): string {
  if (!key) return FALLBACK_IMAGE;

  if (isExternalOrLocal(key)) return key;

  if (preset !== undefined) {
    const domain = domainOrVariant as MediaDomain;
    const domainPresets = IMAGE_PRESETS[domain] as AnyPreset | undefined;
    const config = domainPresets?.[preset] as ImagePresetConfig | undefined;
    if (config) {
      return buildCloudinaryUrl(key, config);
    }
  }

  if (domainOrVariant !== undefined) {
    const variant = domainOrVariant as ImageVariant;
    const legacyConfig = IMAGE_VARIANTS[variant];
    if (legacyConfig) {
      return buildCloudinaryUrl(key, legacyConfig);
    }
  }

  return buildCloudinaryUrl(key, IMAGE_VARIANTS.card);
}