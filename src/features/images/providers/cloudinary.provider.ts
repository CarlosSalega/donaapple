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

import {
  IMAGE_PRESETS,
  IMAGE_VARIANTS,
  type ImageVariant,
  type MediaDomain,
  type ImagePresetConfig,
} from "../config";
import type { ImageProvider } from "../lib/image-provider.interface";
import type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
} from "../types/images";
import { buildCloudinaryTransform } from "../lib/build-transform";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPreset = Record<string, any>;

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

  private buildUrl(key: string, config: ImagePresetConfig): string {
    const cleanKey = key.replace(/\.(webp|jpg|jpeg|png|gif)$/i, "");
    const transform = buildCloudinaryTransform(config);
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transform}/${cleanKey}`;
  }

  resolveUrl(key: string, domain: MediaDomain, preset: string): string;
  resolveUrl(key: string, variant: ImageVariant): string;
  resolveUrl(key: string): string;
  resolveUrl(
    key: string,
    domainOrVariant?: MediaDomain | ImageVariant,
    preset?: string,
  ): string {
    if (preset !== undefined) {
      const domain = domainOrVariant as MediaDomain;
      const config = (IMAGE_PRESETS[domain] as AnyPreset)?.[preset] as
        | ImagePresetConfig
        | undefined;
      if (config) return this.buildUrl(key, config);
    }

    if (domainOrVariant !== undefined) {
      const variant = domainOrVariant as ImageVariant;
      const config = IMAGE_VARIANTS[variant];
      if (config) return this.buildUrl(key, config);
    }

    return this.buildUrl(key, IMAGE_VARIANTS.card);
  }
}