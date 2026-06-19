import { Role } from "@/types/enums";
import type { User } from "@/types/user";

export function normalizeRoles(roles: Set<Role> | Role[] | string[] | undefined): Role[] {
  if (!roles) return [];
  if (roles instanceof Set) return Array.from(roles) as Role[];
  return roles as Role[];
}

export function hasRole(user: User | null | undefined, role: Role): boolean {
  if (!user?.roles) return false;
  return normalizeRoles(user.roles).includes(role);
}

export function hasAnyRole(
  user: User | null | undefined,
  roles: Role[]
): boolean {
  if (!user?.roles) return false;
  const userRoles = normalizeRoles(user.roles);
  return roles.some((role) => userRoles.includes(role));
}

export function getInitials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
