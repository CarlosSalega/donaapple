/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        LOGIN PAGE                                            ║
 * ║  Ruta pública - no requiere sesión                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import Image from "next/image";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-linear-to-b px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-32 sm:h-40 sm:w-40">
          <div className="relative size-full">
            <Image
              src="/logo.png"
              alt="Donaapple"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <LoginForm title="Iniciar Sesión" redirectTo="/admin" />
    </div>
  );
}
