import { Suspense } from "react";
import { HeroSection, FeaturedSection } from "@/features/home";
import { TestimonialsSection } from "@/features/social/components/TestimonialsSection";
import { FinalCTA } from "@/features/social/components/FinalCTA";
import { StoreInfoSection } from "@/features/store/components/StoreInfoSection";
import { getSiteConfig } from "@/server/actions/config/siteConfig";
import { PlanCanje } from "@/features/canje/components/PlanCanje";
import { ScrollHandler } from "./scroll-handler";

function ScrollHandlerFallback() {
  return null;
}

export default async function Home() {
  const config = await getSiteConfig();

  const heroImages =
    config.heroImages && config.heroImages !== "[]"
      ? JSON.parse(config.heroImages)
      : undefined;

  const storeFeatures =
    config.storeFeatures && config.storeFeatures !== "[]"
      ? JSON.parse(config.storeFeatures)
      : [
          {
            title: "Garantía",
            description: "Todos nuestros productos incluyen garantía",
            icon: "✅",
          },
          {
            title: "Envío Rápido",
            description: "Entregas en 24-48hs en CABA",
            icon: "🚚",
          },
          {
            title: "Atención Personal",
            description: "Te ayudamos a elegir el mejor equipo",
            icon: "💬",
          },
          {
            title: "Precio Justo",
            description: "Los mejores precios del mercado",
            icon: "💰",
          },
        ];

  const paymentMethods =
    config.paymentMethods && config.paymentMethods !== "[]"
      ? JSON.parse(config.paymentMethods)
      : [
          { name: "Efectivo", icon: "💵" },
          { name: "Transferencia", icon: "🏦" },
          { name: "Tarjeta Débito", icon: "💳" },
          { name: "Mercado Pago", icon: "📱" },
          { name: "Cuotas", icon: "📆" },
        ];

  const ctaBadges = [
    config.ctaBadge1 || "Garantía incluida",
    config.ctaBadge2 || "Envío en 24-48hs",
    config.ctaBadge3 || "+500 clientes",
  ];

  const heroProps = {
    subtitle:
      config.heroSubtitle || "Tu tienda Apple en Mercedes, Buenos Aires",
    title: config.heroTitle || "Encontrá tu iPhone, iPad o Mac con garantía",
    description:
      config.heroDescription ||
      "Equipos Apple nuevos y usados seleccionados.\n¿Tenés un equipo viejo? Aprovechá nuestro plan canje.\nEscribinos y te asesoramos al instante.",
    ctaPrimary: config.heroCtaPrimary || "Ver catálogo",
    ctaSecondary: config.heroCtaSecondary || "Envianos un mensaje",
    images: heroImages,
  };

  const storeInfo = {
    name: config.storeName || "Apple Store Demo",
    address: config.storeAddress || "Av. Corrientes 1234",
    neighborhood: config.storeNeighborhood || "Microcentro",
    city: config.storeCity || "Buenos Aires, Argentina",
    hours: {
      weekdays:
        config.storeSchedule?.split("\n")[0]?.replace(":", "") ||
        "9:00 - 19:00",
      saturday: "10:00 - 15:00",
      sunday: "Cerrado",
    },
    phone: config.storePhone || "+54 11 5555-1234",
    whatsapp: config.storeWhatsapp || "+54 9 11 5555-1234",
    email: config.storeEmail || "hola@applestore.demo",
    features: storeFeatures,
    financing: {
      title: config.storeFinancingTitle || "¡Financiación disponible!",
      subtitle:
        config.storeFinancingSubtitle ||
        "Cuotas sin interés con tarjeta de crédito",
    },
  };

  const testimonialsProps = {
    title: config.testimonialsTitle || "Lo que dicen nuestros clientes",
    subtitle:
      config.testimonialsSubtitle ||
      "Miles de personas ya confiaron en nosotros",
    ratingText: config.testimonialsRatingText || "4.9/5 basado en +500 ventas",
    instagramCta: config.testimonialsInstagramCta || "Seguinos en Instagram",
    instagramUrl:
      config.testimonialsInstagramUrl || "https://instagram.com/donaapple",
  };

  const ctaProps = {
    title: config.ctaTitle || "Encontrá tu próximo iPhone hoy",
    subtitle: config.ctaSubtitle || "Nosotros te lo trabajamos",
    description:
      config.ctaDescription ||
      "Miles de clientes satisfechos ya confiaron en nosotros. Unite al grupo y recibí atención personalizada por WhatsApp.",
    buttonText: config.ctaButtonText || "Escribinos por WhatsApp",
    badges: ctaBadges,
  };

  return (
    <main className="bg-background min-h-screen">
      <Suspense fallback={<ScrollHandlerFallback />}>
        <ScrollHandler />
      </Suspense>
      
      <HeroSection id="inicio" {...heroProps} />

      <FeaturedSection
        id="productos"
        title={config.featuredTitle || "Productos Destacados"}
        subtitle={config.featuredSubtitle}
      />

      <PlanCanje id="canje" whatsappNumber={storeInfo.whatsapp} />

      <TestimonialsSection id="testimonios" {...testimonialsProps} />

      <StoreInfoSection id="tienda" storeInfo={storeInfo} paymentMethods={paymentMethods} />

      <FinalCTA id="contacto" {...ctaProps} />
    </main>
  );
}