"use client";

import { useEffect, useState } from "react";
import { LandingSection } from "@/shared/components/ui/LandingSection";
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  DollarSign,
  Banknote,
  Building2,
  CreditCard,
  Smartphone,
  Calendar,
  Check,
  Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/shared/hooks/useScrollReveal";

interface StoreFeature {
  title: string;
  description: string;
}

interface StoreHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

interface StoreInfo {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  hours: StoreHours;
  phone: string;
  whatsapp: string;
  email: string;
  features: StoreFeature[];
  financing: {
    title: string;
    subtitle: string;
  };
}

interface PaymentMethod {
  name: string;
  icon: string;
}

interface StoreInfoSectionProps {
  className?: string;
  storeInfo?: StoreInfo;
  paymentMethods?: PaymentMethod[];
  id?: string;
}

const DEFAULT_STORE_INFO: StoreInfo = {
  name: "Apple Store Demo",
  address: "Av. Corrientes 1234",
  neighborhood: "Microcentro",
  city: "Buenos Aires, Argentina",
  hours: {
    weekdays: "9:00 - 19:00",
    saturday: "10:00 - 15:00",
    sunday: "Cerrado",
  },
  phone: "+54 11 5555-1234",
  whatsapp: "+54 9 11 5555-1234",
  email: "hola@applestore.demo",
  features: [
    {
      title: "Garantía",
      description: "Todos nuestros productos incluyen garantía",
    },
    {
      title: "Envío Rápido",
      description: "Entregas en 24-48hs",
    },
    {
      title: "Atención Personal",
      description: "Te ayudamos a elegir el mejor equipo",
    },
    {
      title: "Precio Justo",
      description: "Los mejores precios del mercado",
    },
    {
      title: "Servicio Técnico",
      description: "Contamos con servicio técnico especializado para iPhone",
    },
  ],
  financing: {
    title: "¡Financiación disponible!",
    subtitle: "Cuotas sin interés con tarjeta de crédito",
  },
};

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Efectivo", icon: "banknote" },
  { name: "Transferencia", icon: "building" },
  { name: "Tarjeta Débito", icon: "credit-card" },
  { name: "Mercado Pago", icon: "smartphone" },
  { name: "Cuotas", icon: "calendar" },
];

function getFeatureIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("garantía") || t.includes("garantia")) {
    return <ShieldCheck className="text-brand" size={24} />;
  }
  if (t.includes("envío") || t.includes("envio") || t.includes("envíos")) {
    return <Truck className="text-brand" size={24} />;
  }
  if (
    t.includes("atención") ||
    t.includes("atencion") ||
    t.includes("personal")
  ) {
    return <MessageCircle className="text-brand" size={24} />;
  }
  if (t.includes("precio") || t.includes("precio")) {
    return <DollarSign className="text-brand" size={24} />;
  }
  if (
    t.includes("servicio") ||
    t.includes("técnico") ||
    t.includes("tecnico") ||
    t.includes("reparación") ||
    t.includes("reparacion")
  ) {
    return <Wrench className="text-brand" size={24} />;
  }
  return <Check className="text-brand" size={24} />;
}

function getPaymentIcon(icon: string) {
  // Si es un emoji (contiene caracteres más alla de ASCII básico), mostrarlo directamente
  const isEmoji =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
      icon,
    ) || ["💵", "🏦", "💳", "📱", "📆", "💰", "🔄", "🏧"].includes(icon);

  if (isEmoji) {
    return <span className="text-brand text-lg">{icon}</span>;
  }

  // Si es un icono de Lucide (legacy), usar los componentes
  switch (icon) {
    case "banknote":
      return <Banknote size={16} className="text-brand" />;
    case "building":
      return <Building2 size={16} className="text-brand" />;
    case "credit-card":
      return <CreditCard size={16} className="text-brand" />;
    case "smartphone":
      return <Smartphone size={16} className="text-brand" />;
    case "calendar":
      return <Calendar size={16} className="text-brand" />;
    default:
      return <CreditCard size={16} className="text-brand" />;
  }
}

import { cn } from "@/shared/lib/utils";

export function StoreInfoSection({
  storeInfo = DEFAULT_STORE_INFO,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  id,
}: StoreInfoSectionProps) {
  const { address, neighborhood, city, hours, features } = storeInfo;
  const [mounted, setMounted] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollReveal();

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <LandingSection ref={sectionRef} id={id}>
      {/* Header */}
      <div className="mb-10 text-center">
        <h2
          className={cn(
            "text-text-primary mb-2 text-2xl font-bold transition-all duration-700 md:text-3xl",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          Nuestra Información
        </h2>
        <p
          className={cn(
            "text-text-secondary transition-all duration-700 delay-150",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          Visitanos o contactanos por WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left - Info */}
        <div
          className={cn(
            "space-y-6 transition-all duration-700 delay-300",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {/* Location */}
          <div className="border-border bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand/10 flex h-10 w-10 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className="text-text-primary font-semibold">Ubicación</h3>
            </div>
            <p className="text-text-secondary">
              {address}
              <br />
              {neighborhood}, {city}
            </p>
          </div>

          {/* Hours */}
          <div className="border-border bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand/10 flex h-10 w-10 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-text-primary font-semibold">Horarios</h3>
            </div>
            <div className="text-text-secondary space-y-2">
              <p>
                <span className="text-text-primary font-medium">
                  Lunes a Viernes:
                </span>{" "}
                {hours.weekdays}
              </p>
              <p>
                <span className="text-text-primary font-medium">Sábados:</span>{" "}
                {hours.saturday}
              </p>
              <p>
                <span className="text-text-primary font-medium">Domingos:</span>{" "}
                {hours.sunday}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-border bg-card rounded-2xl border p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand/10 flex h-10 w-10 items-center justify-center rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-brand"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-text-primary font-semibold">
                Métodos de pago
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method, index) => (
                <span
                  key={method.name || `payment-${index}`}
                  className="border-border bg-surface-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm"
                >
                  {getPaymentIcon(method.icon)}
                  <span className="text-text-primary">{method.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Features + CTA */}
        <div
          className={cn(
            "space-y-6 transition-all duration-700 delay-500",
            mounted && isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          {/* Features */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border-border bg-card rounded-xl border p-4"
              >
                <span className="mb-2 block">
                  {getFeatureIcon(feature.title)}
                </span>
                <h4 className="text-text-primary mb-1 font-semibold">
                  {feature.title}
                </h4>
                <p className="text-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Servicio Técnico */}
          <div className="border-brand/30 bg-brand/5 rounded-2xl border-2 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Wrench className="text-brand" size={32} />
              <div>
                <h3 className="text-text-primary font-semibold">
                  Servicio Técnico
                </h3>
                <p className="text-text-secondary text-sm">
                  Contamos con servicio técnico especializado para iPhone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
