/**
 * ╔══════════════════════════════════════════╗
 * ║    AUTH FEATURE — LOGIN FORM             ║
 * ╚══════════════════════════════════════════╝
 *
 * Formulario de login reutilizable.
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AUTH_CONFIG } from "../config";
import { loginSchema, type LoginInput } from "../validations/auth";
import { toast } from "sonner";

interface LoginFormProps {
  title?: string;
  redirectTo?: string;
  onSuccess?: (user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  }) => void;
}

export function LoginForm({
  title = "Iniciar sesión",
  redirectTo = AUTH_CONFIG.ROUTES.AFTER_LOGIN,
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setServerError("Demasiados intentos");
        toast.error("Intentá más tarde.", { position: "top-right" });
        return;
      }

      if (!res.ok) {
        const msg = result.error ?? "Credenciales incorrectas";
        setServerError(msg);
        toast.error("Credenciales incorrectas", { position: "top-right" });
        return;
      }

      toast.success("Bienvenido", { position: "top-right" });
      onSuccess?.(result.user);
      router.push(redirectTo);
    } catch {
      const msg = "No se pudo completar la solicitud";
      setServerError(msg);
      toast.error("Error", { description: msg });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div
            role="alert"
            aria-live="polite"
            className="border-destructive/30 bg-destructive/10 text-destructive flex min-h-10 items-start gap-2 rounded-md border px-3 py-2 text-sm transition-opacity duration-200"
            style={{
              opacity: serverError ? 1 : 0,
              pointerEvents: serverError ? "auto" : "none",
            }}
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>{serverError}</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              autoFocus
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            <p
              id="email-error"
              className="text-destructive flex min-h-4.5 items-center gap-1 text-xs"
              aria-live="polite"
            >
              {errors.email && (
                <>
                  <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
                  {errors.email.message}
                </>
              )}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              {...register("password")}
            />
            <p
              id="password-error"
              className="text-destructive flex min-h-4.5 items-center gap-1 text-xs"
              aria-live="polite"
            >
              {errors.password && (
                <>
                  <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
                  {errors.password.message}
                </>
              )}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
