import type { TypeConsultation } from "./enums";

export interface Consultation {
  id: string;
  assureId: string;
  assureNom?: string;
  medecinId: string;
  medecinNom?: string;
  dateConsultation: string;
  typeConsultation: TypeConsultation;
  diagnostique?: string;
  motif?: string;
  notes?: string;
  medicalRecordId?: string;
}

export interface ConsultationCreateRequest {
  assureId: string;
  dateConsultation: string;
  typeConsultation: TypeConsultation;
  diagnostique?: string;
  motif?: string;
  notes?: string;
}

export interface ConsultationUpdateRequest {
  dateConsultation?: string;
  typeConsultation?: TypeConsultation;
  diagnostique?: string;
  motif?: string;
  notes?: string;
  reschedule?: boolean;
}

export interface ConsultationCancelRequest {
  motifAnnulation?: string;
  notifyPatient?: boolean;
}
