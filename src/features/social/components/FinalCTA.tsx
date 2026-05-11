"use client";

import { useEffect, useState } from "react";
import { LandingSection } from "@/shared/components/ui/LandingSection";
import {
  ButtonGroup,
  ButtonLinkInverse,
  ButtonLinkWhatsApp,
} from "@/shared/components/ui/button-link";
import { cn } from "@/shared/lib/utils";
import { useScrollReveal } from "@/shared/hooks/useScrollReveal";

interface FinalCTAProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  badges?: string[];
  id?: string;
}

const DEFAULT_WHATSAPP = "+5492324687617";

export function FinalCTA({
  className,
  title = "Encontrá tu próximo iPhone hoy",
  subtitle = "Nosotros te lo trabajamos",
  description = "Miles de clientes satisfechos ya confiaron en nosotros. Unite al grupo y recibí atención personalizada por WhatsApp.",
  buttonText = "Escribinos",
  badges = ["Garantía incluida", "Envío en 24-48hs", "+500 clientes"],
  id,
}: FinalCTAProps) {
  const waHref = `https://wa.me/${DEFAULT_WHATSAPP.replace(/\D/g, "")}`;
  const [mounted, setMounted] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollReveal();

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LandingSection
      ref={sectionRef}
      id={id}
      className={className}
      innerClassName="from-brand to-brand-hover relative overflow-hidden rounded-3xl bg-linear-to-br px-4 py-8 md:p-12"
    >
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <h2
          className={cn(
            "mb-2 text-3xl font-bold text-white transition-all duration-700 md:text-4xl",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <h3
            className={cn(
              "mb-4 text-xl font-bold text-white/90 transition-all duration-700 delay-150 md:text-2xl",
              mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {subtitle}
          </h3>
        )}
        <p
          className={cn(
            "mb-8 max-w-xl text-lg text-white/80 transition-all duration-700 delay-300",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {description}
        </p>

        <div
          className={cn(
            "transition-all duration-700 delay-500",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <ButtonGroup>
            <ButtonLinkInverse href="/catalogo">Ver catálogo</ButtonLinkInverse>
            <ButtonLinkWhatsApp href={waHref}>{buttonText}</ButtonLinkWhatsApp>
          </ButtonGroup>
        </div>

        {/* Trust badges */}
        <div
          className={cn(
            "mt-8 flex flex-wrap items-center justify-center gap-6 text-white/60 transition-all duration-700 delay-700",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              {index === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              )}
              {index === 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
              {index === 2 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  );
}
