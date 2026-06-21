"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileHeart,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Stethoscope,
  User,
  UserRound,
  Users,
  Wallet,
} from "@/components/icons";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { routes } from "@/config/routes";
import { ROUTE_PERMISSIONS, type Permission } from "@/config/permissions";
import { formatFullName } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "@/components/icons";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions: Permission[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Tableau de bord",
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
    label: "Prescriptions",
    href: routes.dashboard.prescriptions,
    icon: Pill,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.prescriptions],
  },
  {
    label: "Remboursements",
    href: routes.dashboard.reimbursements,
    icon: Wallet,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.reimbursements],
  },
  {
    label: "Feuilles de maladie",
    href: routes.dashboard.medicalRecords,
    icon: FileHeart,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.medicalRecords],
  },
  {
    label: "Assurés",
    href: routes.dashboard.usersAssures,
    icon: Users,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.usersAssures],
  },
  {
    label: "Médecins",
    href: routes.dashboard.usersMedecins,
    icon: UserRound,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.usersMedecins],
  },
  {
    label: "Statistiques",
    href: routes.dashboard.reimbursementStats,
    icon: BarChart3,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.reimbursementStats],
  },
  {
    label: "Mon profil",
    href: routes.dashboard.profile,
    icon: User,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.profile],
  },
  {
    label: "Paramètres",
    href: routes.dashboard.settings,
    icon: Settings,
    permissions: ROUTE_PERMISSIONS[routes.dashboard.settings],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar-collapsed", String(next));
      }
      return next;
    });
  };

  const visibleItems = NAV_ITEMS.filter((item) => {
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
    <aside
      className={cn(
        "hidden h-screen shrink-0 flex-col bg-card text-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex items-center py-5",
          collapsed ? "justify-center px-3" : "justify-between px-6"
        )}
      >
        {!collapsed && <Logo href={routes.dashboard.root} size="md" />}
        <button
          type="button"
          onClick={toggleCollapsed}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
          aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" aria-hidden />
          ) : (
            <ChevronLeft className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-gray-100 text-primary dark:bg-gray-800"
                  : "text-muted hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                aria-hidden
              >
                {getInitials(user.nom, user.prenom)}
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                aria-hidden
              >
                {getInitials(user.nom, user.prenom)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {formatFullName(user.nom, user.prenom)}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export { NAV_ITEMS };
