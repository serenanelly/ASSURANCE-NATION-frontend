import type { ModePaiement, ReimbursementStatus } from "./enums";

export interface Reimbursement {
  id: string;
  numRemboursement: string;
  medicalRecordId: string;
  assureId?: string;
  assureNom?: string;
  montantTotal: number;
  tauxRemboursement?: number;
  montantRembourse?: number;
  modePaiement?: ModePaiement;
  status: ReimbursementStatus;
  dateRemboursement?: string;
  createdAt?: string;
  justificatifUrl?: string;
  notes?: string;
}

export interface ReimbursementCreateRequest {
  medicalRecordId: string;
  montantTotal: number;
  modePaiement?: ModePaiement;
  notes?: string;
}

export interface ReimbursementRejectRequest {
  motif: string;
}

export interface ReimbursementStatistics {
  totalRembourses: number;
  nombreRemboursements: number;
  moyenneParRemboursement: number;
}

export interface MonthlyStat {
  mois: string;
  montant: number;
  count: number;
}

export interface SpecialiteStat {
  montant: number;
  taux: number;
}

export interface ReimbursementListResponse {
  content: Reimbursement[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  statistics?: ReimbursementStatistics;
}

export interface ReimbursementDashboard {
  totalRemboursements: number;
  totalMontants: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  paidCount: number;
  montantTotalPaye: number;
  rembourseParMois: MonthlyStat[];
  rembourseParSpecialite: Record<string, SpecialiteStat>;
}
