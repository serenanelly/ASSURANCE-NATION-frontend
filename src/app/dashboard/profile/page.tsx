"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Settings,
  User as UserIcon,
} from "@/components/icons";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { ProfileStats } from "@/components/dashboard/ProfileStats";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatFullName } from "@/lib/formatters";
import { getInitials, normalizeRoles } from "@/lib/utils";
import { routes } from "@/config/routes";
import { Role, UserType } from "@/types/enums";

const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.MEDECIN]: "Médecin",
  [UserType.ASSURE]: "Assuré",
  [UserType.ASSUREUR]: "Assureur",
};

const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: "Administrateur",
  [Role.MEDECIN]: "Médecin",
  [Role.ASSUREUR]: "Assureur",
  [Role.PATIENT]: "Patient",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted">Chargement du profil...</p>
      </div>
    );
  }

  const initials = getInitials(user.nom, user.prenom);
  const roles = normalizeRoles(user.roles);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-card dark:border-gray-800">
        <div className="flex flex-col items-center px-6 py-10 sm:flex-row sm:items-end sm:gap-6 sm:pb-8 sm:pt-12">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
            {initials}
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:flex-1 sm:text-left">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {formatFullName(user.nom, user.prenom)}
            </h1>
            <p className="mt-1 text-muted">{user.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {roles.map((role) => (
                <Badge key={role} variant="outline">
                  {ROLE_LABELS[role] ?? role}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            href={routes.dashboard.settings}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 sm:mt-0"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Paramètres
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs
          items={[
            { id: "info", label: "Informations" },
            { id: "stats", label: "Statistiques" },
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "info" && (
            <Card title="Informations personnelles" padding="md">
              <dl className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Type de compte"
                  value={USER_TYPE_LABELS[user.userType] ?? user.userType}
                />
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={user.email}
                />
                {user.telephone && (
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Téléphone"
                    value={user.telephone}
                  />
                )}
                {user.adresse && (
                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Adresse"
                    value={user.adresse}
                  />
                )}
                {user.createdAt && (
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Membre depuis"
                    value={formatDate(user.createdAt)}
                  />
                )}
              </dl>
            </Card>
          )}

          {activeTab === "stats" && <ProfileStats user={user} />}
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
