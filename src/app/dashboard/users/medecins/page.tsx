"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Tabs } from "@/components/common/Tabs";
import { UsersTable } from "@/components/tables/UsersTable";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { formatSpecialite } from "@/lib/formatters";
import { buildQueryString } from "@/lib/utils";
import type { Medecin } from "@/types";
import type { PageResponse } from "@/types/api";

export default function MedecinsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["medecins", page, search],
    queryFn: async () => {
      const { data: response } = await api.get<PageResponse<Medecin>>(
        `${apiConfig.endpoints.medecins}${buildQueryString({ page, size: 20, search: search || undefined })}`
      );
      return response;
    },
  });

  const rows = (data?.content ?? []).map((medecin) => ({
    id: medecin.id,
    email: medecin.email,
    nom: medecin.nom,
    prenom: medecin.prenom,
    extra: `${medecin.numeroRPPS} — ${formatSpecialite(medecin.specialite)}`,
    detailHref: routes.dashboard.usersMedecinDetail(medecin.id),
    editHref: routes.dashboard.usersMedecinDetail(medecin.id),
  }));

  return (
    <>
      <Header
        title="Médecins"
        breadcrumbs={[
          { label: "Utilisateurs", href: routes.dashboard.users },
          { label: "Médecins" },
        ]}
        actions={
          <Link href={routes.dashboard.usersMedecinsNew}>
            <Button icon={<Plus className="h-4 w-4" />}>Nouveau médecin</Button>
          </Link>
        }
      />
      <div className="space-y-4 p-6">
        <Tabs
          items={[
            { id: "assures", label: "Assurés" },
            { id: "medecins", label: "Médecins" },
          ]}
          activeId="medecins"
          onChange={(id) => {
            if (id === "assures") window.location.href = routes.dashboard.usersAssures;
          }}
        />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="max-w-sm"
        />
        <UsersTable
          data={rows}
          isLoading={isLoading}
          extraColumnLabel="RPPS / Spécialité"
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
        />
      </div>
    </>
  );
}
