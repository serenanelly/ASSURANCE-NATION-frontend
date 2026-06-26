export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;
export const MIN_PAGE_SIZE = 10;

export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_HINT =
  "8 caractères minimum, une majuscule, un chiffre et un caractère spécial";

export const PRESCRIPTION_DUREE_MIN = 1;
export const PRESCRIPTION_DUREE_MAX = 365;

export const REIMBURSEMENT_TAUX = {
  GENERALISTE: 100,
  SPECIALISTE: 80,
} as const;
