"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { reimbursementRejectSchema } from "@/lib/validators";

type RejectFormValues = z.infer<typeof reimbursementRejectSchema>;

interface RejectReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motif: string) => Promise<unknown>;
  isSubmitting?: boolean;
}

export function RejectReimbursementModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: RejectReimbursementModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(reimbursementRejectSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: RejectFormValues) => {
    await onConfirm(data.motif);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Rejeter le remboursement"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Confirmer le rejet
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Motif du rejet"
          placeholder="Indiquez la raison du rejet..."
          error={errors.motif?.message}
          {...register("motif")}
        />
      </form>
    </Modal>
  );
}
