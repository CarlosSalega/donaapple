/**
 * ╔══════════════════════════════════════════╗
 * ║   IMAGES FEATURE — PROVIDER INTERFACE    ║
 * ╚══════════════════════════════════════════╝
 *
 * Contrato que TODOS los providers deben implementar.
 *
 * La clave del diseño agnóstico es `resolveUrl()`:
 * cada provider sabe construir su propia URL pública,
 * por lo que cambiar de Cloudinary a S3 no toca
 * ningún componente ni página del proyecto.
 */

import type {
  ImageVariant,
  MediaDomain,
  ImagePresetConfig,
} from "../config";
import type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
} from "../types/images";

export interface ImageProvider {
  upload(file: File): Promise<UploadResult>;
  delete(key: string): Promise<DeleteResult>;
  deleteMany(keys: string[]): Promise<DeleteManyResult>;

  /**
   * v2: resuelve con domain + preset usando IMAGE_PRESETS.
   * v1 legacy: resuelve con variant flat usando IMAGE_VARIANTS.
   */
  resolveUrl(key: string, domain: MediaDomain, preset: string): string;
  resolveUrl(key: string, variant: ImageVariant): string;
  resolveUrl(key: string): string;
}