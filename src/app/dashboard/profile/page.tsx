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
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatFullName } from "@/lib/formatters";
import { getInitials, hasRole, normalizeRoles } from "@/lib/utils";
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
      {/* Gradient header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-navy via-primary-dark to-primary">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex flex-col items-center px-6 py-10 sm:flex-row sm:items-end sm:gap-6 sm:pb-8 sm:pt-12">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
            {initials}
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:flex-1 sm:text-left">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {formatFullName(user.nom, user.prenom)}
            </h1>
            <p className="mt-1 text-white/80">{user.email}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {roles.map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white"
                >
                  {ROLE_LABELS[role] ?? role}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            href={routes.dashboard.settings}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 sm:mt-0"
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

          {activeTab === "stats" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {hasRole(user, Role.MEDECIN) && (
                <>
                  <StatCard
                    title="Consultations"
                    value="—"
                    subtitle="Ce mois-ci"
                  />
                  <StatCard
                    title="Prescriptions"
                    value="—"
                    subtitle="Actives"
                  />
                </>
              )}
              {hasRole(user, Role.ASSUREUR) && (
                <>
                  <StatCard
                    title="Remboursements"
                    value="—"
                    subtitle="En attente"
                  />
                  <StatCard
                    title="Assurés actifs"
                    value="—"
                    subtitle="Total"
                  />
                </>
              )}
              {hasRole(user, Role.PATIENT) && (
                <>
                  <StatCard
                    title="Consultations"
                    value="—"
                    subtitle="Total"
                  />
                  <StatCard
                    title="Remboursements"
                    value="—"
                    subtitle="En cours"
                  />
                </>
              )}
              {hasRole(user, Role.ADMIN) && (
                <>
                  <StatCard title="Utilisateurs" value="—" subtitle="Actifs" />
                  <StatCard title="Audit logs" value="—" subtitle="7 derniers jours" />
                </>
              )}
              {!roles.length && (
                <Card className="sm:col-span-2">
                  <p className="text-center text-muted">
                    Aucune statistique disponible pour votre profil.
                  </p>
                </Card>
              )}
            </div>
          )}
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
