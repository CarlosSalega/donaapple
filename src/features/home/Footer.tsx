"use client";

import { useRouter } from "next/navigation";
import {
  Container,
  AppleIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "@/shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FooterProps {
  brand?: string;
  text?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  address?: string;
  phone?: string;
}

const DEFAULT_BRAND = "Donaapple";
const DEFAULT_TEXT = "Tu mejor opcion en iPhones nuevos y usados con garantia.";
const DEFAULT_INSTAGRAM = "https://instagram.com/donaapple.ba";
const DEFAULT_WHATSAPP = "https://wa.me/5492324687617";
const DEFAULT_ADDRESS = "Calle 25 N° 465, Mercedes - Buenos Aires";
const DEFAULT_PHONE = "+54 9 2324 687617";

type SocialLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverClass: string;
};

export function Footer({
  brand = DEFAULT_BRAND,
  text = DEFAULT_TEXT,
  instagramUrl = DEFAULT_INSTAGRAM,
  whatsappUrl = DEFAULT_WHATSAPP,
  address = DEFAULT_ADDRESS,
  phone = DEFAULT_PHONE,
}: FooterProps) {
  const router = useRouter();

  const socialLinks: SocialLink[] = [
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
  ];

  return (
    <footer className="border-border-subtle bg-surface border-t py-8">
      <Container>
        <div className="flex flex-col gap-6 text-center sm:px-8 sm:text-left">
          {/* Fila 1: Brand | Social icons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="text-text-primary flex cursor-pointer items-center gap-2 font-semibold select-none">
                  <AppleIcon className="size-7" />
                  <span className="text-xl">{brand}</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="p-4">
                <DropdownMenuItem
                  className="border-border cursor-pointer border"
                  onClick={() => router.push("/admin/login")}
                >
                  Ingresar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-text-secondary transition-colors ${link.hoverClass}`}
                    aria-label={link.label}
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Fila 2 */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-text-secondary max-w-xs text-sm">{text}</p>

            <div className="text-text-secondary flex flex-col gap-1 text-sm sm:items-end">
              <span>{address}</span>
              <span>{phone}</span>
            </div>
          </div>
        </div>

        <div className="border-border-subtle text-text-secondary mt-8 border-t pt-8 text-center text-sm">
          {new Date().getFullYear()} © {brand}. Derechos reservados.
        </div>
      </Container>
    </footer>
  );
}
