"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PrescriptionForm } from "@/components/forms/PrescriptionForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { routes } from "@/config/routes";
import { Role } from "@/types/enums";
import type { Prescription, PrescriptionCreateRequest } from "@/types";
import type { PrescriptionCreateFormValues } from "@/lib/validators";

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultationId");
  const { success, error: notifyError } = useNotification();

  const mutation = useMutation({
    mutationFn: async (values: PrescriptionCreateFormValues) => {
      const payload: PrescriptionCreateRequest = {
        ...values,
        duree: values.duree?.toString(),
      };
      const { data } = await api.post<Prescription>(
        `/consultations/${consultationId}/prescriptions`,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      success("Prescription créée avec succès");
      router.push(routes.dashboard.prescriptionDetail(data.id));
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  if (!consultationId) {
    return (
      <>
        <Header title="Consultation requise" />
        <div className="p-6 text-muted">
          Veuillez sélectionner une consultation pour créer une prescription.
        </div>
      </>
    );
  }

  return (
    <RoleGuard
      roles={[Role.MEDECIN]}
      fallback={
        <>
          <Header title="Accès refusé" />
          <div className="p-6 text-muted">Seuls les médecins peuvent prescrire.</div>
        </>
      }
    >
      <Header
        title="Nouvelle prescription"
        breadcrumbs={[
          { label: "Prescriptions", href: routes.dashboard.prescriptions },
          { label: "Nouvelle" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <PrescriptionForm
            onSubmit={(data) => mutation.mutateAsync(data)}
            isSubmitting={mutation.isPending}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
