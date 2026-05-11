export const SITE_CONFIG = {
  // Banner
  bannerEnabled: false,
  bannerMessages: JSON.stringify([
    "Nuevos ingresos de iPhone 16 Pro",
    "Mejoramos cualquier presupuesto",
    "Envío en 24-48hs a todo el país",
  ]),

  // Hero
  heroTitle: "Somos Donaapple",
  heroSubtitle: "Tu tienda Apple en Mercedes",
  heroDescription:
    "Equipos Apple nuevos y usados seleccionados.\n¿Tenés un equipo viejo? Aprovechá nuestro plan canje.\nEscribinos y te asesoramos al instante.",
  heroCtaPrimary: "Ver catálogo",
  heroCtaSecondary: "Envianos un mensaje",
  heroImages: "[]",

  // Featured
  featuredTitle: "Últimos Ingresos",
  featuredSubtitle: "Nuestros productos destacados",

  // Testimonials
  testimonialsTitle: "Lo que dicen nuestros clientes",
  testimonialsSubtitle: "Miles de personas ya confiaron en nosotros",
  testimonialsInstagramCta: "Seguinos en Instagram",
  testimonialsInstagramUrl: "https://instagram.com/donaapple.ba",

  // Store
  storeName: "Donaapple",
  storeWhatsapp: "+54 9 2324 687617",
  storeAddress: "Calle 25 N° 465, Mercedes, Buenos Aires",
  storeNeighborhood: "Centro",
  storeCity: "Mercedes, Buenos Aires",
  storePhone: "+54 9 2324 687617",
  storeSchedule: "Lunes a viernes: 09:00 - 20:30\nSábado: 09:00 - 13:00",
  storeInstagram: "donaapple.ba",
  storeEmail: "donaapple@gmail.com",
  storeFinancingTitle: "Servicio Técnico",
  storeFinancingSubtitle: "Contamos con servicio técnico especializado",
  storeFeatures: JSON.stringify([
    {
      title: "Garantía",
      description: "Todos nuestros productos incluyen garantía",
    },
    { title: "Envío Rápido", description: "Entregas en 24-48hs" },
    {
      title: "Atención Personal",
      description: "Te ayudamos a elegir el mejor equipo",
    },
    { title: "Precio Justo", description: "Los mejores precios del mercado" },
  ]),

  // Payment
  paymentMethods: JSON.stringify([
    { name: "Efectivo", icon: "💵" },
    { name: "Transferencia", icon: "🏦" },
    { name: "MercadoPago", icon: "📱" },
  ]),

  // CTA
  ctaTitle: "¿No encontrás lo que buscas?",
  ctaSubtitle: "Nosotros te lo conseguimos",
  ctaDescription: "Miles de clientes satisfechos ya confiaron en nosotros.",
  ctaButtonText: "Escribinos",
  ctaBadge1: "Garantía incluida",
  ctaBadge2: "Envío en 24-48hs",
  ctaBadge3: "+1000 clientes",

  // SEO
  seoTitle: "Donaapple | iPhones y Productos Apple en Mercedes, Buenos Aires",
  seoDescription:
    "iPhone, iPad, Mac, Watch, Macbook y accesorios Apple nuevos y usados con garantía.",

  // Footer
  footerBrand: "Donaapple",
  footerText: "Tu mejor opción en iPhones nuevos y usados con garantía.",
} as const;
