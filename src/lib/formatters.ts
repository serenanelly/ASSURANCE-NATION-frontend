import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  PrescriptionType,
  ReimbursementStatus,
  Specialite,
  TypeConsultation,
} from "@/types/enums";

/**
 * Coerce an incoming value to a valid Date, or null if it can't be parsed.
 * Guards against `RangeError: Invalid time value` thrown by date-fns `format`
 * when the backend returns an empty/unexpected date string.
 */
function toValidDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

export function formatDate(
  value: string | Date | undefined | null,
  pattern = "dd/MM/yyyy"
): string {
  const date = toValidDate(value);
  if (!date) return "—";
  return format(date, pattern, { locale: fr });
}

export function formatDateTime(
  value: string | Date | undefined | null,
  pattern = "dd/MM/yyyy HH:mm"
): string {
  const date = toValidDate(value);
  if (!date) return "—";
  return format(date, pattern, { locale: fr });
}

export function formatRelativeDate(value: string | Date | undefined | null): string {
  const date = toValidDate(value);
  if (!date) return "—";
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

export function formatCurrency(
  value: number | undefined | null,
  currency = "FCFA"
): string {
  if (value === undefined || value === null) return "—";
  // FCFA (franc CFA) has no decimal subunit; show grouped integer amounts.
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} ${currency}`;
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
