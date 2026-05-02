import { Container } from "@/shared/components/ui/Container";
import { HeroSection, FeaturedProductsSection, Footer } from "@/features/home";
import { TestimonialsSection } from "@/features/social/components/TestimonialsSection";
import { FinalCTA } from "@/features/social/components/FinalCTA";
import { StoreInfoSection } from "@/features/store/components/StoreInfoSection";
import { Header } from "@/features/home/Header";
import { UrgencyBanner } from "@/features/home/UrgencyBanner";

export default function Home() {
  return (
    <>
      <UrgencyBanner message="Nuevos ingresos de iPhone 16 Pro – Stock limitado" />
      <Header />
      <main className="bg-background min-h-screen">
        <HeroSection />

        <FeaturedProductsSection />

        <section className="bg-surface">
          <Container>
            <TestimonialsSection />
          </Container>
        </section>

        <StoreInfoSection />

        <FinalCTA />

        <Footer />
      </main>
    </>
  );
}
