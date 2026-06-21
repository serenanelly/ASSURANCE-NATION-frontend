"use client";

import { ChevronLeft, ChevronRight } from "@/components/icons";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showLabels?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  showLabels = true,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  return (
    <nav
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        className
      )}
      aria-label="Pagination"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
        icon={<ChevronLeft className="h-4 w-4" />}
      >
        {showLabels ? "Précédent" : null}
      </Button>

      <span className="text-sm text-muted">
        Page {page + 1} sur {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
      >
        {showLabels ? "Suivant" : null}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
