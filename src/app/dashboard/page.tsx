"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  Receipt,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { Header } from "@/components/common/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ReimbursementChart } from "@/components/dashboard/ReimbursementChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card } from "@/components/common/Card";
import { Spinner } from "@/components/common/Spinner";
import { useAuth } from "@/context/AuthContext";
import { hasRole } from "@/lib/utils";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { formatCurrency } from "@/lib/formatters";
import { Role, ReimbursementStatus } from "@/types/enums";
import type {
  Consultation,
  ReimbursementDashboard,
  ReimbursementListResponse,
} from "@/types";
import { isToday, parseISO } from "date-fns";
import { buildQueryString } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAssureur = hasRole(user, Role.ASSUREUR) || hasRole(user, Role.ADMIN);
  const isMedecin = hasRole(user, Role.MEDECIN);
  const isPatient = hasRole(user, Role.PATIENT);

  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["reimbursements-dashboard"],
    queryFn: async () => {
      const { data } = await api.get<ReimbursementDashboard>(
        apiConfig.endpoints.reimbursementsDashboard
      );
      return data;
    },
    enabled: isAssureur,
  });

  const { data: consultations = [], isLoading: consultationsLoading } =
    useQuery({
      queryKey: ["consultations-dashboard"],
      queryFn: async () => {
        const { data } = await api.get<Consultation[]>(
          `${apiConfig.endpoints.consultations}${buildQueryString({ page: 0, size: 50 })}`
        );
        return data;
      },
      enabled: isMedecin || isPatient,
    });

  const { data: reimbursementsData, isLoading: reimbursementsLoading } =
    useQuery({
      queryKey: ["reimbursements-patient-dashboard"],
      queryFn: async () => {
        const { data } = await api.get<ReimbursementListResponse>(
          `${apiConfig.endpoints.reimbursements}${buildQueryString({ page: 0, size: 10 })}`
        );
        return data;
      },
      enabled: isPatient,
    });

  const todayConsultations = useMemo(
    () =>
      consultations.filter((c) => {
        try {
          return isToday(parseISO(c.dateConsultation));
        } catch {
          return false;
        }
      }),
    [consultations]
  );

  const patientStats = useMemo(() => {
    const items = reimbursementsData?.content ?? [];
    return {
      total: items.length,
      pending: items.filter((r) => r.status === ReimbursementStatus.PENDING).length,
      paid: items.filter((r) => r.status === ReimbursementStatus.PAID).length,
    };
  }, [reimbursementsData]);

  const activityItems = useMemo(() => {
    if (isAssureur && dashboard) {
      return [];
    }
    if (isMedecin) {
      return RecentActivity.fromConsultations(consultations);
    }
    if (isPatient && reimbursementsData?.content) {
      return RecentActivity.fromReimbursements(reimbursementsData.content);
    }
    return [];
  }, [isAssureur, isMedecin, isPatient, dashboard, consultations, reimbursementsData]);

  const isLoading =
    (isAssureur && dashboardLoading) ||
    ((isMedecin || isPatient) && consultationsLoading) ||
    (isPatient && reimbursementsLoading);

  return (
    <>
      <Header title="Tableau de bord" />
      <div className="space-y-6 p-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner label="Chargement du tableau de bord" />
          </div>
        ) : (
          <>
            {isAssureur && dashboard && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Total remboursements"
                    value={dashboard.totalRemboursements}
                    icon={<Receipt className="h-6 w-6" />}
                  />
                  <StatCard
                    title="Montants totaux"
                    value={formatCurrency(dashboard.totalMontants)}
                    icon={<TrendingUp className="h-6 w-6" />}
                  />
                  <StatCard
                    title="En attente"
                    value={dashboard.pendingCount}
                    icon={<Clock className="h-6 w-6" />}
                  />
                  <StatCard
                    title="Montant payé"
                    value={formatCurrency(dashboard.montantTotalPaye)}
                    icon={<Users className="h-6 w-6" />}
                  />
                </div>
                <ReimbursementChart
                  monthlyData={dashboard.rembourseParMois}
                  specialtyData={dashboard.rembourseParSpecialite}
                />
              </>
            )}

            {isMedecin && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  title="Consultations aujourd'hui"
                  value={todayConsultations.length}
                  icon={<Calendar className="h-6 w-6" />}
                />
                <StatCard
                  title="Total consultations"
                  value={consultations.length}
                  icon={<Stethoscope className="h-6 w-6" />}
                />
              </div>
            )}

            {isPatient && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                  title="Mes consultations"
                  value={consultations.length}
                  icon={<Stethoscope className="h-6 w-6" />}
                />
                <StatCard
                  title="Remboursements en attente"
                  value={patientStats.pending}
                  icon={<Clock className="h-6 w-6" />}
                />
                <StatCard
                  title="Remboursements payés"
                  value={patientStats.paid}
                  icon={<Receipt className="h-6 w-6" />}
                />
              </div>
            )}

            {isMedecin && todayConsultations.length > 0 && (
              <Card title="Consultations du jour" padding="md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {todayConsultations.map((c) => (
                    <li key={c.id} className="py-3 text-sm">
                      <span className="font-medium">{c.assureNom}</span>
                      <span className="text-muted"> — {c.motif ?? c.diagnostique ?? "Sans motif"}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {!isAssureur && (
              <RecentActivity items={activityItems} isLoading={isLoading} />
            )}
          </>
        )}
      </div>
    </>
  );
}
