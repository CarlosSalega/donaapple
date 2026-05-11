import { Header } from "@/features/home/Header";
import { Footer } from "@/features/home/Footer";
import {
  ButtonLinkPrimary,
  ButtonLinkSecondary,
} from "@/shared/components/ui/button-link";

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <span className="text-text-secondary mb-4 text-sm font-medium">
          404
        </span>

        <h1 className="text-text-primary mb-3 text-2xl font-semibold">
          Página no encontrada
        </h1>

        <p className="text-text-secondary mb-8 max-w-sm">
          La página que buscas ya no existe o nunca existió.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLinkPrimary href="/">Volver al inicio</ButtonLinkPrimary>
          <ButtonLinkSecondary href="/catalogo">
            Ver catálogo
          </ButtonLinkSecondary>
        </div>
      </div>

      <Footer />
    </main>
  );
}
