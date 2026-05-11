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
} from "lucide-react";

interface StoreFeature {
  title: string;
  description: string;
  icon: string;
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
      icon: "shield-check",
    },
    {
      title: "Envío Rápido",
      description: "Entregas en 24-48hs",
      icon: "truck",
    },
    {
      title: "Atención Personal",
      description: "Te ayudamos a elegir el mejor equipo",
      icon: "message-circle",
    },
    {
      title: "Precio Justo",
      description: "Los mejores precios del mercado",
      icon: "dollar-sign",
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
  switch (title) {
    case "Garantía":
      return <ShieldCheck className="text-brand" size={24} />;
    case "Envío Rápido":
      return <Truck className="text-brand" size={24} />;
    case "Atención Personal":
      return <MessageCircle className="text-brand" size={24} />;
    case "Precio Justo":
      return <DollarSign className="text-brand" size={24} />;
    default:
      return <ShieldCheck className="text-brand" size={24} />;
  }
}

function getPaymentIcon(icon: string) {
  // Si es un emoji (contiene caracteres más alla de ASCII básico), mostrarlo directamente
  const isEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(icon) || 
    ["💵", "🏦", "💳", "📱", "📆", "💰", "🔄", "🏧"].includes(icon);
  
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

export function StoreInfoSection({
  storeInfo = DEFAULT_STORE_INFO,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
  id,
}: StoreInfoSectionProps) {
  const { address, neighborhood, city, hours, features, financing } = storeInfo;

  return (
    <LandingSection id={id}>
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-text-primary mb-2 text-2xl font-bold md:text-3xl">
          Información de la tienda
        </h2>
        <p className="text-text-secondary">
          Visitanos o contactanos por WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left - Info */}
        <div className="space-y-6">
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
        <div className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Financing */}
          <div className="border-brand/30 bg-brand/5 rounded-2xl border-2 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="text-brand" size={32} />
              <div>
                <h3 className="text-text-primary font-semibold">
                  {financing.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {financing.subtitle}
                </p>
              </div>
            </div>
            <ul className="text-text-secondary space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="text-success" size={16} />
                3, 6 y 12 cuotas sin interés
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-success" size={16} />
                Anticipo desde el 30%
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-success" size={16} />
                Aprobación en el día
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
