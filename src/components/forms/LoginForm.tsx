"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "@/components/icons";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { routes } from "@/config/routes";
import { parseApiError } from "@/lib/errors";

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { error: notifyError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (err) {
      notifyError(parseApiError(err).message, "Échec de la connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Adresse email"
        type="email"
        autoComplete="email"
        placeholder="vous@exemple.fr"
        icon={<Mail className="h-4 w-4" aria-hidden />}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" aria-hidden />}
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>

      <div className="flex justify-end">
        <Link
          href={routes.auth.forgotPassword}
          className="text-sm font-medium text-primary hover:text-navy dark:hover:text-primary-light"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Se connecter
      </Button>
    </form>
  );
}
