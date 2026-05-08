/**
 * ╔══════════════════════════════════════════╗
 * ║     IMAGES FEATURE — CLOUDINARY          ║
 * ╚══════════════════════════════════════════╝
 *
 * ENV requeridas:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * ENV opcionales:
 *   CLOUDINARY_UPLOAD_FOLDER   (default: "uploads")
 */

import { v2 as cloudinary } from "cloudinary";

import { IMAGE_VARIANTS, type ImageVariant } from "../config";
import type { ImageProvider } from "../lib/image-provider.interface";
import type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
} from "../types/images";

// Transformaciones por variante — solo Cloudinary las aplica en URL
const CLOUDINARY_TRANSFORMS: Record<ImageVariant, string> = {
  thumbnail: "w_300,h_225,c_fill,f_auto,q_auto,dpr_auto",
  card: "w_400,h_300,c_fill,f_auto,q_auto,dpr_auto",
  detail: "w_800,h_600,c_fill,f_auto,q_auto,dpr_auto",
  fullscreen: "w_1200,h_900,c_limit,f_auto,q_auto,dpr_auto",
};

export class CloudinaryProvider implements ImageProvider {
  private readonly cloudName: string;
  private readonly folder: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    this.folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "uploads";

    if (!this.cloudName) {
      throw new Error(
        "[CloudinaryProvider] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no definida",
      );
    }

    cloudinary.config({
      cloud_name: this.cloudName,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });
  }

  async upload(file: File): Promise<UploadResult> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: this.folder,
              resource_type: "image",
              quality: "auto",
              fetch_format: "auto",
              overwrite: false,
              invalidate: true,
            },
            (error, response) => {
              if (error)
                reject(
                  new Error(
                    `[CloudinaryProvider] Upload failed: ${error.message}`,
                  ),
                );
              else resolve(response!);
            },
          )
          .end(buffer);
      },
    );

    return {
      key: result.public_id,
      url: result.secure_url,
    };
  }

  async delete(key: string): Promise<DeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(key);
      // "not found" se trata como éxito — idempotente
      const success = result.result === "ok" || result.result === "not found";
      return { success, error: success ? undefined : result.result };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  async deleteMany(keys: string[]): Promise<DeleteManyResult> {
    const results = await Promise.allSettled(keys.map((k) => this.delete(k)));
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;
    return { successful, failed: keys.length - successful };
  }

  resolveUrl(key: string, variant: ImageVariant): string {
    const transform = CLOUDINARY_TRANSFORMS[variant];
    // Limpia extensión — Cloudinary la maneja con f_auto
    const cleanKey = key.replace(/\.(webp|jpg|jpeg|png|gif)$/i, "");
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transform}/${cleanKey}`;
  }
}
