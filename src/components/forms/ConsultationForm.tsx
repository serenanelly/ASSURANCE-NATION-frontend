"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import {
  consultationCreateSchema,
  type ConsultationCreateFormValues,
} from "@/lib/validators";
import { TypeConsultation } from "@/types/enums";
import type { Assure } from "@/types";
import { buildQueryString } from "@/lib/utils";

interface ConsultationFormProps {
  onSubmit: (data: ConsultationCreateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function ConsultationForm({ onSubmit, isSubmitting }: ConsultationFormProps) {
  const [nssSearch, setNssSearch] = useState("");
  const [selectedAssure, setSelectedAssure] = useState<Assure | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultationCreateFormValues>({
    resolver: zodResolver(consultationCreateSchema),
    defaultValues: {
      typeConsultation: TypeConsultation.GENERALISTE,
    },
  });

  const { refetch: searchAssure, isFetching: isSearching } = useQuery({
    queryKey: ["assure-search", nssSearch],
    queryFn: async () => {
      const { data } = await api.get<Assure>(
        `${apiConfig.endpoints.assures}/search${buildQueryString({ nss: nssSearch })}`
      );
      return data;
    },
    enabled: false,
  });

  const handleSearch = async () => {
    if (!nssSearch.trim()) return;
    const result = await searchAssure();
    if (result.data) {
      setSelectedAssure(result.data);
      setValue("assureId", result.data.id, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Rechercher un assuré (NSS)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Numéro de sécurité sociale"
            value={nssSearch}
            onChange={(e) => setNssSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
          <Button type="button" variant="secondary" onClick={handleSearch} isLoading={isSearching}>
            Rechercher
          </Button>
        </div>
        {selectedAssure && (
          <p className="text-sm text-success">
            Assuré sélectionné : {selectedAssure.prenom} {selectedAssure.nom}
          </p>
        )}
        {errors.assureId && (
          <p className="text-sm text-error">{errors.assureId.message}</p>
        )}
      </div>

      <Input
        label="Date et heure de consultation"
        type="datetime-local"
        error={errors.dateConsultation?.message}
        {...register("dateConsultation")}
      />

      <Select
        label="Type de consultation"
        options={[
          { value: TypeConsultation.GENERALISTE, label: "Généraliste" },
          { value: TypeConsultation.SPECIALISTE, label: "Spécialiste" },
        ]}
        error={errors.typeConsultation?.message}
        {...register("typeConsultation")}
      />

      <Input
        label="Motif"
        error={errors.motif?.message}
        {...register("motif")}
      />

      <Input
        label="Diagnostic"
        error={errors.diagnostique?.message}
        {...register("diagnostique")}
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

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Créer la consultation
      </Button>
    </form>
  );
}
