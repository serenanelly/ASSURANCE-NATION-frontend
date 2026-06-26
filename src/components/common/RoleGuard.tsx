"use client";

import { Role } from "@/types/enums";
import type { Permission } from "@/config/permissions";
import { hasAnyPermission, hasPermission } from "@/config/permissions";
import { useAuth } from "@/context/AuthContext";
import { normalizeRoles } from "@/lib/utils";

export interface RoleGuardProps {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export function RoleGuard({
  children,
  roles,
  permissions,
  fallback = null,
  requireAll = false,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  const userRoles = normalizeRoles(user.roles);

  if (roles && roles.length > 0) {
    const hasRoleAccess = requireAll
      ? roles.every((role) => userRoles.includes(role))
      : roles.some((role) => userRoles.includes(role));

    if (!hasRoleAccess) {
      return <>{fallback}</>;
    }
  }

  if (permissions && permissions.length > 0) {
    const hasPermAccess = requireAll
      ? permissions.every((permission) =>
          hasPermission(userRoles, permission)
        )
      : hasAnyPermission(userRoles, permissions);

    if (!hasPermAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
