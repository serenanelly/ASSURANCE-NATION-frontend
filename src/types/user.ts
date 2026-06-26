import type { Role, Sexe, Specialite, UserType } from "./enums";

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  adresse?: string;
  telephone?: string;
  sexe?: Sexe;
  userType: UserType;
  roles: Set<Role> | Role[];
  photoUrl?: string;
  createdAt?: string;
}

export interface UpdateUserRequest {
  email?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  adresse?: string;
  telephone?: string;
  sexe?: Sexe;
  photoUrl?: string;
}

export interface Medecin {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  numeroRPPS: string;
  specialite: Specialite;
  specialiteLibelle?: string;
  estAssure: boolean;
  photoUrl?: string;
}

export interface Assure {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  numSecuriteSociale: string;
  dateAffiliation?: string;
  emploi?: string;
  medecinTraitantId?: string;
  estActif: boolean;
  photoUrl?: string;
}

export interface RegisterMedecinRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  numeroRPPS: string;
  specialite: Specialite;
  specialiteLibelle?: string;
  telephone?: string;
  estAssure?: boolean;
  photoUrl?: string;
}

export interface RegisterAssureRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  numSecuriteSociale: string;
  dateAffiliation?: string;
  emploi?: string;
  medecinTraitantId?: string;
  photoUrl?: string;
}
