/**
 * ╔══════════════════════════════════════════╗
 * ║    IMAGES FEATURE — UPLOAD VALIDATION    ║
 * ╚══════════════════════════════════════════╝
 *
 * Validaciones reutilizables tanto en el cliente
 * (antes de hacer fetch) como en el servidor (route handler).
 */

import { UPLOAD_LIMITS } from "../config";
import type { UploadValidationError } from "../types/images";

export interface ValidationResult {
  valid: boolean;
  errors: UploadValidationError[];
}

export function validateFile(file: File): UploadValidationError | null {
  if (!UPLOAD_LIMITS.ALLOWED_MIME_TYPES.includes(file.type as (typeof UPLOAD_LIMITS.ALLOWED_MIME_TYPES)[number])) {
    return {
      file: file.name,
      reason: "type",
      message: `${file.name}: tipo no permitido (${file.type})`,
    };
  }

  if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
    const mb = UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES / 1024 / 1024;
    return {
      file: file.name,
      reason: "size",
      message: `${file.name}: supera el tamaño máximo de ${mb}MB`,
    };
  }

  return null;
}

export function validateFiles(
  files: File[],
  currentCount: number = 0,
): ValidationResult {
  const errors: UploadValidationError[] = [];

  if (currentCount + files.length > UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD) {
    errors.push({
      file: "",
      reason: "type",
      message: `Máximo ${UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD} imágenes permitidas`,
    });
    return { valid: false, errors };
  }

  for (const file of files) {
    const error = validateFile(file);
    if (error) errors.push(error);
  }

  return { valid: errors.length === 0, errors };
}
