"use client";

import Link from "next/link";
import { Eye, Pencil } from "@/components/icons";
import { Table, type TableColumn } from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import type { TablePageable } from "@/components/common/Table";

export interface UserTableRow {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  extra?: string;
  status?: { label: string; variant: "success" | "warning" | "default" };
  detailHref: string;
  editHref?: string;
}

interface UsersTableProps {
  data: UserTableRow[];
  isLoading?: boolean;
  pageable?: TablePageable;
  onPageChange?: (page: number) => void;
  extraColumnLabel?: string;
}

export function UsersTable({
  data,
  isLoading,
  pageable,
  onPageChange,
  extraColumnLabel = "Info",
}: UsersTableProps) {
  const columns: TableColumn<UserTableRow>[] = [
    {
      id: "nom",
      label: "Nom",
      render: (row) => `${row.prenom} ${row.nom}`,
    },
    {
      id: "email",
      label: "Email",
      render: (row) => row.email,
    },
    {
      id: "extra",
      label: extraColumnLabel,
      render: (row) => row.extra ?? "—",
    },
    {
      id: "status",
      label: "Statut",
      render: (row) =>
        row.status ? (
          <Badge variant={row.status.variant}>{row.status.label}</Badge>
        ) : (
          "—"
        ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={row.detailHref}
            className="inline-flex items-center text-primary hover:text-navy"
          >
            <Eye className="h-4 w-4" />
          </Link>
          {row.editHref && (
            <Link
              href={row.editHref}
              className="inline-flex items-center text-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      isLoading={isLoading}
      emptyMessage="Aucun utilisateur trouvé"
      pageable={pageable}
      onPageChange={onPageChange}
      getRowKey={(row) => row.id}
    />
  );
}
