import { Role } from "@/types/enums";
import { routes } from "./routes";

export type Permission =
  | "consultations:read"
  | "consultations:create"
  | "consultations:update"
  | "consultations:delete"
  | "prescriptions:read"
  | "prescriptions:create"
  | "prescriptions:delete"
  | "reimbursements:read"
  | "reimbursements:create"
  | "reimbursements:approve"
  | "reimbursements:reject"
  | "reimbursements:pay"
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "medical-records:read"
  | "dashboard:stats";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    "consultations:read",
    "consultations:create",
    "consultations:update",
    "consultations:delete",
    "prescriptions:read",
    "prescriptions:create",
    "prescriptions:delete",
    "reimbursements:read",
    "reimbursements:create",
    "reimbursements:approve",
    "reimbursements:reject",
    "reimbursements:pay",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "medical-records:read",
    "dashboard:stats",
  ],
  [Role.MEDECIN]: [
    "consultations:read",
    "consultations:create",
    "consultations:update",
    "consultations:delete",
    "prescriptions:read",
    "prescriptions:create",
    "prescriptions:delete",
    "medical-records:read",
  ],
  [Role.ASSUREUR]: [
    "consultations:read",
    "prescriptions:read",
    "reimbursements:read",
    "reimbursements:create",
    "reimbursements:approve",
    "reimbursements:reject",
    "reimbursements:pay",
    "users:read",
    "users:create",
    "users:update",
    "medical-records:read",
    "dashboard:stats",
  ],
  [Role.PATIENT]: [
    "consultations:read",
    "prescriptions:read",
    "reimbursements:read",
    "medical-records:read",
  ],
};

export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  [routes.dashboard.root]: ["dashboard:stats", "consultations:read"],
  [routes.dashboard.consultations]: ["consultations:read"],
  [routes.dashboard.consultationNew]: ["consultations:create"],
  [routes.dashboard.prescriptions]: ["prescriptions:read"],
  [routes.dashboard.prescriptionNew]: ["prescriptions:create"],
  [routes.dashboard.reimbursements]: ["reimbursements:read"],
  [routes.dashboard.reimbursementNew]: ["reimbursements:create"],
  [routes.dashboard.reimbursementStats]: ["dashboard:stats"],
  [routes.dashboard.medicalRecords]: ["medical-records:read"],
  [routes.dashboard.users]: ["users:read"],
  [routes.dashboard.usersAssures]: ["users:read"],
  [routes.dashboard.usersMedecins]: ["users:read"],
  [routes.dashboard.usersAssuresNew]: ["users:create"],
  [routes.dashboard.usersMedecinsNew]: ["users:create"],
  [routes.dashboard.profile]: [],
  [routes.dashboard.settings]: [],
};

export function getPermissionsForRoles(roles: Role[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach((role) => {
    ROLE_PERMISSIONS[role]?.forEach((permission) => permissions.add(permission));
  });
  return Array.from(permissions);
}

export function hasPermission(roles: Role[], permission: Permission): boolean {
  return getPermissionsForRoles(roles).includes(permission);
}

export function hasAnyPermission(
  roles: Role[],
  permissions: Permission[]
): boolean {
  const userPermissions = getPermissionsForRoles(roles);
  return permissions.some((permission) => userPermissions.includes(permission));
}
