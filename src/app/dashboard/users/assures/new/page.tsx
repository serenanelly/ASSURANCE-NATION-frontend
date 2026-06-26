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
import type { Assure, RegisterAssureRequest } from "@/types";
import type { RegisterAssureFormValues } from "@/lib/validators";

export default function NewAssurePage() {
  const router = useRouter();
  const { success, error: notifyError } = useNotification();

  const mutation = useMutation({
    mutationFn: async (values: RegisterAssureFormValues) => {
      // confirmPassword is client-side only — the backend DTO rejects unknown fields.
      const payload: RegisterAssureRequest = {
        email: values.email,
        password: values.password,
        nom: values.nom,
        prenom: values.prenom,
        numSecuriteSociale: values.numSecuriteSociale,
        dateAffiliation: values.dateAffiliation,
        emploi: values.emploi,
        medecinTraitantId: values.medecinTraitantId || undefined,
        photoUrl: values.photoUrl,
      };
      const { data } = await api.post<Assure>(apiConfig.endpoints.assures, payload);
      return data;
    },
    onSuccess: (data) => {
      success("Assuré créé avec succès");
      router.push(routes.dashboard.usersAssureDetail(data.id));
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
        title="Nouvel assuré"
        breadcrumbs={[
          { label: "Assurés", href: routes.dashboard.usersAssures },
          { label: "Nouveau" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <UserForm
            variant="assure"
            mode="create"
            onSubmit={(data) =>
              mutation.mutateAsync(data as RegisterAssureFormValues).catch(() => {})
            }
            isSubmitting={mutation.isPending}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
