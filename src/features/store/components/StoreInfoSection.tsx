import { STORE_INFO } from "@/features/store/data/store-info";
import { Container } from "@/shared/components/ui/Container";
import { cn } from "@/shared/lib/utils";

interface StoreInfoSectionProps {
  className?: string;
}

export function StoreInfoSection({ className }: StoreInfoSectionProps) {
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
                {STORE_INFO.address}
                <br />
                {STORE_INFO.neighborhood}, {STORE_INFO.city}
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
                  {STORE_INFO.hours.weekdays}
                </p>
                <p>
                  <span className="text-text-primary font-medium">
                    Sábados:
                  </span>{" "}
                  {STORE_INFO.hours.saturday}
                </p>
                <p>
                  <span className="text-text-primary font-medium">
                    Domingos:
                  </span>{" "}
                  {STORE_INFO.hours.sunday}
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
                {STORE_INFO.paymentMethods.map((method) => (
                  <span
                    key={method.name}
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
              {STORE_INFO.features.map((feature) => (
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
                    ¡Financiación disponible!
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Cuotas sin interés con tarjeta de crédito
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

            {/* Contact CTA */}
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp.replace(/\D/g, "")}?text=Hola!%20Quiero%20saber%20más%20sobre%20sus%20productos`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex w-full items-center justify-center gap-3 rounded-full",
                "bg-[#25D366] py-4 text-lg font-semibold text-white",
                "transition-all hover:scale-[1.02] hover:bg-[#20BD5A]",
                "focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contactar por WhatsApp
            </a>

            {/* Phone */}
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="text-text-secondary hover:text-brand flex items-center justify-center gap-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {STORE_INFO.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
