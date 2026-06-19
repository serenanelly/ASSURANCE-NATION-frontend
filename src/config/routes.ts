export const routes = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
  },
  dashboard: {
    root: "/dashboard",
    consultations: "/dashboard/consultations",
    consultationNew: "/dashboard/consultations/new",
    consultationDetail: (id: string) => `/dashboard/consultations/${id}`,
    prescriptions: "/dashboard/prescriptions",
    prescriptionNew: "/dashboard/prescriptions/new",
    prescriptionDetail: (id: string) => `/dashboard/prescriptions/${id}`,
    reimbursements: "/dashboard/reimbursements",
    reimbursementNew: "/dashboard/reimbursements/new",
    reimbursementDetail: (id: string) => `/dashboard/reimbursements/${id}`,
    reimbursementStats: "/dashboard/reimbursements/dashboard",
    medicalRecords: "/dashboard/medical-records",
    medicalRecordDetail: (id: string) => `/dashboard/medical-records/${id}`,
    users: "/dashboard/users",
    usersAssures: "/dashboard/users/assures",
    usersAssuresNew: "/dashboard/users/assures/new",
    usersAssureDetail: (id: string) => `/dashboard/users/assures/${id}`,
    usersMedecins: "/dashboard/users/medecins",
    usersMedecinsNew: "/dashboard/users/medecins/new",
    usersMedecinDetail: (id: string) => `/dashboard/users/medecins/${id}`,
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
  },
} as const;

export const publicRoutes = [
  routes.home,
  routes.auth.login,
  routes.auth.register,
  routes.auth.forgotPassword,
] as const;

export const protectedRoutePrefix = "/dashboard";
