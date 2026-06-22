import { z } from "zod";
import { PASSWORD_REGEX } from "./constants";
import {
  ModePaiement,
  PrescriptionType,
  ReimbursementStatus,
  Role,
  Specialite,
  TypeConsultation,
  UserType,
} from "@/types/enums";

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(
    PASSWORD_REGEX,
    "Le mot de passe doit contenir une majuscule, un chiffre et un caractère spécial"
  );

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Adresse email invalide"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    userType: z.nativeEnum(UserType, {
      message: "Type d'utilisateur invalide",
    }),
    telephone: z.string().optional(),
    numeroRPPS: z.string().optional(),
    numSecuriteSociale: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const consultationCreateSchema = z.object({
  assureId: z.string().uuid("Identifiant assuré invalide"),
  dateConsultation: z.string().min(1, "La date de consultation est requise"),
  typeConsultation: z.nativeEnum(TypeConsultation, {
    message: "Type de consultation invalide",
  }),
  diagnostique: z.string().optional(),
  motif: z.string().optional(),
  notes: z.string().optional(),
});

export const prescriptionCreateSchema = z
  .object({
    type: z.nativeEnum(PrescriptionType, {
      message: "Type de prescription invalide",
    }),
    medicament: z.string().optional(),
    posologie: z.string().optional(),
    duree: z
      .number()
      .int("La durée doit être un nombre entier")
      .min(1, "La durée minimale est de 1 jour")
      .max(365, "La durée maximale est de 365 jours")
      .optional(),
    notes: z.string().optional(),
    medecinSpecialisteId: z.string().uuid().optional(),
    motif: z.string().optional(),
    priorite: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === PrescriptionType.MEDICAMENT) {
      if (!data.medicament) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Le médicament est requis",
          path: ["medicament"],
        });
      }
      if (!data.duree) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La durée est requise",
          path: ["duree"],
        });
      }
    }
    if (data.type === PrescriptionType.CONSULTATION && !data.motif) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le motif est requis pour une prescription spécialiste",
        path: ["motif"],
      });
    }
  });

export const reimbursementCreateSchema = z.object({
  medicalRecordId: z.string().uuid("Identifiant feuille de maladie invalide"),
  montantTotal: z.number().positive("Le montant doit être supérieur à 0"),
  modePaiement: z.nativeEnum(ModePaiement).optional(),
  notes: z.string().optional(),
});

export const reimbursementRejectSchema = z.object({
  motif: z.string().min(1, "Le motif de rejet est requis"),
});

export const userUpdateSchema = z.object({
  email: z.string().email("Adresse email invalide").optional(),
  nom: z.string().min(1, "Le nom est requis").optional(),
  prenom: z.string().min(1, "Le prénom est requis").optional(),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type ConsultationCreateFormValues = z.infer<typeof consultationCreateSchema>;
export type PrescriptionCreateFormValues = z.infer<typeof prescriptionCreateSchema>;
export type ReimbursementCreateFormValues = z.infer<typeof reimbursementCreateSchema>;

export const registerAssureSchema = z
  .object({
    email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    numSecuriteSociale: z
      .string()
      .regex(/^\d{15}$/, "Le numéro de sécurité sociale doit contenir exactement 15 chiffres"),
    dateAffiliation: z.string().optional(),
    emploi: z.string().optional(),
    medecinTraitantId: z.string().uuid().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const registerMedecinSchema = z
  .object({
    email: z.string().min(1, "L'email est requis").email("Adresse email invalide"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "La confirmation est requise"),
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    numeroRPPS: z
      .string()
      .regex(/^\d{11}$/, "Le numéro RPPS doit contenir exactement 11 chiffres"),
    specialite: z.nativeEnum(Specialite, { message: "Spécialité invalide" }),
    telephone: z.string().optional(),
    estAssure: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const medicalRecordUpdateSchema = z.object({
  nomMaladie: z.string().min(1, "Le nom de la maladie est requis"),
  date: z.string().optional(),
});

export const assureUpdateSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  emploi: z.string().optional(),
});

export const medecinUpdateSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  numeroRPPS: z.string().optional(),
  specialite: z.nativeEnum(Specialite, { message: "Spécialité invalide" }),
  telephone: z.string().optional(),
  estAssure: z.boolean().optional(),
});

export type RegisterAssureFormValues = z.infer<typeof registerAssureSchema>;
export type RegisterMedecinFormValues = z.infer<typeof registerMedecinSchema>;
export type MedicalRecordUpdateFormValues = z.infer<typeof medicalRecordUpdateSchema>;
export type AssureUpdateFormValues = z.infer<typeof assureUpdateSchema>;
export type MedecinUpdateFormValues = z.infer<typeof medecinUpdateSchema>;

export const roleSchema = z.nativeEnum(Role);
export const reimbursementStatusSchema = z.nativeEnum(ReimbursementStatus);
