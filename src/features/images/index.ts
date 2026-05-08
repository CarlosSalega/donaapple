/**
 * ╔══════════════════════════════════════════╗
 * ║     IMAGES FEATURE — PUBLIC API          ║
 * ╚══════════════════════════════════════════╝
 */

// Config & types
export {
  ACTIVE_PROVIDER,
  IMAGE_VARIANTS,
  IMAGE_PRESETS,
  UPLOAD_LIMITS,
  FALLBACK_IMAGE,
} from "./config";
export type {
  ImageVariant,
  ImageProviderName,
  MediaDomain,
  CropMode,
  ImagePresetConfig,
  ProductPresets,
  BannerPresets,
  BrandPresets,
  EditorialPresets,
  ProductPreset,
  BannerPreset,
  BrandPreset,
  EditorialPreset,
} from "./config";
export type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
  MediaDomain as ImageDomain,
} from "./types/images";

// Interface (para extender con providers custom)
export type { ImageProvider } from "./lib/image-provider.interface";

// Service — API principal
export { ImageService } from "./lib/image-service";

// Helpers
export { resolveImageUrl } from "./lib/resolve-image-url";
export { buildCloudinaryTransform } from "./lib/build-transform";
export { validateFile, validateFiles } from "./lib/validate-upload";
