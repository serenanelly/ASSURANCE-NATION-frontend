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
import { buildQueryString } from "@/lib/utils";
import type { Assure } from "@/types";
import type { PageResponse } from "@/types/api";

export default function AssuresPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["assures", page, search],
    queryFn: async () => {
      const { data: response } = await api.get<PageResponse<Assure>>(
        `${apiConfig.endpoints.assures}${buildQueryString({ page, size: 20, search: search || undefined })}`
      );
      return response;
    },
  });

  const rows = (data?.content ?? []).map((assure) => ({
    id: assure.id,
    email: assure.email,
    nom: assure.nom,
    prenom: assure.prenom,
    extra: assure.numSecuriteSociale,
    status: {
      label: assure.estActif ? "Actif" : "Inactif",
      variant: assure.estActif ? ("success" as const) : ("warning" as const),
    },
    detailHref: routes.dashboard.usersAssureDetail(assure.id),
    editHref: routes.dashboard.usersAssureDetail(assure.id),
  }));

  return (
    <>
      <Header
        title="Assurés"
        breadcrumbs={[
          { label: "Utilisateurs", href: routes.dashboard.users },
          { label: "Assurés" },
        ]}
        actions={
          <Link href={routes.dashboard.usersAssuresNew}>
            <Button icon={<Plus className="h-4 w-4" />}>Nouvel assuré</Button>
          </Link>
        }
      />
      <div className="space-y-4 p-6">
        <Tabs
          items={[
            { id: "assures", label: "Assurés" },
            { id: "medecins", label: "Médecins" },
          ]}
          activeId="assures"
          onChange={(id) => {
            if (id === "medecins") window.location.href = routes.dashboard.usersMedecins;
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
          extraColumnLabel="N° SS"
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
