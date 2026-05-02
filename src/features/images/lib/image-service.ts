/**
 * ╔══════════════════════════════════════════╗
 * ║      IMAGES FEATURE — IMAGE SERVICE      ║
 * ╚══════════════════════════════════════════╝
 *
 * Fachada singleton que resuelve el provider activo.
 * El resto del proyecto SOLO importa de acá — nunca
 * importa un provider directamente.
 *
 * El provider se instancia una sola vez (singleton)
 * para evitar reconectar/reconfigurar en cada request.
 */

import { ACTIVE_PROVIDER, type ImageVariant } from "../config";
import type { ImageProvider } from "./image-provider.interface";
import type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
} from "../types/images";
import { CloudinaryProvider } from "../providers/cloudinary.provider";
import { LocalProvider } from "../providers/local.provider";

// ─── Singleton ────────────────────────────────────────────────────────────────

let _provider: ImageProvider | null = null;

function getProvider(): ImageProvider {
  if (_provider) return _provider;

  switch (ACTIVE_PROVIDER) {
    case "cloudinary": {
      _provider = new CloudinaryProvider();
      break;
    }

    case "local": {
      _provider = new LocalProvider();
      break;
    }
    default:
      throw new Error(
        `[ImageService] Provider no soportado: "${ACTIVE_PROVIDER}". ` +
          `Valores válidos: cloudinary | vercel-blob | s3 | r2 | local`,
      );
  }

  return _provider!;
}

// ─── API pública ──────────────────────────────────────────────────────────────

export const ImageService = {
  upload(file: File): Promise<UploadResult> {
    return getProvider().upload(file);
  },

  delete(key: string): Promise<DeleteResult> {
    return getProvider().delete(key);
  },

  deleteMany(keys: string[]): Promise<DeleteManyResult> {
    return getProvider().deleteMany(keys);
  },

  resolveUrl(key: string, variant: ImageVariant = "card"): string {
    return getProvider().resolveUrl(key, variant);
  },

  /** Expone el nombre del provider activo (útil para logs/debug) */
  get providerName(): string {
    return ACTIVE_PROVIDER;
  },
};
