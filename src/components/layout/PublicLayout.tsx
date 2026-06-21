"use client";

import Link from "next/link";
import { Menu, X } from "@/components/icons";
import { useState } from "react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/common/Button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

const navLinks = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#statistiques", label: "Statistiques" },
  { href: "#roles", label: "Rôles" },
];

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href={routes.home} size="sm" />

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href={routes.auth.login} className="hidden sm:block">
              <Button size="sm">Se connecter</Button>
            </Link>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 md:hidden dark:border-gray-700"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "border-t border-gray-200 bg-white md:hidden dark:border-gray-800 dark:bg-gray-900",
            mobileOpen ? "block" : "hidden"
          )}
        >
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Navigation mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href={routes.auth.login}
              className="mt-2"
              onClick={() => setMobileOpen(false)}
            >
              <Button size="sm" fullWidth>
                Se connecter
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Logo href={routes.home} size="sm" variant="white" />
              <p className="mt-4 text-sm text-white/70">
                {siteConfig.description}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Navigation
              </h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                Contact
              </h3>
              <p className="mt-4 text-sm text-white/70">
                <a
                  href={siteConfig.links.support}
                  className="transition-colors hover:text-white"
                >
                  support@assurance-nation.local
                </a>
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/60">
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
