"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { PrescriptionsTable } from "@/components/tables/PrescriptionsTable";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { buildQueryString } from "@/lib/utils";
import type { Prescription } from "@/types";

export default function PrescriptionsPage() {
  const [page, setPage] = useState(0);

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["prescriptions", page],
    queryFn: async () => {
      const { data } = await api.get<Prescription[]>(
        `${apiConfig.endpoints.prescriptions}${buildQueryString({ page, size: 20 })}`
      );
      return data;
    },
  });

  return (
    <>
      <Header title="Prescriptions" breadcrumbs={[{ label: "Prescriptions" }]} />
      <div className="p-6">
        <PrescriptionsTable
          data={prescriptions}
          isLoading={isLoading}
          pageable={{
            page,
            size: 20,
            totalElements: prescriptions.length,
            totalPages: Math.ceil(prescriptions.length / 20) || 1,
          }}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
