"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import {
  registerAssureSchema,
  registerMedecinSchema,
  assureUpdateSchema,
  medecinUpdateSchema,
  type RegisterAssureFormValues,
  type RegisterMedecinFormValues,
  type AssureUpdateFormValues,
  type MedecinUpdateFormValues,
} from "@/lib/validators";
import { Specialite } from "@/types/enums";
import { PASSWORD_HINT } from "@/lib/constants";

type UserFormVariant = "assure" | "medecin";

interface UserFormCreateProps {
  variant: UserFormVariant;
  mode?: "create";
  onSubmit: (
    data: RegisterAssureFormValues | RegisterMedecinFormValues
  ) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<RegisterAssureFormValues | RegisterMedecinFormValues>;
}

interface UserFormEditAssureProps {
  variant: "assure";
  mode: "edit";
  onSubmit: (data: AssureUpdateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<AssureUpdateFormValues>;
}

interface UserFormEditMedecinProps {
  variant: "medecin";
  mode: "edit";
  onSubmit: (data: MedecinUpdateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<MedecinUpdateFormValues>;
}

type UserFormProps =
  | UserFormCreateProps
  | UserFormEditAssureProps
  | UserFormEditMedecinProps;

export function UserForm(props: UserFormProps) {
  if (props.mode === "edit" && props.variant === "assure") {
    return (
      <AssureEditForm
        onSubmit={props.onSubmit}
        isSubmitting={props.isSubmitting}
        defaultValues={props.defaultValues}
      />
    );
  }

  if (props.mode === "edit" && props.variant === "medecin") {
    return (
      <MedecinEditForm
        onSubmit={props.onSubmit}
        isSubmitting={props.isSubmitting}
        defaultValues={props.defaultValues}
      />
    );
  }

  if (props.variant === "assure") {
    return (
      <AssureCreateForm
        onSubmit={props.onSubmit as (data: RegisterAssureFormValues) => Promise<unknown>}
        isSubmitting={props.isSubmitting}
        defaultValues={props.defaultValues as Partial<RegisterAssureFormValues>}
      />
    );
  }

  return (
    <MedecinCreateForm
      onSubmit={props.onSubmit as (data: RegisterMedecinFormValues) => Promise<unknown>}
      isSubmitting={props.isSubmitting}
      defaultValues={props.defaultValues as Partial<RegisterMedecinFormValues>}
    />
  );
}

function AssureCreateForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: {
  onSubmit: (data: RegisterAssureFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<RegisterAssureFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterAssureFormValues>({
    resolver: zodResolver(registerAssureSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Mot de passe" type="password" hint={PASSWORD_HINT} error={errors.password?.message} {...register("password")} />
      <Input label="Confirmer le mot de passe" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      <Input label="N° sécurité sociale" error={errors.numSecuriteSociale?.message} {...register("numSecuriteSociale")} />
      <Input label="Nom" error={errors.nom?.message} {...register("nom")} />
      <Input label="Prénom" error={errors.prenom?.message} {...register("prenom")} />
      <Input label="Emploi" error={errors.emploi?.message} {...register("emploi")} />
      <Input label="Date d&apos;affiliation" type="date" error={errors.dateAffiliation?.message} {...register("dateAffiliation")} />
      <Input label="Médecin traitant (ID)" error={errors.medecinTraitantId?.message} {...register("medecinTraitantId")} />
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Créer l&apos;assuré
      </Button>
    </form>
  );
}

function AssureEditForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: {
  onSubmit: (data: AssureUpdateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<AssureUpdateFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssureUpdateFormValues>({
    resolver: zodResolver(assureUpdateSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Nom" error={errors.nom?.message} {...register("nom")} />
      <Input label="Prénom" error={errors.prenom?.message} {...register("prenom")} />
      <Input label="Emploi" error={errors.emploi?.message} {...register("emploi")} />
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Enregistrer
      </Button>
    </form>
  );
}

function MedecinCreateForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: {
  onSubmit: (data: RegisterMedecinFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<RegisterMedecinFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterMedecinFormValues>({
    resolver: zodResolver(registerMedecinSchema),
    defaultValues: { estAssure: false, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <Input label="Mot de passe" type="password" hint={PASSWORD_HINT} error={errors.password?.message} {...register("password")} />
      <Input label="Confirmer le mot de passe" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      <Input label="Nom" error={errors.nom?.message} {...register("nom")} />
      <Input label="Prénom" error={errors.prenom?.message} {...register("prenom")} />
      <Input label="N° RPPS" error={errors.numeroRPPS?.message} {...register("numeroRPPS")} />
      <Select
        label="Spécialité"
        options={[
          { value: Specialite.GENERALISTE, label: "Généraliste" },
          { value: Specialite.SPECIALISTE, label: "Spécialiste" },
        ]}
        error={errors.specialite?.message}
        {...register("specialite")}
      />
      <Input label="Téléphone" error={errors.telephone?.message} {...register("telephone")} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("estAssure")} className="rounded border-gray-300" />
        Également assuré
      </label>
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Créer le médecin
      </Button>
    </form>
  );
}

function MedecinEditForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: {
  onSubmit: (data: MedecinUpdateFormValues) => Promise<unknown>;
  isSubmitting?: boolean;
  defaultValues?: Partial<MedecinUpdateFormValues>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MedecinUpdateFormValues>({
    resolver: zodResolver(medecinUpdateSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input label="Nom" error={errors.nom?.message} {...register("nom")} />
      <Input label="Prénom" error={errors.prenom?.message} {...register("prenom")} />
      <Input label="N° RPPS" error={errors.numeroRPPS?.message} {...register("numeroRPPS")} />
      <Select
        label="Spécialité"
        options={[
          { value: Specialite.GENERALISTE, label: "Généraliste" },
          { value: Specialite.SPECIALISTE, label: "Spécialiste" },
        ]}
        error={errors.specialite?.message}
        {...register("specialite")}
      />
      <Input label="Téléphone" error={errors.telephone?.message} {...register("telephone")} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("estAssure")} className="rounded border-gray-300" />
        Également assuré
      </label>
      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Enregistrer
      </Button>
    </form>
  );
}
