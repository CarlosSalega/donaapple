import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "@/shared/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://store-demo-arg.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Donaapple | Productos Apple, Reparaciones y Plan Canje en Mercedes, Buenos Aires",
  description:
    "iPhones, iPads, Macs y accesorios Apple nuevos y usados con garantía en Mercedes, Buenos Aires. Reparaciones profesionales y plan canje: entregá tu equipo usado como parte de pago. ¡Escribinos por WhatsApp!",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title:
      "Donaapple — Productos Apple, Reparaciones y Plan Canje en Mercedes, Buenos Aires",
    description:
      "Venta de productos Apple nuevos y usados con garantía real. Reparaciones profesionales y plan canje. Comprá seguro en Mercedes, Buenos Aires.",
    url: SITE_URL,
    siteName: "Donaapple",
    images: [
      {
        url: `${SITE_URL}/preview.webp`,
        width: 1200,
        height: 630,
        alt: "Donaapple - Productos Apple, reparaciones y plan canje en Mercedes, Buenos Aires",
      },
    ],
    locale: "es_AR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Donaapple — Productos Apple, Reparaciones y Plan Canje en Mercedes, Buenos Aires",
    description:
      "iPhones, iPads, Macs nuevos y usados con garantía. Reparaciones y plan canje en Mercedes, Buenos Aires. Consultá por WhatsApp.",
    images: [`${SITE_URL}/preview.webp`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["MobilePhoneStore", "ElectronicsStore", "RepairShop"],
  name: "Donaapple",
  description:
    "Venta de productos Apple nuevos y usados, reparaciones profesionales y plan canje en Mercedes, Buenos Aires",
  url: SITE_URL,
  telephone: "+54-9-2324-687617",
  email: "donaapplemercedes@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 25 N° 465",
    addressLocality: "Mercedes",
    addressRegion: "Buenos Aires",
    postalCode: "B6600",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-34.652513",
    longitude: "-59.4306889",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
  priceRange: "$$",
  image: `${SITE_URL}/preview.webp`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios Donaapple",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "iPhones nuevos y usados",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "iPads y Macs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Reparaciones Apple",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Plan canje",
          description:
            "Entregá tu equipo Apple usado como parte de pago por uno nuevo",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
