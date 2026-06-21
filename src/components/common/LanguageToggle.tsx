"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Globe } from "@/components/icons";
import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";

export interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700",
          className
        )}
        aria-label="Changer la langue"
        disabled
      />
    );
  }

  const isFrench = locale === "fr";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-foreground transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
        className
      )}
      aria-label={isFrench ? "Switch to English" : "Changer en français"}
    >
      <Globe className="h-4 w-4" aria-hidden />
    </button>
  );
}
