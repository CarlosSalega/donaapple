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

export async function TestimonialsSection({
  className,
  title = "Lo que dicen nuestros clientes",
  subtitle = "Miles de personas ya confiaron en nosotros",
  instagramCta = "Seguinos en Instagram",
  instagramUrl = "https://instagram.com",
  id,
}: TestimonialsSectionProps) {
  const dbTestimonials = await getTestimonialsFromDB();
  const testimonials =
    dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS;

  return (
    <section
      id={id}
      className={cn(
        "bg-surface overflow-hidden px-4 py-8 md:px-16 md:py-12 lg:px-24 lg:py-16",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-text-primary mb-2 text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          <p className="text-text-secondary mb-8">{subtitle}</p>
        </div>
      </div>

      <TestimonialsSlider
        testimonials={testimonials}
        instagramCta={instagramCta}
        instagramUrl={instagramUrl}
      />
    </section>
  );
}
