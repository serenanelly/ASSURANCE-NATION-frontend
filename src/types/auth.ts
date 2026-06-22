import type { User } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  adresse?: string;
  telephone?: string;
  sexe?: string;
  userType: string;
  numeroRPPS?: string;
  specialite?: string;
  specialiteLibelle?: string;
  numSecuriteSociale?: string;
  dateAffiliation?: string;
  emploi?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  token?: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
  user: User;
  message?: string;
}

export interface TokenResponse {
  accessToken: string;
  token?: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn: number;
}

export interface ValidateTokenResponse {
  valid: boolean;
  email?: string;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
