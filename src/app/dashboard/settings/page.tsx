"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { Card } from "@/components/common/Card";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

const NOTIFICATIONS_KEY = "assurance-nation-notifications";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored !== null) {
      setNotificationsEnabled(stored === "true");
    } else {
      setNotificationsEnabled(siteConfig.features.notifications);
    }
  }, []);

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem(NOTIFICATIONS_KEY, String(next));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href={routes.dashboard.profile}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Retour au profil
      </Link>

      <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
      <p className="mt-1 text-muted">
        Gérez vos préférences et la sécurité de votre compte.
      </p>

      <div className="mt-8 space-y-6">
        <Card title="Apparence" description="Personnalisez l'affichage de l'application">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Thème</p>
              <p className="text-sm text-muted">Basculer entre mode clair et sombre</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        <Card
          title="Notifications"
          description="Contrôlez les alertes et messages toast"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Notifications toast
                </p>
                <p className="text-sm text-muted">
                  Afficher les confirmations et erreurs
                </p>
              </div>
            </div>
            {mounted && (
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                aria-label="Activer les notifications"
                onClick={toggleNotifications}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  notificationsEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            )}
          </div>
        </Card>

        <Card
          title="Sécurité"
          description="Modifiez votre mot de passe"
        >
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
