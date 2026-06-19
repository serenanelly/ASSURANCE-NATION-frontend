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
import { formatDate } from "@/lib/formatters";
import type { Assure } from "@/types";

export default function AssureDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { success, error: notifyError } = useNotification();

  const { data: assure, isLoading } = useQuery({
    queryKey: ["assure", params.id],
    queryFn: async () => {
      const { data } = await api.get<Assure>(
        `${apiConfig.endpoints.assures}/${params.id}`
      );
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: { nom: string; prenom: string; emploi?: string }) => {
      const { data } = await api.put<Assure>(
        `${apiConfig.endpoints.assures}/${params.id}`,
        values
      );
      return data;
    },
    onSuccess: () => {
      success("Assuré mis à jour");
      queryClient.invalidateQueries({ queryKey: ["assure", params.id] });
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

  if (!assure) {
    return (
      <>
        <Header title="Assuré introuvable" />
        <div className="p-6">
          <Link href={routes.dashboard.usersAssures}>
            <Button variant="secondary">Retour</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={`${assure.prenom} ${assure.nom}`}
        breadcrumbs={[
          { label: "Assurés", href: routes.dashboard.usersAssures },
          { label: "Détail" },
        ]}
      />
      <div className="mx-auto grid max-w-4xl gap-6 p-6 lg:grid-cols-2">
        <Card padding="lg">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted">Email</dt>
              <dd>{assure.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">N° sécurité sociale</dt>
              <dd className="font-mono">{assure.numSecuriteSociale}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Statut</dt>
              <dd>
                <Badge variant={assure.estActif ? "success" : "warning"}>
                  {assure.estActif ? "Actif" : "Inactif"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Date d&apos;affiliation</dt>
              <dd>{formatDate(assure.dateAffiliation)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Emploi</dt>
              <dd>{assure.emploi ?? "—"}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Modifier" padding="lg">
          <UserForm
            variant="assure"
            mode="edit"
            defaultValues={{
              nom: assure.nom,
              prenom: assure.prenom,
              emploi: assure.emploi,
            }}
            onSubmit={async (data) => {
              await updateMutation.mutateAsync({
                nom: data.nom,
                prenom: data.prenom,
                emploi: data.emploi,
              });
            }}
            isSubmitting={updateMutation.isPending}
          />
        </Card>
      </div>
    </>
  );
}
