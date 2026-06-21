"use client";

import Link from "next/link";
import { Eye } from "@/components/icons";
import { Table, type TableColumn } from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import {
  formatDateTime,
  formatTypeConsultation,
} from "@/lib/formatters";
import { routes } from "@/config/routes";
import type { Consultation } from "@/types";
import type { TablePageable } from "@/components/common/Table";

interface ConsultationsTableProps {
  data: Consultation[];
  isLoading?: boolean;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
  onRowClick?: (consultation: Consultation) => void;
}

export function ConsultationsTable({
  data,
  isLoading,
  pageable,
  onPageChange,
  onRowClick,
}: ConsultationsTableProps) {
  const columns: TableColumn<Consultation>[] = [
    {
      id: "dateConsultation",
      label: "Date",
      render: (row) => formatDateTime(row.dateConsultation),
    },
    {
      id: "assureNom",
      label: "Patient",
      render: (row) => row.assureNom ?? "—",
    },
    {
      id: "medecinNom",
      label: "Médecin",
      render: (row) => row.medecinNom ?? "—",
    },
    {
      id: "typeConsultation",
      label: "Type",
      render: (row) => (
        <Badge variant="outline">{formatTypeConsultation(row.typeConsultation)}</Badge>
      ),
    },
    {
      id: "diagnostique",
      label: "Diagnostic",
      render: (row) => row.diagnostique ?? row.motif ?? "—",
    },
    {
      id: "actions",
      label: "",
      className: "w-16",
      render: (row) => (
        <Link
          href={routes.dashboard.consultationDetail(row.id)}
          className="inline-flex items-center text-primary hover:text-navy"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Voir</span>
        </Link>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucune consultation trouvée"
      pageable={pageable}
      onPageChange={onPageChange}
      getRowKey={(row) => row.id}
      onRowClick={onRowClick}
      className={onRowClick ? "cursor-pointer" : undefined}
    />
  );
}
