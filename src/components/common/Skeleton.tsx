"use client";

import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        {
          "h-4 rounded": variant === "text",
          "rounded-full": variant === "circular",
          "rounded-md": variant === "rectangular",
        },
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden
      {...props}
    />
  );
}
