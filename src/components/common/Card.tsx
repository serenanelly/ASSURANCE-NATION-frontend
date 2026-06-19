"use client";

import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  title,
  description,
  footer,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-card shadow-sm dark:border-gray-700",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div
          className={cn(
            "border-b border-gray-200 dark:border-gray-700",
            padding !== "none" && "px-6 py-4"
          )}
        >
          {title && (
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
