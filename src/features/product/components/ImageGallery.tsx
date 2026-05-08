"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/features/catalog/types/product";
import { cn } from "@/shared/lib/utils";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ImageGallery({
  images,
  productName,
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-surface flex aspect-square items-center justify-center rounded-2xl">
        <span className="text-4xl">📱</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Main Image */}
      <div className="bg-surface relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={images[selectedIndex].src}
          alt={
            images[selectedIndex].alt ||
            `${productName} - Imagen ${selectedIndex + 1}`
          }
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority={images[selectedIndex].priority}
        />
      </div>

      {/* Thumbnails — v2: object-contain para preservar productos verticales */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "bg-surface relative flex-shrink-0 overflow-hidden rounded-lg border-2 p-1",
                "aspect-square w-20 cursor-pointer transition-all",
                selectedIndex === index
                  ? "border-brand"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} - Miniatura ${index + 1}`}
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
