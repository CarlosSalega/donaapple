/**
 * ╔══════════════════════════════════════════╗
 * ║   IMAGES FEATURE — IMAGE UPLOAD UI       ║
 * ╚══════════════════════════════════════════╝
 *
 * Componente de UI puro — toda la lógica está en useImageUpload.
 */

"use client";

import { useRef } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { useImageUpload } from "../hooks/use-image-upload";
import { resolveImageUrl } from "../lib/resolve-image-url";
import { UPLOAD_LIMITS } from "../config";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxImages = UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, upload, remove } = useImageUpload({
    value,
    onChange,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await upload(files);
    // Reset input para permitir re-seleccionar el mismo archivo
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isAtLimit = value.length >= maxImages;
  const isDisabled = disabled || uploading || isAtLimit;

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={UPLOAD_LIMITS.ALLOWED_MIME_TYPES.join(",")}
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isDisabled}
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled}
        className="bg-foreground hover:bg-foreground/90 text-background"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Subiendo... {progress}%
          </>
        ) : (
          <>
            <ImagePlus className="mr-2 size-4" />
            Subir imágenes ({value.length}/{maxImages})
          </>
        )}
      </Button>

      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {value.map((key, index) => (
            <div
              key={key}
              className="group bg-muted relative aspect-4/3 max-w-20 overflow-hidden rounded-lg border"
            >
              <img
                src={resolveImageUrl(key, "thumbnail")}
                alt={`Imagen ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => remove(key)}
                disabled={uploading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1 right-1 rounded-full p-1.5 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                aria-label="Eliminar imagen"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-sm">
            No hay imágenes. Hacé clic en Subir imágenes para agregar.
          </p>
        </div>
      )}
    </div>
  );
}
