"use client";

import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        {
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200":
            variant === "default",
          "bg-primary/10 text-primary": variant === "primary",
          "bg-accent/10 text-accent": variant === "accent",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-error/10 text-error": variant === "error",
          "border border-gray-300 bg-transparent text-foreground dark:border-gray-600":
            variant === "outline",
        },
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
