"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Badge } from "@/components/common/Badge";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Spinner } from "@/components/common/Spinner";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import {
  formatDateTime,
  formatTypeConsultation,
} from "@/lib/formatters";
import { Role, TypeConsultation } from "@/types/enums";
import type { Consultation, ConsultationUpdateRequest } from "@/types";

export default function ConsultationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelMotif, setCancelMotif] = useState("");

  const { data: consultation, isLoading } = useQuery({
    queryKey: ["consultation", params.id],
    queryFn: async () => {
      const { data } = await api.get<Consultation>(
        `${apiConfig.endpoints.consultations}/${params.id}`
      );
      return data;
    },
  });

  const [editForm, setEditForm] = useState<ConsultationUpdateRequest>({});

  const updateMutation = useMutation({
    mutationFn: async (payload: ConsultationUpdateRequest) => {
      const { data } = await api.put<Consultation>(
        `${apiConfig.endpoints.consultations}/${params.id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      success("Consultation mise à jour");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["consultation", params.id] });
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`${apiConfig.endpoints.consultations}/${params.id}`, {
        data: { motifAnnulation: cancelMotif, notifyPatient: true },
      });
    },
    onSuccess: () => {
      success("Consultation annulée");
      router.push(routes.dashboard.consultations);
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement de la consultation" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <>
        <Header title="Consultation introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.consultations}>
            <Button variant="secondary">Retour à la liste</Button>
          </Link>
        </div>
      </>
    );
  }

  const startEdit = () => {
    setEditForm({
      dateConsultation: consultation.dateConsultation,
      typeConsultation: consultation.typeConsultation,
      diagnostique: consultation.diagnostique,
      motif: consultation.motif,
      notes: consultation.notes,
    });
    setIsEditing(true);
  };

  return (
    <>
      <Header
        title={`Consultation — ${consultation.assureNom ?? "Patient"}`}
        breadcrumbs={[
          { label: "Consultations", href: routes.dashboard.consultations },
          { label: "Détail" },
        ]}
        actions={
          <RoleGuard roles={[Role.MEDECIN]}>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button variant="secondary" onClick={startEdit}>Modifier</Button>
                  <Button variant="danger" onClick={() => setShowCancel(true)}>Annuler</Button>
                </>
              )}
              <Link href={routes.dashboard.prescriptionNew + `?consultationId=${consultation.id}`}>
                <Button variant="accent">Prescrire</Button>
              </Link>
            </div>
          </RoleGuard>
        }
      />
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Card padding="lg">
          {isEditing ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate({
                  ...editForm,
                  dateConsultation: editForm.dateConsultation
                    ? new Date(editForm.dateConsultation).toISOString()
                    : undefined,
                });
              }}
            >
              <Input
                label="Date"
                type="datetime-local"
                value={editForm.dateConsultation?.slice(0, 16) ?? ""}
                onChange={(e) => setEditForm({ ...editForm, dateConsultation: e.target.value })}
              />
              <Select
                label="Type"
                options={[
                  { value: TypeConsultation.GENERALISTE, label: "Généraliste" },
                  { value: TypeConsultation.SPECIALISTE, label: "Spécialiste" },
                ]}
                value={editForm.typeConsultation ?? ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    typeConsultation: e.target.value as TypeConsultation,
                  })
                }
                placeholder=""
              />
              <Input
                label="Diagnostic"
                value={editForm.diagnostique ?? ""}
                onChange={(e) => setEditForm({ ...editForm, diagnostique: e.target.value })}
              />
              <Input
                label="Motif"
                value={editForm.motif ?? ""}
                onChange={(e) => setEditForm({ ...editForm, motif: e.target.value })}
              />
              <div className="flex gap-2">
                <Button type="submit" isLoading={updateMutation.isPending}>Enregistrer</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
              </div>
            </form>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Patient</dt>
                <dd className="font-medium">{consultation.assureNom ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Médecin</dt>
                <dd>{consultation.medecinNom ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Date</dt>
                <dd>{formatDateTime(consultation.dateConsultation)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Type</dt>
                <dd>
                  <Badge variant="outline">
                    {formatTypeConsultation(consultation.typeConsultation)}
                  </Badge>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Diagnostic</dt>
                <dd>{consultation.diagnostique ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Motif</dt>
                <dd>{consultation.motif ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Notes</dt>
                <dd>{consultation.notes ?? "—"}</dd>
              </div>
              {consultation.medicalRecordId && (
                <div className="sm:col-span-2">
                  <Link
                    href={routes.dashboard.medicalRecordDetail(consultation.medicalRecordId)}
                    className="text-primary hover:underline"
                  >
                    Voir la feuille de maladie
                  </Link>
                </div>
              )}
            </dl>
          )}
        </Card>

        {showCancel && (
          <Card title="Annuler la consultation" padding="md">
            <div className="space-y-4">
              <Input
                label="Motif d'annulation"
                value={cancelMotif}
                onChange={(e) => setCancelMotif(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  isLoading={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate()}
                >
                  Confirmer l&apos;annulation
                </Button>
                <Button variant="ghost" onClick={() => setShowCancel(false)}>Retour</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
