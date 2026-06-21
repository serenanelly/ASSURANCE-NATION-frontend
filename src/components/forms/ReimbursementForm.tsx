"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import {
  reimbursementCreateSchema,
  type ReimbursementCreateFormValues,
} from "@/lib/validators";
import { ModePaiement } from "@/types/enums";

interface ReimbursementFormProps {
  onSubmit: (data: ReimbursementCreateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function ReimbursementForm({ onSubmit, isSubmitting }: ReimbursementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReimbursementCreateFormValues>({
    resolver: zodResolver(reimbursementCreateSchema),
    defaultValues: {
      modePaiement: ModePaiement.VIREMENT,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Identifiant feuille de maladie"
        placeholder="UUID de la feuille de maladie"
        error={errors.medicalRecordId?.message}
        {...register("medicalRecordId")}
      />

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

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Créer le remboursement
      </Button>
    </form>
  );
}
