"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import api from "@/lib/api";
import { apiConfig } from "@/config/api";
import { getErrorMessage } from "@/lib/errors";
import { PASSWORD_HINT } from "@/lib/constants";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/lib/validators";
import type { ChangePasswordRequest } from "@/types/auth";

export function ChangePasswordForm() {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    if (!user?.id) {
      notifyError("Utilisateur non connecté");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      await api.put(apiConfig.endpoints.userPassword(user.id), payload);
      success("Votre mot de passe a été modifié avec succès");
      reset();
    } catch (err) {
      notifyError(getErrorMessage(err), "Échec du changement de mot de passe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="relative">
        <Input
          label="Mot de passe actuel"
          type={showCurrent ? "text" : "password"}
          autoComplete="current-password"
          icon={<Lock className="h-4 w-4" aria-hidden />}
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <ToggleVisibility
          visible={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
      </div>

      <div className="relative">
        <Input
          label="Nouveau mot de passe"
          type={showNew ? "text" : "password"}
          autoComplete="new-password"
          hint={PASSWORD_HINT}
          icon={<Lock className="h-4 w-4" aria-hidden />}
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <ToggleVisibility
          visible={showNew}
          onToggle={() => setShowNew((v) => !v)}
        />
      </div>

      <div className="relative">
        <Input
          label="Confirmer le mot de passe"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          icon={<Lock className="h-4 w-4" aria-hidden />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <ToggleVisibility
          visible={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Modifier le mot de passe
      </Button>
    </form>
  );
}

function ToggleVisibility({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-[38px] text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
      aria-label={
        visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
      }
    >
      {visible ? (
        <EyeOff className="h-4 w-4" aria-hidden />
      ) : (
        <Eye className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
