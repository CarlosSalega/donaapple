/**
 * ╔══════════════════════════════════════════╗
 * ║       IMAGES FEATURE — TYPES             ║
 * ╚══════════════════════════════════════════╝
 */

import type { ImageVariant } from "../config";

export type { ImageVariant };

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
