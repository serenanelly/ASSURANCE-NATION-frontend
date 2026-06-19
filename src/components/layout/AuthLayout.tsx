"use client";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/utils/cn";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-navy via-primary-dark to-primary">
      <div className="absolute right-4 top-4 z-10 md:right-8 md:top-8">
        <ThemeToggle className="border-white/30 bg-white/10 text-white hover:bg-white/20 dark:border-white/30" />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Logo href="/" size="lg" variant="white" className="mb-8" />

        <div
          className={cn(
            "w-full max-w-md rounded-xl border border-white/20 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-8",
            className
          )}
        >
          {(title || subtitle) && (
            <div className="mb-6 text-center">
              {title && (
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-muted">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
