export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  timeout: 30_000,
  jwtExpiration: Number(process.env.NEXT_PUBLIC_JWT_EXPIRATION ?? 900_000),
  refreshTokenExpiration: Number(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRATION ?? 604_800_000
  ),
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      refresh: "/auth/refresh",
      logout: "/auth/logout",
      validate: "/auth/validate",
    },
    users: "/users",
    userPassword: (id: string) => `/users/${id}/password`,
    medecins: "/users/medecins",
    assures: "/users/assures",
    consultations: "/consultations",
    prescriptions: "/prescriptions",
    medicalRecords: "/medical-records",
    reimbursements: "/reimbursements",
    reimbursementsDashboard: "/reimbursements/dashboard",
    health: "/health",
  },
} as const;
