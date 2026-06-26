"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, UserRound } from "@/components/icons";
import { Avatar } from "@/components/common/Avatar";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/common/Spinner";
import { StatCard } from "@/components/dashboard/StatCard";
import { UserForm } from "@/components/forms/UserForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { buildQueryString, getInitials } from "@/lib/utils";
import { formatCurrency, formatSpecialite } from "@/lib/formatters";
import { cn } from "@/utils/cn";
import type { Assure, Medecin } from "@/types";
import type { PageResponse } from "@/types/api";
import type { ReimbursementListResponse } from "@/types/reimbursement";
import { Specialite } from "@/types/enums";

type SectionId = "infos" | "patients" | "financier" | "modifier";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "infos", label: "Informations" },
  { id: "patients", label: "Patients suivis" },
  { id: "financier", label: "Financier" },
  { id: "modifier", label: "Modifier" },
];

export default function MedecinDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();
  const [section, setSection] = useState<SectionId>("infos");

  const { data: medecin, isLoading } = useQuery({
    queryKey: ["medecin", params.id],
    queryFn: async () => {
      const { data } = await api.get<Medecin>(
        `${apiConfig.endpoints.medecins}/${params.id}`
      );
      return data;
    },
  });

  // Patients (assurés) whose médecin traitant is this doctor
  const patientsQuery = useQuery({
    queryKey: ["medecin-patients", params.id],
    enabled: Boolean(params.id),
    queryFn: async () => {
      const { data } = await api.get<PageResponse<Assure>>(
        `${apiConfig.endpoints.assures}${buildQueryString({ page: 0, size: 100 })}`
      );
      return (data.content ?? []).filter((a) => a.medecinTraitantId === params.id);
    },
  });

  // Financier — sum of reimbursement totals across the patients this doctor follows
  const patientIdsKey = (patientsQuery.data ?? [])
    .map((a) => a.id)
    .sort()
    .join(",");
  const financeQuery = useQuery({
    queryKey: ["medecin-finance", params.id, patientIdsKey],
    enabled: patientsQuery.isSuccess,
    queryFn: async () => {
      const patientsList = patientsQuery.data ?? [];
      const responses = await Promise.all(
        patientsList.map((a) =>
          api
            .get<ReimbursementListResponse>(
              `${apiConfig.endpoints.reimbursements}${buildQueryString({
                assureId: a.id,
                page: 0,
                size: 100,
              })}`
            )
            .then((r) => r.data)
        )
      );
      let totalRembourse = 0;
      let nombre = 0;
      for (const r of responses) {
        if (r.statistics) {
          totalRembourse += r.statistics.totalRembourses ?? 0;
          nombre += r.statistics.nombreRemboursements ?? 0;
        }
      }
      return {
        totalRembourse,
        nombre,
        moyenne: nombre > 0 ? totalRembourse / nombre : 0,
        patientsCount: patientsList.length,
      };
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: {
      nom: string;
      prenom: string;
      telephone?: string;
      specialite: Specialite;
      specialiteLibelle?: string;
      estAssure?: boolean;
      photoUrl?: string;
    }) => {
      const { data } = await api.put<Medecin>(
        `${apiConfig.endpoints.medecins}/${params.id}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      success("Médecin mis à jour");
      queryClient.invalidateQueries({ queryKey: ["medecin", params.id] });
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement" />
      </div>
    );
  }

  if (!medecin) {
    return (
      <>
        <Header title="Médecin introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.usersMedecins}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  const patients = patientsQuery.data ?? [];

  return (
    <>
      <Header
        title={`Dr. ${medecin.prenom} ${medecin.nom}`}
        breadcrumbs={[
          { label: "Médecins", href: routes.dashboard.usersMedecins },
          { label: "Détail" },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Summary header */}
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <Avatar
              photoUrl={medecin.photoUrl}
              initials={getInitials(medecin.nom, medecin.prenom)}
              className="h-16 w-16 text-xl"
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-foreground">
                Dr. {medecin.prenom} {medecin.nom}
              </h2>
              <p className="truncate text-sm text-muted">{medecin.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{formatSpecialite(medecin.specialite)}</Badge>
                {medecin.specialiteLibelle && (
                  <span className="text-xs text-muted">{medecin.specialiteLibelle}</span>
                )}
                <span className="font-mono text-xs text-muted">
                  RPPS {medecin.numeroRPPS}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Section toggle buttons */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              aria-pressed={section === s.id}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                section === s.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200 hover:text-foreground dark:bg-gray-800 dark:hover:bg-gray-700"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Active section */}
        {section === "infos" && (
          <Card title="Informations" padding="lg">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd>{medecin.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">N° RPPS</dt>
                <dd className="font-mono">{medecin.numeroRPPS}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Spécialité</dt>
                <dd className="flex items-center gap-2">
                  <Badge variant="primary">{formatSpecialite(medecin.specialite)}</Badge>
                  {medecin.specialiteLibelle && (
                    <span className="text-sm text-foreground">
                      {medecin.specialiteLibelle}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Également assuré</dt>
                <dd>
                  <Badge variant={medecin.estAssure ? "success" : "default"}>
                    {medecin.estAssure ? "Oui" : "Non"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>
        )}

        {section === "patients" && (
          <Card title="Patients suivis" padding="lg">
            {patientsQuery.isLoading ? (
              <p className="text-sm text-muted">Chargement…</p>
            ) : patients.length === 0 ? (
              <p className="text-sm text-muted">
                Aucun assuré n&apos;a ce médecin comme médecin traitant.
              </p>
            ) : (
              <div className="space-y-2">
                {patients.map((assure) => (
                  <Link
                    key={assure.id}
                    href={routes.dashboard.usersAssureDetail(assure.id)}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <UserRound className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                      <div>
                        <p className="font-medium text-foreground">
                          {assure.prenom} {assure.nom}
                        </p>
                        <p className="text-sm text-muted">
                          NSS {assure.numSecuriteSociale}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        )}

        {section === "financier" && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Cumul des remboursements de tous les patients suivis par ce médecin.
            </p>
            {financeQuery.isLoading || patientsQuery.isLoading ? (
              <Card padding="md">
                <p className="text-sm text-muted">Calcul en cours…</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total remboursé"
                  value={
                    financeQuery.data
                      ? formatCurrency(financeQuery.data.totalRembourse)
                      : "—"
                  }
                  subtitle={`${financeQuery.data?.patientsCount ?? 0} patient(s)`}
                />
                <StatCard
                  title="Nombre de remboursements"
                  value={financeQuery.data?.nombre ?? "—"}
                />
                <StatCard
                  title="Moyenne / remboursement"
                  value={
                    financeQuery.data
                      ? formatCurrency(financeQuery.data.moyenne)
                      : "—"
                  }
                />
              </div>
            )}
          </div>
        )}

        {section === "modifier" && (
          <Card title="Modifier" padding="lg">
            <UserForm
              variant="medecin"
              mode="edit"
              defaultValues={{
                nom: medecin.nom,
                prenom: medecin.prenom,
                numeroRPPS: medecin.numeroRPPS,
                specialite: medecin.specialite,
                specialiteLibelle: medecin.specialiteLibelle,
                estAssure: medecin.estAssure,
                photoUrl: medecin.photoUrl,
              }}
              onSubmit={async (data) => {
                await updateMutation.mutateAsync({
                  nom: data.nom,
                  prenom: data.prenom,
                  telephone: data.telephone,
                  specialite: data.specialite as Specialite,
                  specialiteLibelle: data.specialiteLibelle,
                  estAssure: data.estAssure,
                  photoUrl: data.photoUrl,
                });
              }}
              isSubmitting={updateMutation.isPending}
            />
          </Card>
        )}
      </div>
    </>
  );
}
