/**
 * ╔══════════════════════════════════════════╗
 * ║   IMAGES FEATURE — IMAGE UPLOAD UI       ║
 * ╚══════════════════════════════════════════╝
 *
 * Componente de UI puro — toda la lógica está en useImageUpload.
 *
 * v2: usa aspect-square + object-contain para preservar productos
 * verticales (e-commerce style).
 *
 * v3: drag & drop para reordenar imágenes con @dnd-kit.
 *     El orden en el array define la imagen principal (primera = primary).
 */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader2, GripVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface SortableImageItemProps {
  keyId: string;
  index: number;
  isDragging: boolean;
}

function SortableImageItem({
  keyId,
  index,
  isDragging,
}: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: keyId });

  const {
    remove: _remove,
  } = useImageUpload({ value: [], onChange: () => {} });

  const src = resolveImageUrl(keyId, "product", "thumbnail");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-surface group relative aspect-square overflow-hidden rounded-lg border p-2 transition-shadow ${
        isDragging || isSortableDragging
          ? "ring-2 ring-brand opacity-50"
          : "cursor-grab active:cursor-grabbing"
      }`}
      {...attributes}
      {...listeners}
    >
      <Image
        src={src}
        alt={`Imagen ${index + 1}`}
        fill
        className={`object-contain transition-transform ${
          !isDragging ? "group-hover:scale-105" : ""
        }`}
      />

      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
        <span className="bg-background/80 text-muted-foreground rounded px-1.5 py-0.5 text-xs font-medium">
          {index + 1}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          _remove(keyId);
        }}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-1 right-1 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={`Eliminar imagen ${index + 1}`}
      >
        <X className="size-3.5" />
      </button>

      <div className="bg-muted-foreground/50 absolute top-1 left-1 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="size-3 text-background" />
      </div>
    </div>
  );
}

export function ImageUpload({
  value,
  onChange,
  maxImages = UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, upload, reorder } = useImageUpload({
    value,
    onChange,
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await upload(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      reorder(active.id as string, over.id as string);
    }
  };

  const isDisabled = disabled || uploading;

  const activeSrc = activeId
    ? resolveImageUrl(activeId, "product", "thumbnail")
    : null;

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {value.map((key, index) => (
                <SortableImageItem
                  key={key}
                  keyId={key}
                  index={index}
                  isDragging={key === activeId}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId && activeSrc ? (
              <div className="bg-surface relative aspect-square overflow-hidden rounded-lg border-2 border-brand p-2 shadow-2xl">
                <Image
                  src={activeSrc}
                  alt="Arrastrando imagen"
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="bg-card flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground text-center text-sm">
            No hay imágenes. Hacé clic en Subir imágenes para agregar.
          </p>
        </div>
      )}
    </div>
  );
}