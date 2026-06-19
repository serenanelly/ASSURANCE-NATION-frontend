"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Table, type TableColumn } from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import { formatPrescriptionType } from "@/lib/formatters";
import { routes } from "@/config/routes";
import type { Prescription } from "@/types";
import type { TablePageable } from "@/components/common/Table";
import { PrescriptionType } from "@/types/enums";

interface PrescriptionsTableProps {
  data: Prescription[];
  isLoading?: boolean;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
}

export function PrescriptionsTable({
  data,
  isLoading,
  pageable,
  onPageChange,
}: PrescriptionsTableProps) {
  const columns: TableColumn<Prescription>[] = [
    {
      id: "type",
      label: "Type",
      render: (row) => (
        <Badge variant={row.type === PrescriptionType.MEDICAMENT ? "primary" : "accent"}>
          {formatPrescriptionType(row.type)}
        </Badge>
      ),
    },
    {
      id: "medicament",
      label: "Détail",
      render: (row) =>
        row.type === PrescriptionType.MEDICAMENT
          ? `${row.medicament ?? "—"} — ${row.posologie ?? ""}`
          : row.motif ?? "—",
    },
    {
      id: "duree",
      label: "Durée",
      render: (row) => (row.duree ? `${row.duree} jours` : "—"),
    },
    {
      id: "consultationId",
      label: "Consultation",
      render: (row) => (
        <Link
          href={routes.dashboard.consultationDetail(row.consultationId)}
          className="text-primary hover:underline"
        >
          Voir
        </Link>
      ),
    },
    {
      id: "actions",
      label: "",
      className: "w-16",
      render: (row) => (
        <Link
          href={routes.dashboard.prescriptionDetail(row.id)}
          className="inline-flex items-center text-primary hover:text-navy"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucune prescription trouvée"
      pageable={pageable}
      onPageChange={onPageChange}
      getRowKey={(row) => row.id}
    />
  );
}
