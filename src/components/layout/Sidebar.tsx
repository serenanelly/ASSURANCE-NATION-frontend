"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
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
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { routes } from "@/config/routes";
import { ROUTE_PERMISSIONS, type Permission } from "@/config/permissions";
import { formatFullName } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

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
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col bg-navy text-white lg:flex">
      <div className="border-b border-white/10 px-6 py-5">
        <Logo href={routes.dashboard.root} size="md" variant="white" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
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
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export { NAV_ITEMS };
