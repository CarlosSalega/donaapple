/**
 * ╔══════════════════════════════════════════╗
 * ║    AUTH FEATURE — LOGIN FORM             ║
 * ╚══════════════════════════════════════════╝
 *
 * Formulario de login reutilizable.
 *
 * PROPS:
 *   title          → Título del card (default: "Iniciar sesión")
 *   redirectTo     → URL post-login (default: AUTH_CONFIG.ROUTES.AFTER_LOGIN)
 *   onSuccess      → Callback opcional post-login
 *
 * DEPENDENCIAS UI (shadcn/ui):
 *   button, card, input, label
 *   Si tu proyecto no usa shadcn, reemplazá los imports por tus componentes.
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

// ─── Labels dinámicos según modo ─────────────────────────────────────────────

const IDENTIFIER_LABELS: Record<typeof AUTH_CONFIG.IDENTIFIER_MODE, string> = {
  email: "Email",
  username: "Usuario",
  any: "Email o usuario",
};

const IDENTIFIER_PLACEHOLDERS: Record<typeof AUTH_CONFIG.IDENTIFIER_MODE, string> = {
  email: "usuario@ejemplo.com",
  username: "mi_usuario",
  any: "usuario@ejemplo.com o mi_usuario",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoginFormProps {
  title?: string;
  redirectTo?: string;
  onSuccess?: (user: { id: string; name: string | null; email: string; role: string }) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function LoginForm({
  title = "Iniciar sesión",
  redirectTo = AUTH_CONFIG.ROUTES.AFTER_LOGIN,
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setRetryAfter(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setRetryAfter(result.retryAfter ?? null);
        setServerError(result.message ?? "Demasiados intentos. Intentá más tarde.");
        return;
      }

      if (!res.ok) {
        setServerError(result.error ?? "Credenciales incorrectas");
        return;
      }

      // Login exitoso
      onSuccess?.(result.user);
      router.push(redirectTo);
      router.refresh(); // Revalida Server Components / layouts
    } catch {
      setServerError("Error de conexión con el servidor");
    }
  };

  const identifierLabel = IDENTIFIER_LABELS[AUTH_CONFIG.IDENTIFIER_MODE];
  const identifierPlaceholder = IDENTIFIER_PLACEHOLDERS[AUTH_CONFIG.IDENTIFIER_MODE];
  const identifierType = AUTH_CONFIG.IDENTIFIER_MODE === "email" ? "email" : "text";

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* Error del servidor */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                {serverError}
                {retryAfter && (
                  <span className="ml-1 font-medium">
                    ({Math.ceil(retryAfter / 60)} min)
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Identifier */}
          <div className="space-y-1.5">
            <Label htmlFor="identifier">{identifierLabel}</Label>
            <Input
              id="identifier"
              type={identifierType}
              placeholder={identifierPlaceholder}
              autoComplete={AUTH_CONFIG.IDENTIFIER_MODE === "email" ? "email" : "username"}
              autoFocus
              disabled={isSubmitting}
              aria-invalid={!!errors.identifier}
              aria-describedby={errors.identifier ? "identifier-error" : undefined}
              {...register("identifier")}
            />
            {errors.identifier && (
              <p id="identifier-error" className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
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
