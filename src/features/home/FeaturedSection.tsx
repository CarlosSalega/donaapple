import { getFeaturedProducts } from "@/server/actions/products/getFeaturedProducts";
import { FeaturedProductsCarousel } from "./components/FeaturedProductsCarousel";
import { EmptyFeaturedState } from "./components/EmptyFeaturedState";
import { LandingSection } from "@/shared/components/ui/LandingSection";

interface FeaturedSectionProps {
  title?: string;
  subtitle?: string;
  id?: string;
}

export async function FeaturedSection({
  title,
  subtitle,
  id,
}: FeaturedSectionProps) {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <LandingSection id={id}>
        <EmptyFeaturedState />
      </LandingSection>
    );
  }

  return (
    <LandingSection id={id}>
      <FeaturedProductsCarousel
        products={products}
        title={title}
        subtitle={subtitle}
      />
    </LandingSection>
  );
}