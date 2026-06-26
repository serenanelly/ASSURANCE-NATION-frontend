"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Stethoscope } from "@/components/icons";
import { Avatar } from "@/components/common/Avatar";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/common/Spinner";
import { StatCard } from "@/components/dashboard/StatCard";
import { MedicalRecordsTable } from "@/components/tables/MedicalRecordsTable";
import { ReimbursementsTable } from "@/components/tables/ReimbursementsTable";
import { UserForm } from "@/components/forms/UserForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { buildQueryString, getInitials } from "@/lib/utils";
import { formatCurrency, formatDate, formatSpecialite } from "@/lib/formatters";
import { cn } from "@/utils/cn";
import type { Assure, Medecin, MedicalRecord } from "@/types";
import type { PageResponse } from "@/types/api";
import type { ReimbursementListResponse } from "@/types/reimbursement";

type SectionId = "infos" | "medecin" | "financier" | "feuilles" | "modifier";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "infos", label: "Informations" },
  { id: "medecin", label: "Médecin traitant" },
  { id: "financier", label: "Financier" },
  { id: "feuilles", label: "Feuilles de maladie" },
  { id: "modifier", label: "Modifier" },
];

export default function AssureDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();
  const [section, setSection] = useState<SectionId>("infos");

  const { data: assure, isLoading } = useQuery({
    queryKey: ["assure", params.id],
    queryFn: async () => {
      const { data } = await api.get<Assure>(
        `${apiConfig.endpoints.assures}/${params.id}`
      );
      return data;
    },
  });

  // Médecin traitant
  const medecinQuery = useQuery({
    queryKey: ["medecin", assure?.medecinTraitantId],
    enabled: Boolean(assure?.medecinTraitantId),
    queryFn: async () => {
      const { data } = await api.get<Medecin>(
        `${apiConfig.endpoints.medecins}/${assure!.medecinTraitantId}`
      );
      return data;
    },
  });

  // Feuilles de maladie
  const recordsQuery = useQuery({
    queryKey: ["assure-records", params.id],
    enabled: Boolean(params.id),
    queryFn: async () => {
      const { data } = await api.get<PageResponse<MedicalRecord>>(
        `${apiConfig.endpoints.medicalRecords}/${params.id}${buildQueryString({
          page: 0,
          size: 50,
        })}`
      );
      return data.content ?? [];
    },
  });

  // Remboursements (financier)
  const reimbursementsQuery = useQuery({
    queryKey: ["assure-reimbursements", params.id],
    enabled: Boolean(params.id),
    queryFn: async () => {
      const { data } = await api.get<ReimbursementListResponse>(
        `${apiConfig.endpoints.reimbursements}${buildQueryString({
          assureId: params.id,
          page: 0,
          size: 50,
        })}`
      );
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: {
      nom: string;
      prenom: string;
      emploi?: string;
      photoUrl?: string;
    }) => {
      const { data } = await api.put<Assure>(
        `${apiConfig.endpoints.assures}/${params.id}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      success("Assuré mis à jour");
      queryClient.invalidateQueries({ queryKey: ["assure", params.id] });
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

  if (!assure) {
    return (
      <>
        <Header title="Assuré introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.usersAssures}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  const stats = reimbursementsQuery.data?.statistics;
  const reimbursements = reimbursementsQuery.data?.content ?? [];

  return (
    <>
      <Header
        title={`${assure.prenom} ${assure.nom}`}
        breadcrumbs={[
          { label: "Assurés", href: routes.dashboard.usersAssures },
          { label: "Détail" },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Summary header */}
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <Avatar
              photoUrl={assure.photoUrl}
              initials={getInitials(assure.nom, assure.prenom)}
              className="h-16 w-16 text-xl"
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-foreground">
                {assure.prenom} {assure.nom}
              </h2>
              <p className="truncate text-sm text-muted">{assure.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={assure.estActif ? "success" : "warning"}>
                  {assure.estActif ? "Actif" : "Inactif"}
                </Badge>
                <span className="font-mono text-xs text-muted">
                  {assure.numSecuriteSociale}
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
                <dd>{assure.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">N° sécurité sociale</dt>
                <dd className="font-mono">{assure.numSecuriteSociale}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Statut</dt>
                <dd>
                  <Badge variant={assure.estActif ? "success" : "warning"}>
                    {assure.estActif ? "Actif" : "Inactif"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Date d&apos;affiliation</dt>
                <dd>{formatDate(assure.dateAffiliation)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Emploi</dt>
                <dd>{assure.emploi ?? "—"}</dd>
              </div>
            </dl>
          </Card>
        )}

        {section === "medecin" && (
          <Card title="Médecin traitant" padding="lg">
            {!assure.medecinTraitantId ? (
              <p className="text-sm text-muted">Aucun médecin traitant assigné.</p>
            ) : medecinQuery.isLoading ? (
              <p className="text-sm text-muted">Chargement…</p>
            ) : medecinQuery.data ? (
              <Link
                href={routes.dashboard.usersMedecinDetail(medecinQuery.data.id)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-primary/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">
                      Dr. {medecinQuery.data.prenom} {medecinQuery.data.nom}
                    </p>
                    <p className="text-sm text-muted">
                      {formatSpecialite(medecinQuery.data.specialite)} · RPPS{" "}
                      {medecinQuery.data.numeroRPPS}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ) : (
              <p className="text-sm text-error">Médecin introuvable</p>
            )}
          </Card>
        )}

        {section === "financier" &&
          (reimbursementsQuery.isError ? (
            <Card padding="md">
              <p className="text-sm text-muted">
                Données financières indisponibles.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  title="Total remboursé"
                  value={stats ? formatCurrency(stats.totalRembourses) : "—"}
                />
                <StatCard
                  title="Nombre de remboursements"
                  value={stats?.nombreRemboursements ?? "—"}
                />
                <StatCard
                  title="Moyenne / remboursement"
                  value={stats ? formatCurrency(stats.moyenneParRemboursement) : "—"}
                />
              </div>
              <ReimbursementsTable
                data={reimbursements}
                isLoading={reimbursementsQuery.isLoading}
              />
            </div>
          ))}

        {section === "feuilles" && (
          <MedicalRecordsTable
            data={recordsQuery.data ?? []}
            isLoading={recordsQuery.isLoading}
          />
        )}

        {section === "modifier" && (
          <Card title="Modifier" padding="lg">
            <UserForm
              variant="assure"
              mode="edit"
              defaultValues={{
                nom: assure.nom,
                prenom: assure.prenom,
                emploi: assure.emploi,
                photoUrl: assure.photoUrl,
              }}
              onSubmit={async (data) => {
                await updateMutation.mutateAsync({
                  nom: data.nom,
                  prenom: data.prenom,
                  emploi: data.emploi,
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
