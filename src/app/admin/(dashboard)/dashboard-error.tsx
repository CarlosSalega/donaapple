"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface DashboardErrorProps {
  message: string;
}

export function DashboardError({ message }: DashboardErrorProps) {
  useEffect(() => {
    toast.error("Error de conexión", {
      description: message,
      duration: 8000,
    });
  }, [message]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-sm">
          No se pudieron cargar las estadísticas del dashboard.
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Verificá que la base de datos esté activa.
        </p>
      </div>
    </div>
  );
}