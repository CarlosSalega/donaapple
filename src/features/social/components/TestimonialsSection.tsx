"use client";

import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/features/social/data/testimonials";
import { TestimonialsSlider } from "./TestimonialsSlider";
import { prisma } from "@/shared/lib/prisma";
import { cn } from "@/shared/lib/utils";
import { useScrollReveal } from "@/shared/hooks/useScrollReveal";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  date: string;
}

interface TestimonialsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  ratingText?: string;
  instagramCta?: string;
  instagramUrl?: string;
  id?: string;
}

async function getTestimonialsFromDB(): Promise<Testimonial[]> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      rating: t.rating,
      text: t.text,
      product: t.product || undefined,
      date: t.date || "Hace poco",
    }));
  } catch {
    return [];
  }
}

export function TestimonialsSection({
  className,
  title = "Lo que dicen nuestros clientes",
  subtitle = "Miles de personas ya confiaron en nosotros",
  instagramCta = "Seguinos en Instagram",
  instagramUrl = "https://instagram.com",
  id,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [mounted, setMounted] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollReveal();

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    getTestimonialsFromDB().then((data) => {
      if (data.length > 0) {
        setTestimonials(data);
      }
    });
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "bg-surface overflow-hidden px-4 py-8 md:px-16 md:py-12 lg:px-24 lg:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2
            className={cn(
              "text-text-primary mb-2 text-2xl font-bold transition-all duration-700 md:text-3xl",
              mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "text-text-secondary mb-8 transition-all duration-700 delay-150",
              mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-700 delay-300",
          mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <TestimonialsSlider
          testimonials={testimonials}
          instagramCta={instagramCta}
          instagramUrl={instagramUrl}
        />
      </div>
    </section>
  );
}
