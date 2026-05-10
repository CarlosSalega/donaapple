import { getFeaturedProducts } from "@/server/actions/products/getFeaturedProducts";
import { FeaturedProductsCarousel } from "./components/FeaturedProductsCarousel";
import { EmptyFeaturedState } from "./components/EmptyFeaturedState";
import { LandingSection } from "@/shared/components/ui/LandingSection";

interface FeaturedSectionProps {
  title?: string;
  subtitle?: string;
}

export async function FeaturedSection({
  title,
  subtitle,
}: FeaturedSectionProps) {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <LandingSection>
        <EmptyFeaturedState />
      </LandingSection>
    );
  }

  return (
    <LandingSection>
      <FeaturedProductsCarousel
        products={products}
        title={title}
        subtitle={subtitle}
      />
    </LandingSection>
  );
}