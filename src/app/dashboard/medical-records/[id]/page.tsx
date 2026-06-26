"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Badge } from "@/components/common/Badge";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Spinner } from "@/components/common/Spinner";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  medicalRecordUpdateSchema,
  type MedicalRecordUpdateFormValues,
} from "@/lib/validators";
import { Role } from "@/types/enums";
import type { MedicalRecord } from "@/types";

export default function MedicalRecordDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["medical-record", params.id],
    queryFn: async () => {
      const { data } = await api.get<MedicalRecord>(
        `${apiConfig.endpoints.medicalRecords}/record/${params.id}`
      );
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalRecordUpdateFormValues>({
    resolver: zodResolver(medicalRecordUpdateSchema),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: MedicalRecordUpdateFormValues) => {
      const { data } = await api.put<MedicalRecord>(
        `${apiConfig.endpoints.medicalRecords}/${params.id}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      success("Feuille de maladie mise à jour");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["medical-record", params.id] });
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

  if (!record) {
    return (
      <>
        <Header title="Feuille introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.medicalRecords}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  const startEdit = () => {
    reset({ nomMaladie: record.nomMaladie, date: record.date?.slice(0, 10) });
    setIsEditing(true);
  };

  return (
    <>
      <Header
        title={record.nomMaladie}
        breadcrumbs={[
          { label: "Feuilles de maladie", href: routes.dashboard.medicalRecords },
          { label: "Détail" },
        ]}
        actions={
          !record.estRemboursee && (
            <RoleGuard roles={[Role.MEDECIN, Role.ASSUREUR, Role.ADMIN]}>
              <Button variant="secondary" onClick={startEdit} disabled={isEditing}>
                Modifier
              </Button>
            </RoleGuard>
          )
        }
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          {isEditing ? (
            <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
              <Input label="Nom de la maladie" error={errors.nomMaladie?.message} {...register("nomMaladie")} />
              <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
              <div className="flex gap-2">
                <Button type="submit" isLoading={updateMutation.isPending}>Enregistrer</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Annuler</Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted">Maladie</dt>
                <dd className="text-lg font-medium">{record.nomMaladie}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Date</dt>
                <dd>{formatDate(record.date)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Statut remboursement</dt>
                <dd>
                  <Badge variant={record.estRemboursee ? "success" : "warning"}>
                    {record.estRemboursee ? "Remboursée" : "Non remboursée"}
                  </Badge>
                </dd>
              </div>
              {record.montantRembourse != null && (
                <div>
                  <dt className="text-sm text-muted">Montant remboursé</dt>
                  <dd>{formatCurrency(record.montantRembourse)}</dd>
                </div>
              )}
              <div>
                <Link
                  href={routes.dashboard.consultationDetail(record.consultationId)}
                  className="text-primary hover:underline"
                >
                  Voir la consultation associée
                </Link>
              </div>
            </dl>
          )}
        </Card>
      </div>
    </>
  );
}
