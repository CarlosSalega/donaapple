import { STORE_INFO } from "@/features/store/data/store-info";
import { Container } from "@/shared/components/ui/Container";
import {
  ButtonGroup,
  ButtonLinkInverse,
  ButtonLinkWhatsApp,
} from "@/shared/components/ui/button-link";
import { cn } from "@/shared/lib/utils";

interface FinalCTAProps {
  className?: string;
}

export function FinalCTA({ className }: FinalCTAProps) {
  const waHref = `https://wa.me/${STORE_INFO.whatsapp.replace(/\D/g, "")}`;

  return (
    <section className={cn("py-20", className)}>
      <Container>
        <div className="from-brand to-brand-hover relative overflow-hidden rounded-3xl bg-linear-to-br px-4 py-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <span className="mb-4 text-5xl">📱</span>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Encontrá tu próximo iPhone hoy
            </h2>
            <p className="mb-8 max-w-xl text-lg text-white/80">
              Miles de clientes satisfechos ya confiaron en nosotros. Unite al
              grupo y recibí atención personalizada por WhatsApp.
            </p>

            <ButtonGroup>
              <ButtonLinkInverse href="/catalogo">
                Ver catálogo
              </ButtonLinkInverse>
              <ButtonLinkWhatsApp href={waHref}>Escribinos</ButtonLinkWhatsApp>
            </ButtonGroup>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/60">
              <div className="flex items-center gap-2">
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
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <span className="text-sm">Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2">
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
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <span className="text-sm">Envío en 24-48hs</span>
              </div>
              <div className="flex items-center gap-2">
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
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-sm">+500 clientes</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
