"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
}

export function Breadcrumb({
  items,
  className,
  showHome = true,
  homeHref = "/dashboard",
}: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Accueil", href: homeHref }, ...items]
    : items;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn("flex items-center gap-1 text-sm text-muted", className)}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 transition-colors hover:text-primary"
                >
                  {index === 0 && showHome && (
                    <Home className="h-4 w-4" aria-hidden />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    isLast && "font-medium text-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {index === 0 && showHome && !item.href && (
                    <Home className="h-4 w-4" aria-hidden />
                  )}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
