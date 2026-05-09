import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils";

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
  ],
  financing: {
    title: "¡Financiación disponible!",
    subtitle: "Cuotas sin interés con tarjeta de crédito",
  },
};

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { name: "Efectivo", icon: "💵" },
  { name: "Transferencia", icon: "🏦" },
  { name: "Tarjeta Débito", icon: "💳" },
  { name: "Mercado Pago", icon: "📱" },
  { name: "Cuotas", icon: "📆" },
];

export function StoreInfoSection({
  className,
  storeInfo = DEFAULT_STORE_INFO,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
}: StoreInfoSectionProps) {
  const {
    address,
    neighborhood,
    city,
    hours,
    phone,
    whatsapp,
    features,
    financing,
  } = storeInfo;

  return (
    <section className={cn("bg-surface py-16", className)}>
      <Container>
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
                  <span className="text-text-primary font-medium">
                    Sábados:
                  </span>{" "}
                  {hours.saturday}
                </p>
                <p>
                  <span className="text-text-primary font-medium">
                    Domingos:
                  </span>{" "}
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
                    <span>{method.icon}</span>
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
                  <span className="mb-2 block text-2xl">{feature.icon}</span>
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
                <span className="text-3xl">💳</span>
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
                  <span className="text-success">✓</span>
                  3, 6 y 12 cuotas sin interés
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  Anticipo desde el 30%
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  Aprobación en el día
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
