"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  User,
} from "@/components/icons";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { routes } from "@/config/routes";
import { formatFullName } from "@/lib/formatters";
import { getInitials } from "@/lib/utils";
import { cn } from "@/utils/cn";

const PAGE_TITLES: Record<string, string> = {
  [routes.dashboard.root]: "Tableau de bord",
  [routes.dashboard.consultations]: "Consultations",
  [routes.dashboard.prescriptionNew]: "Nouvelle prescription",
  [routes.dashboard.prescriptions]: "Prescriptions",
  [routes.dashboard.reimbursements]: "Remboursements",
  [routes.dashboard.reimbursementNew]: "Nouveau remboursement",
  [routes.dashboard.reimbursementStats]: "Statistiques remboursements",
  [routes.dashboard.medicalRecords]: "Feuilles de maladie",
  [routes.dashboard.users]: "Utilisateurs",
  [routes.dashboard.usersAssures]: "Assurés",
  [routes.dashboard.usersMedecins]: "Médecins",
  [routes.dashboard.profile]: "Mon profil",
  [routes.dashboard.settings]: "Paramètres",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  const sortedRoutes = Object.keys(PAGE_TITLES).sort(
    (a, b) => b.length - a.length
  );
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return PAGE_TITLES[route];
    }
  }

  return "Tableau de bord";
}

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);
  const unreadCount = notifications.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">
          {pageTitle}
        </h1>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <div className="relative hidden max-w-xs flex-1 md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800"
              aria-label="Rechercher"
            />
          </div>

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-foreground transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            aria-label={
              unreadCount > 0
                ? `${unreadCount} notification(s)`
                : "Notifications"
            }
          >
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
                  aria-hidden
                >
                  {getInitials(user.nom, user.prenom)}
                </div>
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground md:block">
                  {formatFullName(user.nom, user.prenom)}
                </span>
                <ChevronDown
                  className={cn(
                    "hidden h-4 w-4 text-muted transition-transform md:block",
                    menuOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                >
                  <Link
                    href={routes.dashboard.profile}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User className="h-4 w-4" aria-hidden />
                    Mon profil
                  </Link>
                  <Link
                    href={routes.dashboard.settings}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Settings className="h-4 w-4" aria-hidden />
                    Paramètres
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
