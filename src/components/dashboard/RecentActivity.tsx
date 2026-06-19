"use client";

import Link from "next/link";
import {
  Calendar,
  FileText,
  Receipt,
  Stethoscope,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import {
  formatCurrency,
  formatDateTime,
  formatReimbursementStatus,
  getReimbursementStatusVariant,
} from "@/lib/formatters";
import { routes } from "@/config/routes";
import type { Consultation, Reimbursement } from "@/types";
import { ReimbursementStatus } from "@/types/enums";

export interface ActivityItem {
  id: string;
  type: "consultation" | "reimbursement" | "prescription";
  title: string;
  subtitle?: string;
  date: string;
  status?: ReimbursementStatus;
  href?: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

const iconMap = {
  consultation: Stethoscope,
  reimbursement: Receipt,
  prescription: FileText,
};

function buildFromConsultations(consultations: Consultation[]): ActivityItem[] {
  return consultations.slice(0, 5).map((c) => ({
    id: c.id,
    type: "consultation" as const,
    title: `Consultation — ${c.assureNom ?? "Patient"}`,
    subtitle: c.diagnostique ?? c.motif,
    date: c.dateConsultation,
    href: routes.dashboard.consultationDetail(c.id),
  }));
}

function buildFromReimbursements(reimbursements: Reimbursement[]): ActivityItem[] {
  return reimbursements.slice(0, 5).map((r) => ({
    id: r.id,
    type: "reimbursement" as const,
    title: `Remboursement ${r.numRemboursement}`,
    subtitle: formatCurrency(r.montantRembourse ?? r.montantTotal),
    date: r.createdAt ?? r.dateRemboursement ?? "",
    status: r.status,
    href: routes.dashboard.reimbursementDetail(r.id),
  }));
}

export function RecentActivity({ items, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card title="Activité récente" padding="md">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Activité récente" padding="md">
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">Aucune activité récente</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item) => {
            const Icon = iconMap[item.type] ?? Calendar;
            const content = (
              <div className="flex items-start gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="truncate text-xs text-muted">{item.subtitle}</p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    {formatDateTime(item.date)}
                  </p>
                </div>
                {item.status && (
                  <Badge variant={getReimbursementStatusVariant(item.status)} size="sm">
                    {formatReimbursementStatus(item.status)}
                  </Badge>
                )}
              </div>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className="block transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

RecentActivity.fromConsultations = buildFromConsultations;
RecentActivity.fromReimbursements = buildFromReimbursements;
