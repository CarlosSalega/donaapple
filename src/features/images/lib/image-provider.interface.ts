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

import type { ImageVariant } from "../config";
import type { UploadResult, DeleteResult, DeleteManyResult } from "../types/images";

export interface ImageProvider {
  /**
   * Sube un archivo al provider.
   * @returns key — identificador único para recuperar/borrar la imagen
   * @returns url — URL pública directa del provider
   */
  upload(file: File): Promise<UploadResult>;

  /**
   * Elimina una imagen por su key.
   */
  delete(key: string): Promise<DeleteResult>;

  /**
   * Elimina múltiples imágenes en paralelo.
   */
  deleteMany(keys: string[]): Promise<DeleteManyResult>;

  /**
   * Construye la URL pública de una imagen con la variante solicitada.
   *
   * - Cloudinary: aplica transformaciones en la URL (w_400,h_300,c_fill,...)
   * - S3 / R2 / Vercel Blob: retorna la URL base (sin transformación server-side)
   * - Local: retorna la ruta pública del archivo
   *
   * @param key     - La key retornada por upload()
   * @param variant - Tamaño/calidad deseado (thumbnail | card | detail | fullscreen)
   */
  resolveUrl(key: string, variant: ImageVariant): string;
}
