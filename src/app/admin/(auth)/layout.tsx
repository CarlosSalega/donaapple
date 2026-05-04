/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        AUTH LAYOUT                                            ║
 * ║  Layout público - sin sidebar, sin wrapper restrictivo                        ║
 * ║  Este layout envuelve las rutas públicas de autenticación                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}