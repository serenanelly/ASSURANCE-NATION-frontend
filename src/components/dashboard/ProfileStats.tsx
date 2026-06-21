"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/common/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { buildQueryString, hasRole } from "@/lib/utils";
import { Role, ReimbursementStatus } from "@/types/enums";
import type { PageResponse } from "@/types/api";
import type { ReimbursementListResponse } from "@/types/reimbursement";
import type { User } from "@/types/user";

/**
 * Real profile statistics, computed from existing backend endpoints only.
 * Counts that the API exposes as `totalElements` are exact; list endpoints that
 * return a bare array (consultations / prescriptions) are shown as a recent count
 * capped at the page size.
 */
const PAGE_CAP = 100;

function displayCount(
  value: number | undefined,
  isLoading: boolean,
  isError: boolean
): string | number {
  if (isLoading) return "…";
  if (isError || value === undefined) return "—";
  return value;
}

function cappedCount(len: number): string | number {
  return len >= PAGE_CAP ? `${PAGE_CAP}+` : len;
}

export function ProfileStats({ user }: { user: User }) {
  const isAdmin = hasRole(user, Role.ADMIN);
  const isAssureur = hasRole(user, Role.ASSUREUR);
  const isMedecin = hasRole(user, Role.MEDECIN);
  const isPatient = hasRole(user, Role.PATIENT);

  // ADMIN — total users
  const usersQuery = useQuery({
    queryKey: ["profile-stats", "users"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await api.get<PageResponse<unknown>>(
        `${apiConfig.endpoints.users}${buildQueryString({ page: 0, size: 1 })}`
      );
      return data.totalElements;
    },
  });

  // ADMIN — total audit logs
  const auditQuery = useQuery({
    queryKey: ["profile-stats", "audit"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await api.get<PageResponse<unknown>>(
        `${apiConfig.endpoints.users}/audit-logs${buildQueryString({ page: 0, size: 1 })}`
      );
      return data.totalElements;
    },
  });

  // ASSUREUR — pending reimbursements
  const pendingReimbQuery = useQuery({
    queryKey: ["profile-stats", "pending-reimbursements"],
    enabled: isAssureur,
    queryFn: async () => {
      const { data } = await api.get<ReimbursementListResponse>(
        `${apiConfig.endpoints.reimbursements}${buildQueryString({
          page: 0,
          size: 1,
          status: ReimbursementStatus.PENDING,
        })}`
      );
      return data.totalElements;
    },
  });

  // ASSUREUR — active insured
  const activeAssuresQuery = useQuery({
    queryKey: ["profile-stats", "active-assures"],
    enabled: isAssureur,
    queryFn: async () => {
      const { data } = await api.get<PageResponse<unknown>>(
        `${apiConfig.endpoints.assures}${buildQueryString({ page: 0, size: 1, actif: true })}`
      );
      return data.totalElements;
    },
  });

  // MEDECIN / PATIENT — recent consultations (bare array, role-filtered server-side)
  const consultationsQuery = useQuery({
    queryKey: ["profile-stats", "consultations"],
    enabled: isMedecin || isPatient,
    queryFn: async () => {
      const { data } = await api.get<unknown[]>(
        `${apiConfig.endpoints.consultations}${buildQueryString({ page: 0, size: PAGE_CAP })}`
      );
      return Array.isArray(data) ? data.length : 0;
    },
  });

  // MEDECIN — recent prescriptions (bare array)
  const prescriptionsQuery = useQuery({
    queryKey: ["profile-stats", "prescriptions"],
    enabled: isMedecin,
    queryFn: async () => {
      const { data } = await api.get<unknown[]>(
        `${apiConfig.endpoints.prescriptions}${buildQueryString({ page: 0, size: PAGE_CAP })}`
      );
      return Array.isArray(data) ? data.length : 0;
    },
  });

  // PATIENT — own reimbursements in progress (PENDING or APPROVED)
  const patientReimbQuery = useQuery({
    queryKey: ["profile-stats", "patient-reimbursements"],
    enabled: isPatient,
    queryFn: async () => {
      const { data } = await api.get<ReimbursementListResponse>(
        `${apiConfig.endpoints.reimbursements}${buildQueryString({ page: 0, size: PAGE_CAP })}`
      );
      const inProgress = (data.content ?? []).filter(
        (r) =>
          r.status === ReimbursementStatus.PENDING ||
          r.status === ReimbursementStatus.APPROVED
      ).length;
      return cappedCount(inProgress);
    },
  });

  const hasAny = isAdmin || isAssureur || isMedecin || isPatient;
  if (!hasAny) {
    return (
      <Card className="sm:col-span-2">
        <p className="text-center text-muted">
          Aucune statistique disponible pour votre profil.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {isMedecin && (
        <>
          <StatCard
            title="Consultations"
            value={
              consultationsQuery.isLoading || consultationsQuery.isError
                ? displayCount(undefined, consultationsQuery.isLoading, consultationsQuery.isError)
                : cappedCount(consultationsQuery.data ?? 0)
            }
            subtitle="Récentes"
          />
          <StatCard
            title="Prescriptions"
            value={
              prescriptionsQuery.isLoading || prescriptionsQuery.isError
                ? displayCount(undefined, prescriptionsQuery.isLoading, prescriptionsQuery.isError)
                : cappedCount(prescriptionsQuery.data ?? 0)
            }
            subtitle="Récentes"
          />
        </>
      )}

      {isAssureur && (
        <>
          <StatCard
            title="Remboursements"
            value={displayCount(
              pendingReimbQuery.data,
              pendingReimbQuery.isLoading,
              pendingReimbQuery.isError
            )}
            subtitle="En attente"
          />
          <StatCard
            title="Assurés actifs"
            value={displayCount(
              activeAssuresQuery.data,
              activeAssuresQuery.isLoading,
              activeAssuresQuery.isError
            )}
            subtitle="Total"
          />
        </>
      )}

      {isPatient && (
        <>
          <StatCard
            title="Consultations"
            value={
              consultationsQuery.isLoading || consultationsQuery.isError
                ? displayCount(undefined, consultationsQuery.isLoading, consultationsQuery.isError)
                : cappedCount(consultationsQuery.data ?? 0)
            }
            subtitle="Récentes"
          />
          <StatCard
            title="Remboursements"
            value={
              patientReimbQuery.isLoading || patientReimbQuery.isError
                ? displayCount(undefined, patientReimbQuery.isLoading, patientReimbQuery.isError)
                : patientReimbQuery.data ?? "—"
            }
            subtitle="En cours"
          />
        </>
      )}

      {isAdmin && (
        <>
          <StatCard
            title="Utilisateurs"
            value={displayCount(usersQuery.data, usersQuery.isLoading, usersQuery.isError)}
            subtitle="Total"
          />
          <StatCard
            title="Audit logs"
            value={displayCount(auditQuery.data, auditQuery.isLoading, auditQuery.isError)}
            subtitle="Total"
          />
        </>
      )}
    </div>
  );
}
