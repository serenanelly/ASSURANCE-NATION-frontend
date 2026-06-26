"use client";

import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Breadcrumb, type BreadcrumbItem } from "@/components/common/Breadcrumb";

interface HeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function Header({ title, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} className="mb-2" />
          )}
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
