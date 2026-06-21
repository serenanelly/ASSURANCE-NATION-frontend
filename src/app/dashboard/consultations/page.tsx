"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "@/components/icons";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Card } from "@/components/common/Card";
import { RoleGuard } from "@/components/common/RoleGuard";
import { ConsultationsTable } from "@/components/tables/ConsultationsTable";
import { Badge } from "@/components/common/Badge";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import {
  formatDateTime,
  formatTypeConsultation,
} from "@/lib/formatters";
import { buildQueryString } from "@/lib/utils";
import { Role, TypeConsultation } from "@/types/enums";
import type { Consultation } from "@/types";

export default function ConsultationsPage() {
  const [page] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState<Consultation | null>(null);

  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["consultations", page],
    queryFn: async () => {
      const { data } = await api.get<Consultation[]>(
        `${apiConfig.endpoints.consultations}${buildQueryString({ page, size: 20 })}`
      );
      return data;
    },
  });

  const filtered = useMemo(() => {
    return consultations.filter((c) => {
      const matchesSearch =
        !search ||
        c.assureNom?.toLowerCase().includes(search.toLowerCase()) ||
        c.medecinNom?.toLowerCase().includes(search.toLowerCase()) ||
        c.diagnostique?.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || c.typeConsultation === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [consultations, search, typeFilter]);

  return (
    <>
      <Header
        title="Consultations"
        breadcrumbs={[{ label: "Consultations" }]}
        actions={
          <RoleGuard roles={[Role.MEDECIN]}>
            <Link href={routes.dashboard.consultationNew}>
              <Button icon={<Plus className="h-4 w-4" />}>Nouvelle consultation</Button>
            </Link>
          </RoleGuard>
        }
      />
      <div className="flex gap-6 p-6">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select
              options={[
                { value: "", label: "Tous les types" },
                { value: TypeConsultation.GENERALISTE, label: "Généraliste" },
                { value: TypeConsultation.SPECIALISTE, label: "Spécialiste" },
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder=""
              className="sm:max-w-xs"
            />
          </div>
          <ConsultationsTable
            data={filtered}
            isLoading={isLoading}
            onRowClick={setSelected}
          />
        </div>

        {selected && (
          <aside className="hidden w-80 shrink-0 lg:block">
            <Card
              title="Détail"
              padding="md"
              footer={
                <div className="flex gap-2">
                  <Link href={routes.dashboard.consultationDetail(selected.id)} className="flex-1">
                    <Button fullWidth variant="primary" size="sm">
                      Voir le détail
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              }
            >
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted">Patient</dt>
                  <dd className="font-medium">{selected.assureNom ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Médecin</dt>
                  <dd>{selected.medecinNom ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Date</dt>
                  <dd>{formatDateTime(selected.dateConsultation)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Type</dt>
                  <dd>
                    <Badge variant="outline">
                      {formatTypeConsultation(selected.typeConsultation)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Diagnostic</dt>
                  <dd>{selected.diagnostique ?? "—"}</dd>
                </div>
              </dl>
            </Card>
          </aside>
        )}
      </div>
    </>
  );
}
