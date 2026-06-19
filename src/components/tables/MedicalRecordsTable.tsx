"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Table, type TableColumn } from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { routes } from "@/config/routes";
import type { MedicalRecord } from "@/types";
import type { TablePageable } from "@/components/common/Table";

interface MedicalRecordsTableProps {
  data: MedicalRecord[];
  isLoading?: boolean;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
}

export function MedicalRecordsTable({
  data,
  isLoading,
  pageable,
  onPageChange,
}: MedicalRecordsTableProps) {
  const columns: TableColumn<MedicalRecord>[] = [
    {
      id: "nomMaladie",
      label: "Maladie",
      render: (row) => row.nomMaladie,
    },
    {
      id: "date",
      label: "Date",
      render: (row) => formatDate(row.date),
    },
    {
      id: "estRemboursee",
      label: "Statut",
      render: (row) => (
        <Badge variant={row.estRemboursee ? "success" : "warning"}>
          {row.estRemboursee ? "Remboursée" : "En cours"}
        </Badge>
      ),
    },
    {
      id: "montantRembourse",
      label: "Montant remboursé",
      render: (row) => formatCurrency(row.montantRembourse),
    },
    {
      id: "actions",
      label: "",
      className: "w-16",
      render: (row) => (
        <Link
          href={routes.dashboard.medicalRecordDetail(row.id)}
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
      emptyMessage="Aucune feuille de maladie trouvée"
      pageable={pageable}
      onPageChange={onPageChange}
      getRowKey={(row) => row.id}
    />
  );
}
