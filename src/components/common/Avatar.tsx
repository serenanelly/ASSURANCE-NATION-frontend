"use client";

import { cn } from "@/utils/cn";

export interface AvatarProps {
  photoUrl?: string;
  initials: string;
  /** Sizing/border utility classes (e.g. "h-16 w-16 text-xl"). */
  className?: string;
}

/**
 * Round avatar: shows the uploaded photo when present, otherwise the initials
 * on a primary background.
 */
export function Avatar({ photoUrl, initials, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-white",
        className
      )}
      aria-hidden
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
