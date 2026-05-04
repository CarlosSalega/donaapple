/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        ADMIN LAYOUT                                           ║
 * ║              Layout base para admin (sin verificación de sesión)              ║
 * ║              La sesión se verifica en proxy.ts y en rutas protegidas           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { SidebarProvider } from "@/shared/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  );
}