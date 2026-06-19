"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Clock, CheckCircle, XCircle, Wallet } from "lucide-react";
import { Header } from "@/components/common/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ReimbursementChart } from "@/components/dashboard/ReimbursementChart";
import { RoleGuard } from "@/components/common/RoleGuard";
import { Spinner } from "@/components/common/Spinner";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { formatCurrency } from "@/lib/formatters";
import { Role } from "@/types/enums";
import type { ReimbursementDashboard } from "@/types";

export default function ReimbursementDashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["reimbursements-dashboard-extended"],
    queryFn: async () => {
      const { data } = await api.get<ReimbursementDashboard>(
        apiConfig.endpoints.reimbursementsDashboard
      );
      return data;
    },
  });

  return (
    <RoleGuard
      roles={[Role.ASSUREUR, Role.ADMIN]}
      fallback={
        <>
          <Header title="Accès refusé" />
          <div className="p-6 text-muted">Statistiques réservées aux assureurs.</div>
        </>
      }
    >
      <Header
        title="Statistiques remboursements"
        breadcrumbs={[
          { label: "Remboursements", href: "/dashboard/reimbursements" },
          { label: "Statistiques" },
        ]}
      />
      <div className="space-y-6 p-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner label="Chargement des statistiques" />
          </div>
        ) : dashboard ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard title="Total" value={dashboard.totalRemboursements} icon={<TrendingUp className="h-6 w-6" />} />
              <StatCard title="En attente" value={dashboard.pendingCount} icon={<Clock className="h-6 w-6" />} />
              <StatCard title="Approuvés" value={dashboard.approvedCount} icon={<CheckCircle className="h-6 w-6" />} />
              <StatCard title="Rejetés" value={dashboard.rejectedCount} icon={<XCircle className="h-6 w-6" />} />
              <StatCard title="Payés" value={dashboard.paidCount} icon={<Wallet className="h-6 w-6" />} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title="Montants totaux" value={formatCurrency(dashboard.totalMontants)} />
              <StatCard title="Montant total payé" value={formatCurrency(dashboard.montantTotalPaye)} />
            </div>
            <ReimbursementChart
              monthlyData={dashboard.rembourseParMois}
              specialtyData={dashboard.rembourseParSpecialite}
            />
          </>
        ) : null}
      </div>
    </RoleGuard>
  );
}
