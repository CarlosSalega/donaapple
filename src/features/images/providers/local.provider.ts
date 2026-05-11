/**
 * ╔══════════════════════════════════════════╗
 * ║     IMAGES FEATURE — LOCAL PROVIDER      ║
 * ╚══════════════════════════════════════════╝
 *
 * Para desarrollo local sin cuenta en ningún provider externo.
 * Guarda las imágenes en /public/uploads/.
 *
 * ⚠️  NO usar en producción:
 *   - Las imágenes no persisten entre deploys
 *   - No escala horizontalmente
 *
 * ENV opcionales:
 *   LOCAL_UPLOAD_DIR   (default: "public/uploads")
 *   LOCAL_PUBLIC_PATH  (default: "/uploads")
 */

import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

import type { ImageProvider } from "../lib/image-provider.interface";
import type {
  UploadResult,
  DeleteResult,
  DeleteManyResult,
} from "../types/images";
import type { ImageVariant, MediaDomain } from "../config";

export class LocalProvider implements ImageProvider {
  private readonly uploadDir: string;
  private readonly publicPath: string;

  constructor() {
    this.uploadDir =
      process.env.LOCAL_UPLOAD_DIR ??
      path.join(process.cwd(), "public", "uploads");
    this.publicPath = process.env.LOCAL_PUBLIC_PATH ?? "/uploads";
  }

  private async ensureDir() {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  async upload(file: File): Promise<UploadResult> {
    await this.ensureDir();

    const ext = file.name.split(".").pop() ?? "webp";
    const uid = crypto.randomUUID();
    const filename = `${uid}.${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    const key = filename;
    const url = `${this.publicPath}/${filename}`;

    return { key, url };
  }

  async delete(key: string): Promise<DeleteResult> {
    try {
      const filepath = path.join(this.uploadDir, key);
      await fs.unlink(filepath);
      return { success: true };
    } catch (error: unknown) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") return { success: true };
      return { success: false, error: err.message };
    }
  }

  async deleteMany(keys: string[]): Promise<DeleteManyResult> {
    const results = await Promise.allSettled(keys.map((k) => this.delete(k)));
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;
    return { successful, failed: keys.length - successful };
  }

  resolveUrl(key: string, domain: MediaDomain, preset: string): string;
  resolveUrl(key: string, variant: ImageVariant): string;
  resolveUrl(key: string): string;
  resolveUrl(
    key: string,
    _domainOrVariant?: MediaDomain | ImageVariant,
    _preset?: string,
  ): string {
    if (key.startsWith("/") || key.startsWith("http")) return key;
    return `${this.publicPath}/${key}`;
  }
}
