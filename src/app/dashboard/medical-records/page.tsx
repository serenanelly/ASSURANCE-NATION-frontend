"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Header } from "@/components/common/Header";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { MedicalRecordsTable } from "@/components/tables/MedicalRecordsTable";
import { useAuth } from "@/context/AuthContext";
import { hasRole } from "@/lib/utils";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { buildQueryString } from "@/lib/utils";
import { Role } from "@/types/enums";
import type { Assure, MedicalRecord } from "@/types";
import type { PageResponse } from "@/types/api";

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const isPatient = hasRole(user, Role.PATIENT);
  const [page, setPage] = useState(0);
  const [nssSearch, setNssSearch] = useState("");
  const [assureId, setAssureId] = useState<string | null>(
    isPatient ? user?.id ?? null : null
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["medical-records", assureId, page],
    queryFn: async () => {
      if (!assureId) return { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 };
      const { data: response } = await api.get<PageResponse<MedicalRecord>>(
        `${apiConfig.endpoints.medicalRecords}/${assureId}${buildQueryString({ page, size: 20 })}`
      );
      return response;
    },
    enabled: Boolean(assureId),
  });

  const handleSearch = async () => {
    if (!nssSearch.trim()) return;
    try {
      const { data: assure } = await api.get<Assure>(
        `${apiConfig.endpoints.assures}/search${buildQueryString({ nss: nssSearch })}`
      );
      setAssureId(assure.id);
      setPage(0);
    } catch {
      setAssureId(null);
    }
  };

  return (
    <>
      <Header title="Feuilles de maladie" breadcrumbs={[{ label: "Feuilles de maladie" }]} />
      <div className="space-y-4 p-6">
        {!isPatient && (
          <div className="flex max-w-md gap-2">
            <Input
              placeholder="Rechercher par NSS..."
              value={nssSearch}
              onChange={(e) => setNssSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
            <Button onClick={handleSearch}>Rechercher</Button>
          </div>
        )}

        {!assureId && !isPatient && (
          <p className="text-sm text-muted">
            Recherchez un assuré par numéro de sécurité sociale pour afficher ses feuilles de maladie.
          </p>
        )}

        <MedicalRecordsTable
          data={data?.content ?? []}
          isLoading={isLoading}
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
          onPageChange={(p) => {
            setPage(p);
            refetch();
          }}
        />
      </div>
    </>
  );
}
