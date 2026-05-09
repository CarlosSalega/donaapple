"use client";

import { Button } from "@/shared/components/ui/button";

interface SubmitButtonProps {
  submitting: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
}

export function SubmitButton({
  submitting,
  label = "Guardar cambios",
  loadingLabel = "Guardando...",
  className,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={submitting} className={className}>
      {submitting ? loadingLabel : label}
    </Button>
  );
}