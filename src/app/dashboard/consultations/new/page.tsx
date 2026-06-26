"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { Role } from "@/types/enums";
import type { Consultation, ConsultationCreateRequest } from "@/types";
import type { ConsultationCreateFormValues } from "@/lib/validators";

export default function NewConsultationPage() {
  const router = useRouter();
  const { success, error: notifyError } = useNotification();

  const mutation = useMutation({
    mutationFn: async (values: ConsultationCreateFormValues) => {
      const payload: ConsultationCreateRequest = {
        ...values,
        dateConsultation: new Date(values.dateConsultation).toISOString(),
      };
      const { data } = await api.post<Consultation>(
        apiConfig.endpoints.consultations,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      success("Consultation créée avec succès");
      router.push(routes.dashboard.consultationDetail(data.id));
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  return (
    <RoleGuard roles={[Role.MEDECIN]} fallback={
      <>
        <Header title="Accès refusé" breadcrumbs={[{ label: "Consultations", href: routes.dashboard.consultations }, { label: "Nouvelle" }]} />
        <div className="p-6"><p className="text-muted">Seuls les médecins peuvent créer des consultations.</p></div>
      </>
    }>
      <Header
        title="Nouvelle consultation"
        breadcrumbs={[
          { label: "Consultations", href: routes.dashboard.consultations },
          { label: "Nouvelle" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <ConsultationForm
            onSubmit={(data) => mutation.mutateAsync(data)}
            isSubmitting={mutation.isPending}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
