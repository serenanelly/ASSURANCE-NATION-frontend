"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { UserForm } from "@/components/forms/UserForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { Role } from "@/types/enums";
import type { Medecin, RegisterMedecinRequest } from "@/types";
import type { RegisterMedecinFormValues } from "@/lib/validators";

export default function NewMedecinPage() {
  const router = useRouter();
  const { success, error: notifyError } = useNotification();

  const mutation = useMutation({
    mutationFn: async (values: RegisterMedecinFormValues) => {
      // confirmPassword is client-side only — the backend DTO rejects unknown fields.
      const payload: RegisterMedecinRequest = {
        email: values.email,
        password: values.password,
        nom: values.nom,
        prenom: values.prenom,
        numeroRPPS: values.numeroRPPS,
        specialite: values.specialite,
        specialiteLibelle: values.specialiteLibelle,
        telephone: values.telephone,
        estAssure: values.estAssure ?? false,
      };
      const { data } = await api.post<Medecin>(apiConfig.endpoints.medecins, payload);
      return data;
    },
    onSuccess: (data) => {
      success("Médecin créé avec succès");
      router.push(routes.dashboard.usersMedecinDetail(data.id));
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  return (
    <RoleGuard roles={[Role.ASSUREUR, Role.ADMIN]} fallback={
      <>
        <Header title="Accès refusé" />
        <div className="p-6 text-muted">Réservé aux assureurs.</div>
      </>
    }>
      <Header
        title="Nouveau médecin"
        breadcrumbs={[
          { label: "Médecins", href: routes.dashboard.usersMedecins },
          { label: "Nouveau" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <UserForm
            variant="medecin"
            mode="create"
            onSubmit={(data) =>
              mutation.mutateAsync(data as RegisterMedecinFormValues).catch(() => {})
            }
            isSubmitting={mutation.isPending}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
