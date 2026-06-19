import type { PrescriptionType } from "./enums";

export interface Prescription {
  id: string;
  consultationId: string;
  type: PrescriptionType;
  medicament?: string;
  posologie?: string;
  duree?: string;
  notes?: string;
  medecinSpecialisteId?: string;
  motif?: string;
  priorite?: string;
  codeReference?: string;
}

export interface PrescriptionCreateRequest {
  type: PrescriptionType;
  medicament?: string;
  posologie?: string;
  duree?: string;
  notes?: string;
  medecinSpecialisteId?: string;
  motif?: string;
  priorite?: string;
  codeReference?: string;
}

export interface PrescriptionDeleteRequest {
  motifSuppression?: string;
}
