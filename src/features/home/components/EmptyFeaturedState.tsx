import { ButtonLinkPrimary } from "@/shared/components/ui/button-link";

interface EmptyFeaturedStateProps {
  className?: string;
}

export function EmptyFeaturedState({ className }: EmptyFeaturedStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ""}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-text-secondary"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <h3 className="text-text-primary mb-2 text-lg font-semibold">
        Todavía no hay productos destacados
      </h3>

      <p className="text-text-secondary mb-6 max-w-sm text-sm">
        Marcá productos como destacados desde el panel de administración para
        que aparezcan aquí.
      </p>

      <ButtonLinkPrimary href="/admin/productos">
        Gestionar productos
      </ButtonLinkPrimary>
    </div>
  );
}