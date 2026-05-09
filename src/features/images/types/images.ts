/**
 * ╔══════════════════════════════════════════╗
 * ║       IMAGES FEATURE — TYPES             ║
 * ╚══════════════════════════════════════════╝
 */

import type { ImageVariant } from "../config";

export type { ImageVariant };

// ─── Media Domain ─────────────────────────────────────────────────────────────
// Contexto / propósito de la imagen. Agrupa presets por tipo de uso.
export type MediaDomain = "product" | "banner" | "brand" | "editorial";

// ─── Crop Modes (Cloudinary) ──────────────────────────────────────────────────
// fill:   recorta para cubrir el frame (puede cortar contenido)
// limit:  escala sin recortar, agrega letterboxing si es necesario
// pad:    escala y agrega fondo para填充
export type CropMode = "fill" | "limit" | "pad";

// ─── Image Preset Config ──────────────────────────────────────────────────────
export interface ImagePresetConfig {
  width?: number; // opcional — requerido solo cuando crop no es "raw"
  height?: number;
  crop?: CropMode;
  background?: string; // solo se usa cuando crop === "pad"
  raw?: boolean; // true = sin transformaciones (imagen original)
}

// ─── Presets por Dominio ──────────────────────────────────────────────────────

export interface ProductPresets {
  thumbnail: ImagePresetConfig;
  card: ImagePresetConfig;
  detail: ImagePresetConfig;
  zoom: ImagePresetConfig;
}

export interface BannerPresets {
  heroDesktop: ImagePresetConfig;
  heroRaw: ImagePresetConfig;
  section: ImagePresetConfig;
}

export interface BrandPresets {
  logo: ImagePresetConfig;
}

export interface EditorialPresets {
  gallery: ImagePresetConfig;
}

// ─── Preset Keys por Dominio (para validacion en resolveUrl) ─────────────────

export type ProductPreset = keyof ProductPresets;
export type BannerPreset = keyof BannerPresets;
export type BrandPreset = keyof BrandPresets;
export type EditorialPreset = keyof EditorialPresets;

export interface UploadResult {
  /** Identificador único de la imagen en el provider (public_id, path, key, etc.) */
  key: string;
  /** URL pública directa tal como la devuelve el provider */
  url: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface DeleteManyResult {
  successful: number;
  failed: number;
}

export interface UploadValidationError {
  file: string;
  reason: "size" | "type";
  message: string;
}
