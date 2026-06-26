"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getPermissionsForRoles,
  hasAnyPermission,
  hasPermission,
  ROUTE_PERMISSIONS,
  type Permission,
} from "@/config/permissions";
import { normalizeRoles } from "@/lib/utils";
import { Role } from "@/types/enums";

export function usePermissions() {
  const { user } = useAuth();

  const roles = useMemo(
    () => normalizeRoles(user?.roles),
    [user?.roles]
  );

  const permissions = useMemo(
    () => getPermissionsForRoles(roles),
    [roles]
  );

  const checkPermission = useMemo(
    () => (permission: Permission) => hasPermission(roles, permission),
    [roles]
  );

  const checkAnyPermission = useMemo(
    () => (perms: Permission[]) => hasAnyPermission(roles, perms),
    [roles]
  );

  const canAccessRoute = useMemo(
    () => (route: string) => {
      const required = ROUTE_PERMISSIONS[route];
      if (!required || required.length === 0) return true;
      return hasAnyPermission(roles, required);
    },
    [roles]
  );

  const hasRole = useMemo(
    () => (role: Role) => roles.includes(role),
    [roles]
  );

  return {
    roles,
    permissions,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    canAccessRoute,
    hasRole,
  };
}
