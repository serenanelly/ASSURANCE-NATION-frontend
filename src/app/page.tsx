import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  HeartPulse,
  Shield,
  Stethoscope,
  Users,
  Wallet,
} from "@/components/icons";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";
import { routes } from "@/config/routes";

const features = [
  {
    icon: Stethoscope,
    title: "Consultations médicales",
    description:
      "Planifiez, gérez et suivez les consultations entre médecins et assurés en temps réel.",
  },
  {
    icon: FileText,
    title: "Prescriptions numériques",
    description:
      "Prescriptions médicaments et orientations spécialistes avec traçabilité complète.",
  },
  {
    icon: Wallet,
    title: "Remboursements automatisés",
    description:
      "Calcul automatique à 100 % (généraliste) ou 80 % (spécialiste) avec justificatifs PDF.",
  },
  {
    icon: Shield,
    title: "Sécurité & conformité",
    description:
      "Authentification JWT, journal d'audit immuable et contrôle d'accès par rôle (RBAC).",
  },
];

const stats = [
  { value: "10 000+", label: "Consultations gérées" },
  { value: "98 %", label: "Taux de satisfaction" },
  { value: "< 48h", label: "Délai moyen de remboursement" },
  { value: "100 %", label: "Traçabilité des actes" },
];

const roles = [
  {
    icon: Stethoscope,
    title: "Médecin",
    description:
      "Créez des consultations, rédigez des prescriptions et suivez l'historique de vos patients.",
    color: "from-primary to-primary-dark",
  },
  {
    icon: Users,
    title: "Assureur",
    description:
      "Inscrivez assurés et médecins, validez les remboursements et consultez les tableaux de bord KPI.",
    color: "from-accent to-green-700",
  },
  {
    icon: HeartPulse,
    title: "Patient / Assuré",
    description:
      "Accédez à votre dossier médical, suivez vos prescriptions et l'état de vos remboursements.",
    color: "from-navy to-primary-dark",
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-primary-dark to-primary px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Shield className="h-4 w-4" aria-hidden />
              Plateforme de sécurité sociale
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              La gestion santé,{" "}
              <span className="text-accent">simplifiée</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              Consultations, prescriptions et remboursements réunis dans une
              plateforme sécurisée pour médecins, assureurs et patients.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={routes.auth.login}>
                <Button size="lg" variant="accent" icon={<ArrowRight className="h-5 w-5" />}>
                  Se connecter
                </Button>
              </Link>
              <Link href={routes.auth.register}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/30 text-white hover:bg-white/10"
                >
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Fonctionnalités clés
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Une suite complète pour digitaliser les parcours de soins et de
              remboursement.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-card p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700"
              >
                <div className="text-primary">
                  <feature.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        id="statistiques"
        className="bg-gradient-to-r from-primary to-navy px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-background px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Un espace pour chaque acteur
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Des interfaces adaptées à chaque rôle avec un contrôle d&apos;accès
              granulaire.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-card shadow-sm dark:border-gray-700"
              >
                <div
                  className={`bg-gradient-to-r ${role.color} px-6 py-8 text-white`}
                >
                  <role.icon className="h-10 w-10" aria-hidden />
                  <h3 className="mt-4 text-xl font-bold">{role.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-16 dark:border-gray-800 dark:bg-gray-900/50 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <BarChart3 className="h-10 w-10 text-primary" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            Prêt à moderniser votre gestion santé ?
          </h2>
          <p className="mt-3 text-muted">
            Rejoignez ASSURANCE NATION et accédez à votre tableau de bord en
            quelques clics.
          </p>
          <Link href={routes.auth.login} className="mt-8">
            <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
