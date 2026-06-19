"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileHeart,
  LayoutDashboard,
  Stethoscope,
  User,
  Wallet,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { routes } from "@/config/routes";
import { ROUTE_PERMISSIONS, type Permission } from "@/config/permissions";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface MobileNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions: Permission[];
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    label: "Accueil",
    href: routes.dashboard.root,
    icon: LayoutDashboard,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.root],
  },
  {
    label: "Consultations",
    href: routes.dashboard.consultations,
    icon: Stethoscope,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.consultations],
  },
  {
    label: "Remboursements",
    href: routes.dashboard.reimbursements,
    icon: Wallet,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.reimbursements],
  },
  {
    label: "Dossiers",
    href: routes.dashboard.medicalRecords,
    icon: FileHeart,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.medicalRecords],
  },
  {
    label: "Profil",
    href: routes.dashboard.profile,
    icon: User,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.profile],
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();

  const visibleItems = MOBILE_NAV_ITEMS.filter((item) => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return hasAnyPermission(item.permissions);
  });

  const isActive = (href: string) => {
    if (href === routes.dashboard.root) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:hidden"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
