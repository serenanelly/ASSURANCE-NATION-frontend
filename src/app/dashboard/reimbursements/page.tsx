"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ReimbursementsTable } from "@/components/tables/ReimbursementsTable";
import { RejectReimbursementModal } from "@/components/modals/RejectReimbursementModal";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { formatCurrency } from "@/lib/formatters";
import { buildQueryString } from "@/lib/utils";
import { Role, ReimbursementStatus } from "@/types/enums";
import type { Reimbursement, ReimbursementListResponse } from "@/types";

const TAB_ITEMS = [
  { id: "ALL", label: "Tous" },
  { id: ReimbursementStatus.PENDING, label: "En attente" },
  { id: ReimbursementStatus.APPROVED, label: "Approuvés" },
  { id: ReimbursementStatus.REJECTED, label: "Rejetés" },
  { id: ReimbursementStatus.PAID, label: "Payés" },
];

export default function ReimbursementsPage() {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("ALL");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();

  const statusFilter = activeTab === "ALL" ? undefined : (activeTab as ReimbursementStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["reimbursements", page, statusFilter],
    queryFn: async () => {
      const { data: response } = await api.get<ReimbursementListResponse>(
        `${apiConfig.endpoints.reimbursements}${buildQueryString({
          page,
          size: 20,
          status: statusFilter,
        })}`
      );
      return response;
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["reimbursements"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`${apiConfig.endpoints.reimbursements}/${id}/approve`),
    onSuccess: () => { success("Remboursement approuvé"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => api.post(`${apiConfig.endpoints.reimbursements}/${id}/mark-paid`),
    onSuccess: () => { success("Remboursement marqué comme payé"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      api.post(`${apiConfig.endpoints.reimbursements}/${id}/reject`, { motif }),
    onSuccess: () => { success("Remboursement rejeté"); invalidate(); },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  const renderActions = (row: Reimbursement) => (
    <RoleGuard roles={[Role.ASSUREUR, Role.ADMIN]}>
      <div className="flex gap-1">
        {row.status === ReimbursementStatus.PENDING && (
          <>
            <Button
              size="sm"
              variant="accent"
              onClick={() => approveMutation.mutate(row.id)}
              isLoading={approveMutation.isPending}
            >
              Approuver
            </Button>
            <Button size="sm" variant="danger" onClick={() => setRejectId(row.id)}>
              Rejeter
            </Button>
          </>
        )}
        {row.status === ReimbursementStatus.APPROVED && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => markPaidMutation.mutate(row.id)}
            isLoading={markPaidMutation.isPending}
          >
            Marquer payé
          </Button>
        )}
      </div>
    </RoleGuard>
  );

  const stats = data?.statistics;

  return (
    <>
      <Header
        title="Remboursements"
        breadcrumbs={[{ label: "Remboursements" }]}
        actions={
          <RoleGuard roles={[Role.ASSUREUR, Role.ADMIN]}>
            <Link href={routes.dashboard.reimbursementNew}>
              <Button icon={<Plus className="h-4 w-4" />}>Nouveau remboursement</Button>
            </Link>
          </RoleGuard>
        }
      />
      <div className="space-y-6 p-6">
        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Total remboursé" value={formatCurrency(stats.totalRembourses)} />
            <StatCard title="Nombre" value={stats.nombreRemboursements} />
            <StatCard title="Moyenne" value={formatCurrency(stats.moyenneParRemboursement)} />
          </div>
        )}

        <Tabs items={TAB_ITEMS} activeId={activeTab} onChange={(id) => { setActiveTab(id); setPage(0); }} />

        <ReimbursementsTable
          data={data?.content ?? []}
          isLoading={isLoading}
          pageable={
            data
              ? {
                  page: data.page,
                  size: data.size,
                  totalElements: data.totalElements,
                  totalPages: data.totalPages,
                }
              : undefined
          }
          onPageChange={setPage}
          actions={renderActions}
        />
      </div>

      <RejectReimbursementModal
        isOpen={Boolean(rejectId)}
        onClose={() => setRejectId(null)}
        isSubmitting={rejectMutation.isPending}
        onConfirm={async (motif) => {
          if (rejectId) await rejectMutation.mutateAsync({ id: rejectId, motif });
        }}
      />
    </>
  );
}
