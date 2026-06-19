import { format, formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  PrescriptionType,
  ReimbursementStatus,
  Specialite,
  TypeConsultation,
} from "@/types/enums";

export function formatDate(
  value: string | Date | undefined | null,
  pattern = "dd/MM/yyyy"
): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, pattern, { locale: fr });
}

export function formatDateTime(
  value: string | Date | undefined | null,
  pattern = "dd/MM/yyyy HH:mm"
): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, pattern, { locale: fr });
}

export function formatRelativeDate(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

export function formatCurrency(
  value: number | undefined | null,
  currency = "EUR"
): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

const REIMBURSEMENT_STATUS_LABELS: Record<ReimbursementStatus, string> = {
  [ReimbursementStatus.PENDING]: "En attente",
  [ReimbursementStatus.APPROVED]: "Approuvé",
  [ReimbursementStatus.REJECTED]: "Rejeté",
  [ReimbursementStatus.PAID]: "Payé",
};

export function formatReimbursementStatus(status: ReimbursementStatus): string {
  return REIMBURSEMENT_STATUS_LABELS[status] ?? status;
}

export type StatusBadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "outline";

export function getReimbursementStatusVariant(
  status: ReimbursementStatus
): StatusBadgeVariant {
  const variants: Record<ReimbursementStatus, StatusBadgeVariant> = {
    [ReimbursementStatus.PENDING]: "warning",
    [ReimbursementStatus.APPROVED]: "primary",
    [ReimbursementStatus.REJECTED]: "error",
    [ReimbursementStatus.PAID]: "success",
  };
  return variants[status] ?? "default";
}

const TYPE_CONSULTATION_LABELS: Record<TypeConsultation, string> = {
  [TypeConsultation.GENERALISTE]: "Généraliste",
  [TypeConsultation.SPECIALISTE]: "Spécialiste",
};

export function formatTypeConsultation(type: TypeConsultation): string {
  return TYPE_CONSULTATION_LABELS[type] ?? type;
}

const PRESCRIPTION_TYPE_LABELS: Record<PrescriptionType, string> = {
  [PrescriptionType.MEDICAMENT]: "Médicament",
  [PrescriptionType.CONSULTATION]: "Consultation spécialiste",
};

export function formatPrescriptionType(type: PrescriptionType): string {
  return PRESCRIPTION_TYPE_LABELS[type] ?? type;
}

const SPECIALITE_LABELS: Record<Specialite, string> = {
  [Specialite.GENERALISTE]: "Généraliste",
  [Specialite.SPECIALISTE]: "Spécialiste",
};

export function formatSpecialite(specialite: Specialite): string {
  return SPECIALITE_LABELS[specialite] ?? specialite;
}

export function formatFullName(nom: string, prenom: string): string {
  return `${prenom} ${nom}`.trim();
}
