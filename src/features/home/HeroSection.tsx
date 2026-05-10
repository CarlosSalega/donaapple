"use client";

import {
  ButtonGroup,
  ButtonLinkPrimary,
  ButtonLinkSecondary,
} from "@/shared/components/ui/button-link";
import { WhatsAppIcon } from "@/shared/components/ui";
import { useEffect, useState } from "react";
import Image from "next/image";
import { resolveImageUrl } from "@/features/images/lib/resolve-image-url";

const INTERVAL = 5000;

interface HeroSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  images?: string[];
}

const DEFAULT_IMAGES = [
  "/images/banners/banner-hero-01.webp",
  "/images/banners/banner-hero-02.png",
  "/images/banners/banner-hero-03.webp",
];

export function HeroSection({
  subtitle = "Tu tienda Apple en Mercedes, Buenos Aires",
  title = "Encontrá tu iPhone, iPad o Mac con garantía",
  description = "Equipos Apple nuevos y usados seleccionados.\n¿Tenés un equipo viejo? Aprovechá nuestro plan canje.\nEscribinos y te asesoramos al instante.",
  ctaPrimary = "Ver catálogo",
  ctaSecondary = "Envianos un mensaje",
  images = DEFAULT_IMAGES,
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [images]);

  const currentBanner = images[currentIndex];
  const bannerUrl = resolveImageUrl(currentBanner, "banner", "heroRaw");
  const bannerSizes = "100vw";

  const descriptionLines = description.split("\n");

  return (
    <section className="bg-surface overflow-hidden px-4 py-8 md:px-16 md:py-12 lg:px-24 lg:py-16">
      {/* Banner — aspect-ratio 16:9 + cover para hero inmersivo */}
      <div className="mx-auto max-w-7xl">
        {/* Banner */}
        <div className="relative aspect-21/9 overflow-hidden rounded-3xl border bg-transparent">
          <Image
            src={bannerUrl}
            alt={`Banner promocional ${currentIndex + 1}`}
            className="size-full object-cover object-center"
            width={1600}
            height={900}
            sizes={bannerSizes}
            loading="eager"
          />
        </div>

        {/* Dots fuera de la imagen */}
        <div className="flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ver banner ${index + 1}`}
              aria-current={index === currentIndex}
              className="group flex h-10 w-10 items-center justify-center active:scale-95"
            >
              <span
                className={`group-hover:bg-muted-foreground/50 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-brand h-2 w-6"
                    : "bg-muted-foreground/30 size-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center pt-8 text-center lg:pt-16">
        <span className="bg-brand/10 text-brand mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium md:text-sm">
          {subtitle}
        </span>

        <h1 className="text-text-primary mb-6 max-w-5xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="text-text-secondary mb-8 max-w-xl text-lg md:text-xl">
          {descriptionLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < descriptionLines.length - 1 && <br />}
            </span>
          ))}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonGroup>
            <ButtonLinkPrimary href="/catalogo">{ctaPrimary}</ButtonLinkPrimary>

            <ButtonLinkSecondary
              href="https://wa.me/5492324687617"
              icon={<WhatsAppIcon className="size-5" />}
            >
              {ctaSecondary}
            </ButtonLinkSecondary>
          </ButtonGroup>
        </div>
      </div>
    </section>
  );
}
