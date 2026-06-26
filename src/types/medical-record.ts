export interface MedicalRecord {
  id: string;
  assureId: string;
  medecinId: string;
  consultationId: string;
  date?: string;
  nomMaladie: string;
  estRemboursee: boolean;
  dateRemboursement?: string;
  montantRembourse?: number;
}

export interface MedicalRecordUpdateRequest {
  nomMaladie: string;
  date?: string;
}
