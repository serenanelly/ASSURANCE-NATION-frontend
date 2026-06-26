export const siteConfig = {
  name: "ASSURANCE NATION",
  description:
    "Plateforme de gestion des consultations médicales, prescriptions et remboursements de sécurité sociale",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "fr-FR",
  defaultTheme: (process.env.NEXT_PUBLIC_DEFAULT_THEME ?? "light") as
    | "light"
    | "dark"
    | "system",
  features: {
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== "false",
    pdfExport: process.env.NEXT_PUBLIC_ENABLE_PDF_EXPORT !== "false",
  },
  links: {
    support: "mailto:support@assurance-nation.local",
    docs: "/docs",
  },
} as const;
