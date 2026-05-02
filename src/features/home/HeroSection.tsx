"use client";

import {
  ButtonGroup,
  ButtonLinkPrimary,
  ButtonLinkSecondary,
} from "@/shared/components/ui/button-link";
import { WhatsAppIcon } from "@/shared/components/ui";
import { useEffect, useState } from "react";
import Image from "next/image";

const BANNERS = [
  "/images/banners/banner-01.jpg",
  "/images/banners/banner-02.png",
  "/images/banners/banner-03.png",
  "/images/banners/banner-04.jpg",
  "/images/banners/banner-05.jpg",
];

const BANNERS_MOBILE = [
  "/images/banners/banner-mobile-01.jpg",
  "/images/banners/banner-mobile-02.png",
  "/images/banners/banner-mobile-03.png",
  "/images/banners/banner-mobile-04.jpg",
  "/images/banners/banner-mobile-05.jpg",
];

const INTERVAL = 5000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const banners = isMobile ? BANNERS_MOBILE : BANNERS;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [isMobile]);

  const banners = isMobile ? BANNERS_MOBILE : BANNERS;
  const currentBanner = banners[currentIndex];

  return (
    <section className="bg-surface overflow-hidden p-4">
      <div className="border-border relative mx-auto max-h-105 max-w-7xl overflow-hidden rounded-3xl border">
        {/* Imagen como elemento, no como background */}
        <Image
          src={currentBanner}
          alt={`Banner promocional ${currentIndex + 1}`}
          className="aspect-3/2 size-full object-contain lg:aspect-21/9"
          width={1280}
          height={1080}
          loading="eager"
        />

        {/* Dots sobre la imagen */}
        <div className="absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                index === currentIndex
                  ? "bg-foreground w-6"
                  : "border-foreground w-2 border bg-transparent"
              }`}
              aria-label={`Ver banner ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center pt-4 text-center">
        <span className="bg-brand/10 text-brand mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium md:text-sm">
          Tu tienda Apple en Mercedes, Buenos Aires
        </span>

        <h1 className="text-text-primary mb-6 max-w-5xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Encontrá tu iPhone, iPad o Mac con garantía
        </h1>

        <p className="text-text-secondary mb-8 max-w-xl text-lg md:text-xl">
          Equipos Apple nuevos y usados seleccionados.
          <br />
          ¿Tenés un equipo viejo? Aprovechá nuestro plan canje.
          <br />
          Escribinos y te asesoramos al instante.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonGroup>
            <ButtonLinkPrimary href="/catalogo">Ver catálogo</ButtonLinkPrimary>

            <ButtonLinkSecondary
              href="https://wa.me/5492324687617"
              icon={<WhatsAppIcon className="size-5" />}
            >
              Envianos un mensaje
            </ButtonLinkSecondary>
          </ButtonGroup>
        </div>
      </div>
    </section>
  );
}
