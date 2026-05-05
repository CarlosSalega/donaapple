/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         LANDING CONTENT                                        ║
 * ║              Contenido configurable de la landing page                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Este archivo contiene los valores por defecto para el SiteConfig y los testimonios.
 * Los textos son editables desde el panel de administración.
 * Las imágenes por defecto son placeholders locales; el admin puede cargar imágenes de Cloudinary.
 */

export const LANDING_CONTENT = {
  banner: {
    enabled: true,
    emoji: "🔥",
    message: "Nuevos ingresos de iPhone 16 Pro – Stock limitado",
  },

  hero: {
    subtitle: "Tu tienda Apple en Mercedes, Buenos Aires",
    title: "Encontrá tu iPhone, iPad o Mac con garantía",
    description:
      "Equipos Apple nuevos y usados seleccionados.\n¿Tenés un equipo viejo? Aprovechá nuestro plan canje.\nEscribinos y te asesoramos al instante.",
    ctaPrimary: "Ver catálogo",
    ctaSecondary: "Envianos un mensaje",
    // Placeholder por defecto - el admin puede cargar imágenes de Cloudinary
    images: ["/images/placeholder.webp", "/images/placeholder.webp"],
  },

  featured: {
    title: "Últimos Ingresos",
    subtitle: "Los productos más recientes agregados al catálogo",
  },

  testimonials: {
    sectionTitle: "Lo que dicen nuestros clientes",
    sectionSubtitle: "Miles de personas ya confiaron en nosotros",
    ratingText: "4.9/5 basado en +500 ventas",
    instagramCta: "Seguinos en Instagram",
    instagramUrl: "https://instagram.com/donaapple",
  },

  store: {
    sectionTitle: "Información de la tienda",
    sectionSubtitle: "Visitanos o contactanos por WhatsApp",
    name: "Donaapple",
    address: "Calle 25 N° 465",
    neighborhood: "Centro",
    city: "Mercedes, Buenos Aires",
    phone: "+54 9 2324 687617",
    whatsapp: "+54 9 2324 687617",
    email: "donaapplemercedes@gmail.com",
    instagram: "donaapple",
    schedule: {
      weekdays: "09:00 - 20:30",
      saturday: "09:00 - 13:00",
      sunday: "Cerrado",
    },
    features: [
      {
        title: "Garantía",
        description: "Todos nuestros productos incluyen garantía",
        icon: "✅",
      },
      {
        title: "Envío Rápido",
        description: "Entregas en 24-48hs",
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
    ],
    financing: {
      title: "¡Financiación disponible!",
      subtitle: "Cuotas sin interés con tarjeta de crédito",
    },
  },

  finalCta: {
    title: "Encontrá tu próximo iPhone hoy",
    description:
      "Miles de clientes satisfechos ya confiaron en nosotros. Unite al grupo y recibí atención personalizada por WhatsApp.",
    buttonPrimary: "Ver catálogo",
    buttonSecondary: "Escribinos",
    badges: ["Garantía incluida", "Envío en 24-48hs", "+500 clientes"],
  },

  footer: {
    brand: "Donaapple",
    description:
      "Tu mejor opción en iPhones nuevos y usados con garantía.",
    links: [
      { label: "Catálogo", href: "/catalogo" },
      { label: "Contacto", href: "/" },
      { label: "Términos", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },

  seo: {
    title: "Donaapple | iPhones y Productos Apple en Mercedes, Buenos Aires",
    description:
      "iPhones, iPads, Macs y accesorios Apple nuevos y usados con garantía. Reparaciones profesionales y plan canje.",
  },
};

export interface LandingTestimonial {
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product?: string;
  date?: string;
}

export const DEFAULT_TESTIMONIALS: LandingTestimonial[] = [
  {
    name: "María González",
    avatar: "MG",
    rating: 5,
    text: "Compré un iPhone 15 Pro reacondicionado y llegó impecable. La batería al 95% y sin un solo rayón. El envío fue rapidísimo.",
    product: "iPhone 15 Pro 256GB",
    date: "Hace 2 semanas",
  },
  {
    name: "Javier Pérez",
    avatar: "JP",
    rating: 5,
    text: "La atención por WhatsApp es increíble. Me ayudaron a elegir el modelo perfecto para mi presupuesto. 100% recomendado.",
    product: "iPhone 14 Pro",
    date: "Hace 1 mes",
  },
  {
    name: "Sofia Rodríguez",
    avatar: "SR",
    rating: 5,
    text: "Tercera compra aquí y siempre todo perfecto. El último fue un iPhone 13 para mi vieja, ¡le encantó!",
    product: "iPhone 13",
    date: "Hace 3 semanas",
  },
  {
    name: "Lucas Martín",
    avatar: "LM",
    rating: 5,
    text: "Tenía mis dudas por ser reacondicionado pero superó mis expectativas. Precio justo y garantía de 6 meses.",
    product: "iPhone 14",
    date: "Hace 1 semana",
  },
  {
    name: "Camila Torres",
    avatar: "CT",
    rating: 5,
    text: "Me contactedaron al toque cuando hice la consulta. El iPhone llegó el mismo día en Capital Federal. Increíble servicio.",
    product: "iPhone 16",
    date: "Hace 5 días",
  },
  {
    name: "Federico Lima",
    avatar: "FL",
    rating: 5,
    text: "Comparando precios son los mejores del mercado. Me dieron financiación sin drama. El producto llegó exactamente como decían.",
    product: "iPhone 15",
    date: "Hace 2 semanas",
  },
];