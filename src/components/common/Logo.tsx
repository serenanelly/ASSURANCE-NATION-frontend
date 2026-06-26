"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

export interface LogoProps {
  href?: string;
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 120, height: 36 },
  md: { width: 160, height: 48 },
  lg: { width: 200, height: 60 },
};

export function Logo({
  href = "/",
  variant = "default",
  size = "md",
  className,
}: LogoProps) {
  const src = variant === "white" ? "/logo-white.png" : "/logo.png";
  const dimensions = sizeMap[size];

  const content = (
    <Image
      src={src}
      alt={siteConfig.name}
      width={dimensions.width}
      height={dimensions.height}
      className={cn("h-auto w-auto object-contain", className)}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0" aria-label={siteConfig.name}>
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0", className)}>{content}</div>;
}
