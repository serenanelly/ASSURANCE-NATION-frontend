"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ReimbursementForm } from "@/components/forms/ReimbursementForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { Role } from "@/types/enums";
import type { Reimbursement, ReimbursementCreateRequest } from "@/types";
import type { ReimbursementCreateFormValues } from "@/lib/validators";

export default function NewReimbursementPage() {
  const router = useRouter();
  const { success, error: notifyError } = useNotification();

  const mutation = useMutation({
    mutationFn: async (values: ReimbursementCreateFormValues) => {
      const payload: ReimbursementCreateRequest = values;
      const { data } = await api.post<Reimbursement>(
        apiConfig.endpoints.reimbursements,
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      success("Remboursement créé avec succès");
      router.push(routes.dashboard.reimbursementDetail(data.id));
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  return (
    <RoleGuard
      roles={[Role.ASSUREUR, Role.ADMIN]}
      fallback={
        <>
          <Header title="Accès refusé" />
          <div className="p-6 text-muted">Seuls les assureurs peuvent créer des remboursements.</div>
        </>
      }
    >
      <Header
        title="Nouveau remboursement"
        breadcrumbs={[
          { label: "Remboursements", href: routes.dashboard.reimbursements },
          { label: "Nouveau" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <ReimbursementForm
            onSubmit={(data) => mutation.mutateAsync(data)}
            isSubmitting={mutation.isPending}
          />
        </Card>
      </div>
    </RoleGuard>
  );
}
