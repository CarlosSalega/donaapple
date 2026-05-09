"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/shared/components/ui/logo";

export function Header() {
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
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-16">
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
