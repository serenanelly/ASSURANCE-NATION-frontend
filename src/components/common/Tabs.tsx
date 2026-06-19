"use client";

import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn("border-b border-gray-200 dark:border-gray-700", className)}
      role="tablist"
      aria-label="Onglets"
    >
      <div className="flex gap-1 overflow-x-auto">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => onChange(item.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-gray-300 hover:text-foreground",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
