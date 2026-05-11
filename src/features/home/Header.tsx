"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/shared/components/ui/logo";
import { Hamburger, XIcon } from "@/shared/components/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";

interface HeaderProps {
  bannerEnabled?: boolean;
}

interface NavItem {
  label: string;
  sectionId?: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Canje", sectionId: "canje" },
  { label: "Testimonios", sectionId: "testimonios" },
  { label: "Información", sectionId: "tienda" },
  { label: "Contacto", sectionId: "contacto" },
];

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function navigateToSection(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  sectionId: string,
) {
  if (pathname === "/") {
    scrollToSection(sectionId);
  } else {
    router.push(`/?section=${sectionId}`);
  }
}

export function Header({ bannerEnabled = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleOpenMenu = () => setMobileMenuOpen(true);
  const handleCloseMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.sectionId) {
      navigateToSection(router, pathname, item.sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`border-border-subtle bg-background/80 sticky ${
        bannerEnabled ? "top-10" : "top-0"
      } z-40 w-full border-b backdrop-blur-md`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-16">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-text-primary hover:text-brand flex items-center gap-2 text-lg font-semibold transition-colors"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu - Dropdown */}
        <DropdownMenu
          open={mobileMenuOpen}
          onOpenChange={(open) => setMobileMenuOpen(open)}
        >
          <DropdownMenuTrigger asChild>
            <button
              onClick={mobileMenuOpen ? handleCloseMenu : handleOpenMenu}
              className="hover:bg-surface-muted flex size-10 items-center justify-center focus:ring-0 focus:outline-none lg:hidden"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <Hamburger size={24} />}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="border-border-subtle bg-background mt-2 mr-2 ml-2 w-56 space-y-4 p-8"
            align="start"
            sideOffset={8}
          >
            {NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.label} asChild>
                <button
                  onClick={() => handleNavClick(item)}
                  className="text-text-secondary hover:text-text-primary block w-full cursor-pointer px-2 py-2 text-left text-sm font-medium"
                >
                  {item.label}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
