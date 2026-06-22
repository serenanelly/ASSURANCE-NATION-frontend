"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search } from "@/components/icons";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Badge } from "@/components/common/Badge";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { parseApiError } from "@/lib/errors";
import { buildQueryString } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/utils/cn";
import {
  reimbursementCreateSchema,
  type ReimbursementCreateFormValues,
} from "@/lib/validators";
import { ModePaiement } from "@/types/enums";
import type { Assure } from "@/types/user";
import type { MedicalRecord } from "@/types/medical-record";
import type { PageResponse } from "@/types/api";

interface ReimbursementFormProps {
  onSubmit: (data: ReimbursementCreateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function ReimbursementForm({ onSubmit, isSubmitting }: ReimbursementFormProps) {
  const { error: notifyError } = useNotification();
  const [nss, setNss] = useState("");
  const [assure, setAssure] = useState<Assure | null>(null);
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReimbursementCreateFormValues>({
    resolver: zodResolver(reimbursementCreateSchema),
    defaultValues: {
      modePaiement: ModePaiement.VIREMENT,
      medicalRecordId: "",
    },
  });

  const selectedRecordId = watch("medicalRecordId");

  const recordsQuery = useQuery({
    queryKey: ["medical-records", assure?.id],
    enabled: Boolean(assure?.id),
    queryFn: async () => {
      const { data } = await api.get<PageResponse<MedicalRecord>>(
        `${apiConfig.endpoints.medicalRecords}/${assure!.id}${buildQueryString({
          page: 0,
          size: 50,
        })}`
      );
      return data.content ?? [];
    },
  });

  const handleSearch = async () => {
    if (!nss.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get<Assure>(
        `${apiConfig.endpoints.assures}/search${buildQueryString({ nss: nss.trim() })}`
      );
      setAssure(data);
      setValue("medicalRecordId", "");
    } catch (err) {
      setAssure(null);
      notifyError(parseApiError(err).message, "Assuré introuvable");
    } finally {
      setSearching(false);
    }
  };

  const records = recordsQuery.data ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1 — find the insured by social-security number */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rechercher un assuré (n° de sécurité sociale)
        </label>
        <div className="flex gap-2">
          <Input
            value={nss}
            onChange={(e) => setNss(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="15 chiffres"
            icon={<Search className="h-4 w-4" aria-hidden />}
          />
          <Button type="button" onClick={handleSearch} isLoading={searching}>
            Rechercher
          </Button>
        </div>
      </div>

      {assure && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800/50">
          <p className="font-semibold text-foreground">
            {assure.prenom} {assure.nom}
          </p>
          <p className="text-muted">NSS : {assure.numSecuriteSociale}</p>
        </div>
      )}

      {/* Step 2 — pick a feuille de maladie */}
      {assure && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Feuille de maladie à rembourser
          </label>
          {recordsQuery.isLoading ? (
            <p className="text-sm text-muted">Chargement des feuilles de maladie…</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-muted">
              Aucune feuille de maladie pour cet assuré.
            </p>
          ) : (
            <div className="space-y-2">
              {records.map((record) => {
                const selected = selectedRecordId === record.id;
                const disabled = record.estRemboursee;
                return (
                  <button
                    key={record.id}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      setValue("medicalRecordId", record.id, {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-primary/50 dark:border-gray-700",
                      disabled && "cursor-not-allowed opacity-60 hover:border-gray-200"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {record.nomMaladie}
                      </p>
                      <p className="text-xs text-muted">{formatDate(record.date)}</p>
                    </div>
                    {record.estRemboursee ? (
                      <Badge variant="success" size="sm">
                        Déjà remboursée
                      </Badge>
                    ) : selected ? (
                      <Badge variant="primary" size="sm">
                        Sélectionnée
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
          {errors.medicalRecordId && (
            <p className="mt-1 text-sm text-error">
              {errors.medicalRecordId.message}
            </p>
          )}
          <input type="hidden" {...register("medicalRecordId")} />
        </div>
      )}

      {/* Step 3 — amount & payment details */}
      <Input
        label="Montant total (FCFA)"
        type="number"
        step="1"
        min="1"
        error={errors.montantTotal?.message}
        {...register("montantTotal", { valueAsNumber: true })}
      />

      <Select
        label="Mode de paiement"
        options={[
          { value: ModePaiement.VIREMENT, label: "Virement" },
          { value: ModePaiement.CASH, label: "Espèces" },
        ]}
        error={errors.modePaiement?.message}
        {...register("modePaiement")}
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          rows={3}
          {...register("notes")}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        fullWidth
        disabled={!selectedRecordId}
      >
        Créer le remboursement
      </Button>
    </form>
  );
}
