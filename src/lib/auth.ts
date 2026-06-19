import type { AuthResponse, User } from "@/types";
import { COOKIE_KEYS, STORAGE_KEYS } from "./constants";
import { isBrowser, normalizeRoles } from "./utils";

const COOKIE_MAX_AGE_DAYS = 7;

function setCookie(name: string, value: string, days = COOKIE_MAX_AGE_DAYS) {
  if (!isBrowser()) return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return (
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    return {
      ...parsed,
      roles: normalizeRoles(parsed.roles),
    };
  } catch {
    return null;
  }
}

export function storeAuthSession(response: AuthResponse): void {
  if (!isBrowser()) return;

  const accessToken = response.accessToken || response.token;
  if (!accessToken) return;

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify({
      ...response.user,
      roles: normalizeRoles(response.user.roles),
    })
  );

  setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
