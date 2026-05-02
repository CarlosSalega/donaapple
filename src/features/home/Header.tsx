"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/shared/hooks/useTheme";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "@/shared/components/ui/logo";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
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

  const handleOpenMenu = () => {
    setMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-border-subtle bg-background/80 sticky top-10 z-40 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-270 items-center justify-between px-4 lg:px-0">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-text-primary hover:text-brand flex items-center gap-2 text-lg font-semibold transition-colors"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 lg:flex">
          <Link
            href="/catalogo"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
          >
            Contacto
          </Link>
        </nav>

        {/* Mobile Menu Button - hamburger or X */}
        <button
          onClick={mobileMenuOpen ? handleCloseMenu : handleOpenMenu}
          className="hover:bg-surface-muted flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M21 6a1 1 0 0 1 -1 1h-16a1 1 0 1 1 0 -2h16a1 1 0 0 1 1 1" />
              <path d="M21 12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 0 -2h16a1 1 0 0 1 1 1" />
              <path d="M21 18a1 1 0 0 1 -1 1h-16a1 1 0 0 1 0 -2h16a1 1 0 0 1 1 1" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
