"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Settings,
  User as UserIcon,
} from "@/components/icons";
import { Avatar } from "@/components/common/Avatar";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { ProfileStats } from "@/components/dashboard/ProfileStats";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { parseApiError } from "@/lib/errors";
import { formatDate, formatFullName } from "@/lib/formatters";
import { getInitials, normalizeRoles } from "@/lib/utils";
import { routes } from "@/config/routes";
import { Role, UserType } from "@/types/enums";
import type { User } from "@/types/user";

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
  const { user, updateUser } = useAuth();
  const { success, error: notifyError } = useNotification();
  const [activeTab, setActiveTab] = useState("info");
  const fileRef = useRef<HTMLInputElement>(null);

  const photoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      const { data } = await api.put<User>(
        `${apiConfig.endpoints.users}/${user!.id}`,
        { photoUrl }
      );
      return data;
    },
    onSuccess: (data) => {
      updateUser(data);
      success("Photo de profil mise à jour");
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const onPickPhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Veuillez choisir un fichier image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifyError("Image trop volumineuse (max 10 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") photoMutation.mutate(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
          <div className="flex flex-col items-center gap-1">
            <Avatar
              photoUrl={user.photoUrl}
              initials={initials}
              className="h-24 w-24 text-3xl"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPickPhoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={photoMutation.isPending}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
            >
              {photoMutation.isPending ? "Envoi…" : "Changer la photo"}
            </button>
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
