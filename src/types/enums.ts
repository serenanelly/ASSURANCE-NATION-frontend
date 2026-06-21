export enum Role {
  ADMIN = "ADMIN",
  MEDECIN = "MEDECIN",
  ASSUREUR = "ASSUREUR",
  PATIENT = "PATIENT",
}

export enum UserType {
  MEDECIN = "MEDECIN",
  ASSURE = "ASSURE",
  ASSUREUR = "ASSUREUR",
}

export enum ReimbursementStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAID = "PAID",
}

export enum PrescriptionType {
  MEDICAMENT = "MEDICAMENT",
  // Wire value must match backend enum entity/enums/PrescriptionType.CONSULTATION_SPECIALISTE
  CONSULTATION = "CONSULTATION_SPECIALISTE",
}

export enum TypeConsultation {
  GENERALISTE = "GENERALISTE",
  SPECIALISTE = "SPECIALISTE",
}

export enum ModePaiement {
  VIREMENT = "VIREMENT",
  CASH = "CASH",
}

export enum Sexe {
  // Wire values must match backend enum entity/enums/Sexe (M, F)
  MASCULIN = "M",
  FEMININ = "F",
}

export enum Specialite {
  GENERALISTE = "GENERALISTE",
  SPECIALISTE = "SPECIALISTE",
}
