"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import {
  prescriptionCreateSchema,
  type PrescriptionCreateFormValues,
} from "@/lib/validators";
import { PrescriptionType } from "@/types/enums";

interface PrescriptionFormProps {
  onSubmit: (data: PrescriptionCreateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function PrescriptionForm({ onSubmit, isSubmitting }: PrescriptionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PrescriptionCreateFormValues>({
    resolver: zodResolver(prescriptionCreateSchema),
    defaultValues: {
      type: PrescriptionType.MEDICAMENT,
    },
  });

  const prescriptionType = useWatch({ control, name: "type" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        label="Type de prescription"
        options={[
          { value: PrescriptionType.MEDICAMENT, label: "Médicament" },
          { value: PrescriptionType.CONSULTATION, label: "Consultation spécialiste" },
        ]}
        error={errors.type?.message}
        {...register("type")}
      />

      {prescriptionType === PrescriptionType.MEDICAMENT && (
        <>
          <Input
            label="Médicament"
            error={errors.medicament?.message}
            {...register("medicament")}
          />
          <Input
            label="Posologie"
            error={errors.posologie?.message}
            {...register("posologie")}
          />
          <Input
            label="Durée (jours)"
            type="number"
            min={1}
            max={365}
            error={errors.duree?.message}
            {...register("duree", { valueAsNumber: true })}
          />
        </>
      )}

      {prescriptionType === PrescriptionType.CONSULTATION && (
        <>
          <Input
            label="Motif"
            error={errors.motif?.message}
            {...register("motif")}
          />
          <Input
            label="Priorité"
            error={errors.priorite?.message}
            {...register("priorite")}
          />
          <Input
            label="Médecin spécialiste (ID)"
            error={errors.medecinSpecialisteId?.message}
            {...register("medecinSpecialisteId")}
          />
        </>
      )}

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
        Enregistrer la prescription
      </Button>
    </form>
  );
}
