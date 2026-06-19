"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Spinner } from "@/components/common/Spinner";
import { RejectReimbursementModal } from "@/components/modals/RejectReimbursementModal";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import {
  formatCurrency,
  formatDate,
  formatReimbursementStatus,
  getReimbursementStatusVariant,
} from "@/lib/formatters";
import { Role, ReimbursementStatus } from "@/types/enums";
import type { Reimbursement } from "@/types";
import { siteConfig } from "@/config/site";

export default function ReimbursementDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);

  const { data: reimbursement, isLoading } = useQuery({
    queryKey: ["reimbursement", params.id],
    queryFn: async () => {
      const { data } = await api.get<Reimbursement>(
        `${apiConfig.endpoints.reimbursements}/${params.id}`
      );
      return data;
    },
  });

  useEffect(() => {
    if (!siteConfig.features.pdfExport || !params.id) return;

    let objectUrl: string | null = null;

    api
      .get(`${apiConfig.endpoints.reimbursements}/${params.id}/justificatif`, {
        responseType: "blob",
      })
      .then((response) => {
        objectUrl = URL.createObjectURL(response.data);
        setPdfUrl(objectUrl);
      })
      .catch(() => setPdfUrl(null));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [params.id]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reimbursement", params.id] });
  };

  const approveMutation = useMutation({
    mutationFn: () => api.post(`${apiConfig.endpoints.reimbursements}/${params.id}/approve`),
    onSuccess: () => { success("Remboursement approuvé"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const markPaidMutation = useMutation({
    mutationFn: () => api.post(`${apiConfig.endpoints.reimbursements}/${params.id}/mark-paid`),
    onSuccess: () => { success("Remboursement payé"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const rejectMutation = useMutation({
    mutationFn: (motif: string) =>
      api.post(`${apiConfig.endpoints.reimbursements}/${params.id}/reject`, { motif }),
    onSuccess: () => { success("Remboursement rejeté"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement" />
      </div>
    );
  }

  if (!reimbursement) {
    return (
      <>
        <Header title="Remboursement introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.reimbursements}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={`Remboursement ${reimbursement.numRemboursement}`}
        breadcrumbs={[
          { label: "Remboursements", href: routes.dashboard.reimbursements },
          { label: "Détail" },
        ]}
        actions={
          <RoleGuard roles={[Role.ASSUREUR, Role.ADMIN]}>
            <div className="flex gap-2">
              {reimbursement.status === ReimbursementStatus.PENDING && (
                <>
                  <Button variant="accent" onClick={() => approveMutation.mutate()} isLoading={approveMutation.isPending}>
                    Approuver
                  </Button>
                  <Button variant="danger" onClick={() => setShowReject(true)}>Rejeter</Button>
                </>
              )}
              {reimbursement.status === ReimbursementStatus.APPROVED && (
                <Button variant="primary" onClick={() => markPaidMutation.mutate()} isLoading={markPaidMutation.isPending}>
                  Marquer payé
                </Button>
              )}
            </div>
          </RoleGuard>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card padding="lg">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted">Statut</dt>
              <dd>
                <Badge variant={getReimbursementStatusVariant(reimbursement.status)}>
                  {formatReimbursementStatus(reimbursement.status)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Assuré</dt>
              <dd>{reimbursement.assureNom ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Montant total</dt>
              <dd className="text-lg font-semibold">{formatCurrency(reimbursement.montantTotal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Taux</dt>
              <dd>{reimbursement.tauxRemboursement != null ? `${reimbursement.tauxRemboursement}%` : "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Montant remboursé</dt>
              <dd className="text-lg font-semibold text-accent">
                {formatCurrency(reimbursement.montantRembourse)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Date</dt>
              <dd>{formatDate(reimbursement.createdAt ?? reimbursement.dateRemboursement)}</dd>
            </div>
            {reimbursement.notes && (
              <div>
                <dt className="text-sm text-muted">Notes</dt>
                <dd>{reimbursement.notes}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card title="Justificatif PDF" padding="none">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Justificatif de remboursement"
              className="h-[600px] w-full rounded-b-lg"
            />
          ) : (
            <p className="p-6 text-center text-sm text-muted">
              Justificatif non disponible
            </p>
          )}
        </Card>
      </div>

      <RejectReimbursementModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        isSubmitting={rejectMutation.isPending}
        onConfirm={async (motif) => rejectMutation.mutateAsync(motif)}
      />
    </>
  );
}
