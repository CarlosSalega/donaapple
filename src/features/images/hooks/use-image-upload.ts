/**
 * ╔══════════════════════════════════════════╗
 * ║   IMAGES FEATURE — useImageUpload HOOK   ║
 * ╚══════════════════════════════════════════╝
 *
 * Extrae toda la lógica del componente ImageUpload.
 * Puede usarse independientemente si necesitás
 * construir tu propio UI de upload.
 *
 * USO:
 *   const { upload, remove, uploading, progress } = useImageUpload({ value, onChange })
 */

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

import { validateFiles } from "../lib/validate-upload";
import { UPLOAD_LIMITS } from "../config";

interface UseImageUploadOptions {
  value: string[];
  onChange: (value: string[]) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

interface UseImageUploadReturn {
  uploading: boolean;
  progress: number; // 0-100
  upload: (files: File[]) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

export function useImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
}: UseImageUploadOptions): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      // Validar antes de hacer cualquier request
      const validation = validateFiles(files, value.length);
      if (!validation.valid) {
        validation.errors.forEach((e) => toast.error(e.message));
        return;
      }

      setUploading(true);
      setProgress(0);
      onUploadStart?.();

      try {
        let completed = 0;

        const uploadedKeys = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
              throw new Error(data.error ?? "Error al subir imagen");
            }

            completed++;
            setProgress(Math.round((completed / files.length) * 100));

            return data.key as string;
          }),
        );

        onChange([...value, ...uploadedKeys]);
        toast.success(
          uploadedKeys.length === 1
            ? "Imagen subida"
            : `${uploadedKeys.length} imágenes subidas`,
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al subir imágenes",
        );
      } finally {
        setUploading(false);
        setProgress(0);
        onUploadEnd?.();
      }
    },
    [value, onChange, onUploadStart, onUploadEnd],
  );

  const remove = useCallback(
    async (key: string) => {
      // Optimistic update
      const previous = value;
      onChange(value.filter((k) => k !== key));

      try {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });

        if (!res.ok) {
          onChange(previous); // rollback
          const data = await res.json().catch(() => ({}));
          toast.error(data.error ?? "Error al eliminar la imagen");
        }
      } catch {
        onChange(previous); // rollback
        toast.error("Error de conexión");
      }
    },
    [value, onChange],
  );

  return { uploading, progress, upload, remove };
}
