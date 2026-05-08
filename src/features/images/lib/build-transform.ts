/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║    IMAGES FEATURE — BUILD CLOUDINARY TRANSFORM                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝ *
 * Helper que construye el string de transformacion para Cloudinary
 * a partir de un ImagePresetConfig.
 *
 * Genera: w_500,h_500,c_pad,b_white,f_auto,q_auto,dpr_auto
 */

import type { CropMode, ImagePresetConfig } from "../config";

export function buildCloudinaryTransform(config: ImagePresetConfig): string {
  const parts: string[] = [];

  parts.push(`w_${config.width}`);
  if (config.height) {
    parts.push(`h_${config.height}`);
  }

  const cropMap: Record<CropMode, string> = {
    fill: "c_fill",
    limit: "c_limit",
    pad: "c_pad",
  };
  parts.push(cropMap[config.crop]);

  if (config.crop === "pad" && config.background) {
    parts.push(`b_${config.background}`);
  }

  parts.push("f_auto", "q_auto", "dpr_auto");

  return parts.join(",");
}