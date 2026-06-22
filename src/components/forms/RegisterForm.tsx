"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Stethoscope,
  User,
  UserCircle,
} from "@/components/icons";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import { registerSchema } from "@/lib/validators";
import { parseApiError } from "@/lib/errors";
import { routes } from "@/config/routes";
import { Specialite, UserType } from "@/types/enums";
import type { RegisterRequest } from "@/types/auth";
import { cn } from "@/utils/cn";

const extendedRegisterSchema = registerSchema
  .extend({
    specialite: z.string().optional(),
    specialiteLibelle: z.string().optional(),
    emploi: z.string().optional(),
    dateAffiliation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === UserType.MEDECIN) {
      if (!data.numeroRPPS?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le numéro RPPS est requis",
          path: ["numeroRPPS"],
        });
      }
      if (!data.specialite?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La spécialité est requise",
          path: ["specialite"],
        });
      }
      if (
        data.specialite === Specialite.SPECIALISTE &&
        !data.specialiteLibelle?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Précisez la spécialité",
          path: ["specialiteLibelle"],
        });
      }
    }
    if (data.userType === UserType.ASSURE) {
      if (!data.numSecuriteSociale?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le numéro de sécurité sociale est requis",
          path: ["numSecuriteSociale"],
        });
      }
    }
  });

type RegisterFormValues = z.infer<typeof extendedRegisterSchema>;

const USER_TYPE_OPTIONS = [
  {
    value: UserType.MEDECIN,
    label: "Médecin",
    description: "Professionnel de santé",
    icon: Stethoscope,
  },
  {
    value: UserType.ASSURE,
    label: "Assuré",
    description: "Patient bénéficiaire",
    icon: UserCircle,
  },
  {
    value: UserType.ASSUREUR,
    label: "Assureur",
    description: "Organisme de sécurité sociale",
    icon: Briefcase,
  },
] as const;

const TOTAL_STEPS = 3;

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const { error: notifyError } = useNotification();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nom: "",
      prenom: "",
      telephone: "",
      userType: UserType.ASSURE,
      numeroRPPS: "",
      specialite: "",
      specialiteLibelle: "",
      numSecuriteSociale: "",
      emploi: "",
      dateAffiliation: "",
    },
  });

  const userType = watch("userType");
  const specialite = watch("specialite");

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger("userType");
      if (valid) setStep(2);
      return;
    }
    if (step === 2) {
      const valid = await trigger([
        "email",
        "password",
        "confirmPassword",
        "nom",
        "prenom",
        "telephone",
      ]);
      if (valid) {
        setStep(userType === UserType.ASSUREUR ? TOTAL_STEPS : 3);
      }
    }
  };

  const handleBack = () => {
    if (step === TOTAL_STEPS && userType === UserType.ASSUREUR) {
      setStep(2);
      return;
    }
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async (data: RegisterFormValues) => {
    const payload: RegisterRequest = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      userType: data.userType,
    };

    if (data.userType === UserType.MEDECIN) {
      payload.numeroRPPS = data.numeroRPPS;
      payload.specialite = data.specialite;
      payload.specialiteLibelle = data.specialiteLibelle;
    }

    if (data.userType === UserType.ASSURE) {
      payload.numSecuriteSociale = data.numSecuriteSociale;
      payload.emploi = data.emploi;
      payload.dateAffiliation = data.dateAffiliation;
    }

    try {
      await registerUser(payload);
    } catch (err) {
      notifyError(parseApiError(err).message, "Échec de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Étape {step} sur {TOTAL_STEPS}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                i + 1 <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
              )}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Sélectionnez votre type de compte pour commencer l&apos;inscription.
          </p>
          <div className="grid gap-3">
            {USER_TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = userType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("userType", option.value)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary/50 dark:border-gray-700"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {option.label}
                    </p>
                    <p className="text-sm text-muted">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("userType")} />
          {errors.userType && (
            <p className="text-sm text-error">{errors.userType.message}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              placeholder="Jean"
              icon={<User className="h-4 w-4" aria-hidden />}
              error={errors.prenom?.message}
              {...register("prenom")}
            />
            <Input
              label="Nom"
              placeholder="Dupont"
              error={errors.nom?.message}
              {...register("nom")}
            />
          </div>

          <Input
            label="Adresse email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            icon={<Mail className="h-4 w-4" aria-hidden />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="06 12 34 56 78"
            error={errors.telephone?.message}
            {...register("telephone")}
          />

          <div className="relative">
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" aria-hidden />}
              error={errors.password?.message}
              hint="8 caractères minimum, une majuscule, un chiffre et un caractère spécial"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
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

          <div className="relative">
            <Input
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" aria-hidden />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              aria-label={
                showConfirmPassword
                  ? "Masquer la confirmation"
                  : "Afficher la confirmation"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && userType !== UserType.ASSUREUR && (
        <div className="space-y-4">
          {userType === UserType.MEDECIN && (
            <>
              <Input
                label="Numéro RPPS"
                placeholder="12345678901"
                error={errors.numeroRPPS?.message}
                {...register("numeroRPPS")}
              />
              <Select
                label="Spécialité"
                options={[
                  {
                    value: Specialite.GENERALISTE,
                    label: "Médecin généraliste",
                  },
                  {
                    value: Specialite.SPECIALISTE,
                    label: "Médecin spécialiste",
                  },
                ]}
                error={errors.specialite?.message}
                {...register("specialite")}
              />
              {specialite === Specialite.SPECIALISTE && (
                <Input
                  label="Spécialité (précisez)"
                  placeholder="Ex. Cardiologie"
                  error={errors.specialiteLibelle?.message}
                  {...register("specialiteLibelle")}
                />
              )}
            </>
          )}

          {userType === UserType.ASSURE && (
            <>
              <Input
                label="Numéro de sécurité sociale"
                placeholder="1 23 45 67 890 123 45"
                error={errors.numSecuriteSociale?.message}
                {...register("numSecuriteSociale")}
              />
              <Input
                label="Emploi"
                placeholder="Ingénieur"
                error={errors.emploi?.message}
                {...register("emploi")}
              />
              <Input
                label="Date d'affiliation"
                type="date"
                error={errors.dateAffiliation?.message}
                {...register("dateAffiliation")}
              />
            </>
          )}
        </div>
      )}

      {step === TOTAL_STEPS && userType === UserType.ASSUREUR && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          <p className="font-medium">Récapitulatif</p>
          <p className="mt-1 text-muted">
            Votre compte assureur sera créé avec les informations saisies.
            Vous pourrez gérer les assurés et les remboursements après
            connexion.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleBack}
            icon={<ArrowLeft className="h-4 w-4" aria-hidden />}
          >
            Retour
          </Button>
        )}

        {step < TOTAL_STEPS ||
        (step === 2 && userType === UserType.ASSUREUR) ? (
          <Button
            type="button"
            fullWidth
            onClick={handleNext}
            icon={<ArrowRight className="h-4 w-4" aria-hidden />}
          >
            {step === 2 && userType === UserType.ASSUREUR
              ? "Vérifier et continuer"
              : "Continuer"}
          </Button>
        ) : (
          <Button type="submit" fullWidth isLoading={isLoading}>
            Créer mon compte
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted">
        Déjà un compte ?{" "}
        <Link
          href={routes.auth.login}
          className="font-semibold text-primary hover:text-navy"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
