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
    <div className="admin-layout">
      <style>{`
        .admin-layout input::placeholder,
        .admin-layout textarea::placeholder,
        .admin-layout [class*="placeholder"]::placeholder {
          color: var(--color-gray-300) !important;
        }
      `}</style>
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
    </div>
  );
}