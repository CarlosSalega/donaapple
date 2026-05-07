import { TESTIMONIALS } from "@/features/social/data/testimonials";
import { TestimonialsSlider } from "./TestimonialsSlider";
import { prisma } from "@/shared/lib/prisma";
import { cn } from "@/shared/lib/utils";

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

export async function TestimonialsSection({ 
  className,
  title = "Lo que dicen nuestros clientes",
  subtitle = "Miles de personas ya confiaron en nosotros",
  ratingText = "4.9/5 basado en +500 ventas",
  instagramCta = "Seguinos en Instagram",
  instagramUrl = "https://instagram.com",
}: TestimonialsSectionProps) {
  const dbTestimonials = await getTestimonialsFromDB();
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS;

  return (
    <section className={cn("bg-surface", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-24">
        <div className="mb-10 text-center pt-8">
          <h2 className="text-text-primary mb-2 text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          <p className="text-text-secondary">
            {subtitle}
          </p>
        </div>
      </div>

      <TestimonialsSlider
        testimonials={testimonials}
        ratingText={ratingText}
        instagramCta={instagramCta}
        instagramUrl={instagramUrl}
      />
    </section>
  );
}