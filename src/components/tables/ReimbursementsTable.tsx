"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Table, type TableColumn } from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import {
  formatCurrency,
  formatDate,
  formatReimbursementStatus,
  getReimbursementStatusVariant,
} from "@/lib/formatters";
import { routes } from "@/config/routes";
import type { Reimbursement } from "@/types";
import type { TablePageable } from "@/components/common/Table";

interface ReimbursementsTableProps {
  data: Reimbursement[];
  isLoading?: boolean;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
  actions?: (row: Reimbursement) => React.ReactNode;
}

export function ReimbursementsTable({
  data,
  isLoading,
  pageable,
  onPageChange,
  actions,
}: ReimbursementsTableProps) {
  const columns: TableColumn<Reimbursement>[] = [
    {
      id: "numRemboursement",
      label: "N° remboursement",
      render: (row) => (
        <span className="font-medium">{row.numRemboursement}</span>
      ),
    },
    {
      id: "assureNom",
      label: "Assuré",
      render: (row) => row.assureNom ?? "—",
    },
    {
      id: "montantTotal",
      label: "Montant total",
      render: (row) => formatCurrency(row.montantTotal),
    },
    {
      id: "montantRembourse",
      label: "Remboursé",
      render: (row) => formatCurrency(row.montantRembourse),
    },
    {
      id: "status",
      label: "Statut",
      render: (row) => (
        <Badge variant={getReimbursementStatusVariant(row.status)}>
          {formatReimbursementStatus(row.status)}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => formatDate(row.createdAt ?? row.dateRemboursement),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={routes.dashboard.reimbursementDetail(row.id)}
            className="inline-flex items-center text-primary hover:text-navy"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {actions?.(row)}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucun remboursement trouvé"
      pageable={pageable}
      onPageChange={onPageChange}
      getRowKey={(row) => row.id}
    />
  );
}
