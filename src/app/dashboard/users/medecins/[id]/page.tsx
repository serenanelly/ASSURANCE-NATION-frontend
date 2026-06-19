"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Spinner } from "@/components/common/Spinner";
import { UserForm } from "@/components/forms/UserForm";
import { useNotification } from "@/context/NotificationContext";
import { parseApiError } from "@/lib/errors";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { routes } from "@/config/routes";
import { formatSpecialite } from "@/lib/formatters";
import type { Medecin } from "@/types";
import { Specialite } from "@/types/enums";

export default function MedecinDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();

  const { data: medecin, isLoading } = useQuery({
    queryKey: ["medecin", params.id],
    queryFn: async () => {
      const { data } = await api.get<Medecin>(
        `${apiConfig.endpoints.medecins}/${params.id}`
      );
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: {
      nom: string;
      prenom: string;
      telephone?: string;
      specialite: Specialite;
      estAssure?: boolean;
    }) => {
      const { data } = await api.put<Medecin>(
        `${apiConfig.endpoints.medecins}/${params.id}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      success("Médecin mis à jour");
      queryClient.invalidateQueries({ queryKey: ["medecin", params.id] });
    },
    onError: (err) => notifyError(parseApiError(err).message),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner label="Chargement" />
      </div>
    );
  }

  if (!medecin) {
    return (
      <>
        <Header title="Médecin introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.usersMedecins}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={`Dr. ${medecin.prenom} ${medecin.nom}`}
        breadcrumbs={[
          { label: "Médecins", href: routes.dashboard.usersMedecins },
          { label: "Détail" },
        ]}
      />
      <div className="mx-auto grid max-w-4xl gap-6 p-6 lg:grid-cols-2">
        <Card padding="lg">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted">Email</dt>
              <dd>{medecin.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">N° RPPS</dt>
              <dd className="font-mono">{medecin.numeroRPPS}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Spécialité</dt>
              <dd>
                <Badge variant="primary">{formatSpecialite(medecin.specialite)}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Également assuré</dt>
              <dd>
                <Badge variant={medecin.estAssure ? "success" : "default"}>
                  {medecin.estAssure ? "Oui" : "Non"}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>
        <Card title="Modifier" padding="lg">
          <UserForm
            variant="medecin"
            mode="edit"
            defaultValues={{
              nom: medecin.nom,
              prenom: medecin.prenom,
              numeroRPPS: medecin.numeroRPPS,
              specialite: medecin.specialite,
              estAssure: medecin.estAssure,
            }}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({
                nom: data.nom,
                prenom: data.prenom,
                telephone: data.telephone,
                specialite: data.specialite as Specialite,
                estAssure: data.estAssure,
              });
            }}
            isSubmitting={updateMutation.isPending}
          />
        </Card>
      </div>
    </>
  );
}
