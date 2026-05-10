import Link from "next/link";
import {
  Container,
  AppleIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/shared/components/ui";

interface FooterProps {
  brand?: string;
  text?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
}

const DEFAULT_BRAND = "Donaapple";
const DEFAULT_TEXT = "Tu mejor opción en iPhones nuevos y usados con garantía.";
const DEFAULT_INSTAGRAM = "https://instagram.com";
const DEFAULT_WHATSAPP = "https://wa.me/5491100000000";

const NAV_LINKS: { href: string; label: string; isNext?: boolean }[] = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/", label: "Contacto", isNext: true },
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
];

export function Footer({
  brand = DEFAULT_BRAND,
  text = DEFAULT_TEXT,
  instagramUrl = DEFAULT_INSTAGRAM,
  whatsappUrl = DEFAULT_WHATSAPP,
}: FooterProps) {
  const socialLinks = [
    {
      href: instagramUrl,
      label: "Instagram",
      icon: InstagramIcon,
      hoverClass: "hover:text-brand",
    },
    {
      href: whatsappUrl,
      label: "WhatsApp",
      icon: WhatsAppIcon,
      hoverClass: "hover:text-[#25D366]",
    },
  ] as const;

  return (
    <footer className="border-border-subtle bg-surface border-t py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-text-primary mb-2 flex items-center gap-2 font-semibold">
              <AppleIcon className="h-5 w-5" />
              <span>{brand}</span>
            </div>
            <p className="text-text-secondary max-w-xs text-sm">
              {text}
            </p>
          </div>

          {/* Nav links */}
          <nav
            aria-label="Footer"
            className="text-text-secondary flex flex-wrap justify-center gap-6 text-sm"
          >
            {NAV_LINKS.map(({ href, label, isNext }) =>
              isNext ? (
                <Link
                  key={href}
                  href={href}
                  className="hover:text-text-primary"
                >
                  {label}
                </Link>
              ) : (
                <a key={href} href={href} className="hover:text-text-primary">
                  {label}
                </a>
              ),
            )}
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, icon: Icon, hoverClass }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-text-secondary transition-colors ${hoverClass}`}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-border-subtle text-text-secondary mt-8 border-t pt-8 text-center text-sm">
          © {new Date().getFullYear()} {brand}. Derechos reservados.
        </div>
      </Container>
    </footer>
  );
}