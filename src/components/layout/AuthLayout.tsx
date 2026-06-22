"use client";

import Image from "next/image";
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
    <div className="flex min-h-screen gap-4 bg-background p-4 lg:h-screen lg:overflow-hidden">
      {/* Left — image panel */}
      <div className="relative hidden w-1/2 shrink-0 overflow-hidden rounded-3xl lg:block">
        <Image
          src="/bg-login.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />

        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Logo href="/" size="md" variant="white" />

          <div>
            <h2 className="max-w-md text-3xl font-bold leading-tight text-white">
              La gestion santé, simplifiée.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Consultations, prescriptions et remboursements réunis dans une
              plateforme sécurisée pour médecins, assureurs et patients.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex w-full flex-col lg:w-1/2 lg:overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-2">
          <Logo href="/" size="md" className="lg:hidden" />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          <div className={cn("w-full max-w-md", className)}>
            {(title || subtitle) && (
              <div className="mb-8 text-center">
                {title && (
                  <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-3 text-muted">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
