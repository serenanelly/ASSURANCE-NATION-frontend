"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { formatPrescriptionType } from "@/lib/formatters";
import { PrescriptionType } from "@/types/enums";
import type { Prescription } from "@/types";

export default function PrescriptionDetailPage() {
  const params = useParams<{ id: string }>();

  const { data: prescription, isLoading } = useQuery({
    queryKey: ["prescription", params.id],
    queryFn: async () => {
      const { data } = await api.get<Prescription>(
        `${apiConfig.endpoints.prescriptions}/${params.id}`
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <>
        <Header title="Prescription introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.prescriptions}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Détail prescription"
        breadcrumbs={[
          { label: "Prescriptions", href: routes.dashboard.prescriptions },
          { label: "Détail" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <Card padding="lg">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted">Type</dt>
              <dd>
                <Badge variant={prescription.type === PrescriptionType.MEDICAMENT ? "primary" : "accent"}>
                  {formatPrescriptionType(prescription.type)}
                </Badge>
              </dd>
            </div>
            {prescription.type === PrescriptionType.MEDICAMENT && (
              <>
                <div>
                  <dt className="text-sm text-muted">Médicament</dt>
                  <dd className="font-medium">{prescription.medicament ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Posologie</dt>
                  <dd>{prescription.posologie ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Durée</dt>
                  <dd>{prescription.duree ? `${prescription.duree} jours` : "—"}</dd>
                </div>
              </>
            )}
            {prescription.type === PrescriptionType.CONSULTATION && (
              <>
                <div>
                  <dt className="text-sm text-muted">Motif</dt>
                  <dd>{prescription.motif ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Priorité</dt>
                  <dd>{prescription.priorite ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Code référence</dt>
                  <dd>{prescription.codeReference ?? "—"}</dd>
                </div>
              </>
            )}
            <div>
              <dt className="text-sm text-muted">Notes</dt>
              <dd>{prescription.notes ?? "—"}</dd>
            </div>
            <div>
              <Link
                href={routes.dashboard.consultationDetail(prescription.consultationId)}
                className="text-primary hover:underline"
              >
                Voir la consultation
              </Link>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
