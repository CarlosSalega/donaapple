"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { generateCanjeWhatsAppLink } from "@/features/whatsapp/utils/generateWhatsAppLink";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { WhatsAppIcon } from "@/shared/components/ui/whatsapp-icon";
import { cn } from "@/shared/lib/utils";

// — Constantes —

const TIEMPO_DE_USO_OPTIONS = [
  "Menos de 1 año",
  "1 a 2 años",
  "2 a 3 años",
  "Más de 3 años",
] as const;

const STEPS = [
  {
    number: "1",
    title: "Contanos tu equipo",
    description: "Modelo, estado y batería. Todo por WhatsApp.",
  },
  {
    number: "2",
    title: "Recibís la tasación",
    description: "Te damos el valor del canje en el momento.",
  },
  {
    number: "3",
    title: "Elegís tu nuevo iPhone",
    description: "Aplicás el crédito y pagás solo la diferencia.",
  },
] as const;

const BADGES = ["Sin intermediarios", "Precio justo", "Al instante"] as const;

// — Tipos —

type FormData = {
  modelo: string;
  bateria: string;
  tiempoDeUso: string;
  detalles: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

// — Validación —

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (data.modelo.length < 3) errors.modelo = "Ingresá el modelo de tu iPhone";

  const bateria = Number(data.bateria);
  if (!data.bateria || bateria < 1 || bateria > 100)
    errors.bateria = "El valor debe estar entre 1 y 100";

  if (!data.tiempoDeUso) errors.tiempoDeUso = "Seleccioná el tiempo de uso";

  return errors;
}

function isFormValid(data: FormData): boolean {
  return Object.keys(validateForm(data)).length === 0;
}

// — Subcomponentes —

function StepItem({ number, title, description }: (typeof STEPS)[number]) {
  return (
    <div className="flex gap-4">
      <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-xs">{message}</p>;
}

// — Componente principal —

interface PlanCanjeProps {
  whatsappNumber?: string;
  className?: string;
  id?: string;
}

const INITIAL_FORM: FormData = {
  modelo: "",
  bateria: "",
  tiempoDeUso: "",
  detalles: "",
};

export function PlanCanje({
  whatsappNumber = "5491100000000",
  className,
  id,
}: PlanCanjeProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const url = generateCanjeWhatsAppLink(
      {
        modelo: formData.modelo,
        bateria: Number(formData.bateria),
        tiempoDeUso: formData.tiempoDeUso,
        detalles: formData.detalles,
      },
      whatsappNumber,
    );

    window.open(url, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const valid = isFormValid(formData);

  return (
    <section
      id={id}
      className={cn(
        "bg-surface overflow-hidden px-4 py-8 md:px-16 md:py-12 lg:px-24 lg:py-16",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
        {/* Columna izquierda */}
        <div className="space-y-8">
          <h2 className="text-foreground px-4 text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Tenés un iPhone usado?
          </h2>
          <p className="text-muted-foreground mt-3 px-4 text-lg">
            Lo tasamos al instante y te damos crédito para un iPhone nuevo.
          </p>

          <div className="space-y-5 px-4">
            {STEPS.map((step) => (
              <StepItem key={step.number} {...step} />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 px-4">
            {BADGES.map((badge) => (
              <div
                key={badge}
                className="flex flex-col items-center gap-1 text-sm sm:flex-row"
              >
                <Check className="text-primary size-4" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — Formulario */}
        <Card className="px-4">
          <CardHeader>
            <CardTitle>Calculá tu canje</CardTitle>
            <CardDescription>Respuesta inmediata por WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="modelo">
                  ¿Qué iPhone tenés?
                </label>
                <Input
                  id="modelo"
                  placeholder="ej: iPhone 13 128GB"
                  className="placeholder:text-gray-300"
                  value={formData.modelo}
                  onChange={(e) => handleChange("modelo", e.target.value)}
                  aria-invalid={!!errors.modelo}
                />
                <FieldError message={errors.modelo} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="bateria">
                  Condición de batería (%)
                </label>
                <Input
                  id="bateria"
                  type="number"
                  min={1}
                  max={100}
                  placeholder="ej: 85"
                  className="placeholder:text-gray-300"
                  value={formData.bateria}
                  onChange={(e) => handleChange("bateria", e.target.value)}
                  aria-invalid={!!errors.bateria}
                />
                <FieldError message={errors.bateria} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="tiempoDeUso">
                  Tiempo de uso
                </label>
                <Select
                  onValueChange={(value) => handleChange("tiempoDeUso", value)}
                  value={formData.tiempoDeUso}
                >
                  <SelectTrigger
                    id="tiempoDeUso"
                    aria-invalid={!!errors.tiempoDeUso}
                  >
                    <SelectValue placeholder="Seleccioná una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIEMPO_DE_USO_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.tiempoDeUso} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="detalles">
                  Detalles adicionales{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </label>
                <Textarea
                  id="detalles"
                  placeholder="ej: Tiene una marca en el borde, carga lento..."
                  className="min-h-20 resize-none placeholder:text-gray-300"
                  value={formData.detalles}
                  onChange={(e) => handleChange("detalles", e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="bg-brand hover:brand-hover h-12 w-full rounded-full px-8 text-base text-white hover:scale-105"
                disabled={!valid || submitted}
              >
                <WhatsAppIcon />
                {submitted ? "¡Abriendo WhatsApp!" : "Consultar por WhatsApp"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
