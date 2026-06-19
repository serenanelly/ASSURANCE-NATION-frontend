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
}

export interface Medecin {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  numeroRPPS: string;
  specialite: Specialite;
  estAssure: boolean;
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
}

export interface RegisterMedecinRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  numeroRPPS: string;
  specialite: Specialite;
  telephone?: string;
  estAssure?: boolean;
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
}
