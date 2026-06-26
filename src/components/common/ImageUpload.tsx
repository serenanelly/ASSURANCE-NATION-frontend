"use client";

import { useRef, useState } from "react";
import { cn } from "@/utils/cn";

export interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  initials?: string;
  error?: string;
  className?: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 Mo

export function ImageUpload({
  value,
  onChange,
  label = "Photo de profil",
  initials,
  error,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Veuillez choisir un fichier image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("Image trop volumineuse (max 10 Mo).");
      return;
    }
    setLocalError(null);
    const reader = new FileReader();
    reader.onload = () =>
      onChange(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted">
              {initials || "?"}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            )}
          >
            {value ? "Changer l'image" : "Choisir une image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-xs text-error hover:underline"
            >
              Retirer
            </button>
          )}
          <p className="text-xs text-muted">JPG / PNG, max 10 Mo</p>
        </div>
      </div>
      {(localError || error) && (
        <p className="mt-1 text-sm text-error">{localError || error}</p>
      )}
    </div>
  );
}
