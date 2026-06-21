"use client";

import Link from "next/link";
import { Mail } from "@/components/icons";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/common/Button";
import { routes } from "@/config/routes";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Réinitialisation du mot de passe"
    >
      <div className="space-y-6 text-center">
        <div className="text-primary">
          <Mail className="mx-auto h-7 w-7" aria-hidden />
        </div>

        <p className="text-sm text-muted">
          La réinitialisation du mot de passe par email sera disponible
          prochainement. En attendant, veuillez contacter votre administrateur
          ou le support technique.
        </p>

        <Link href={routes.auth.login} className="block">
          <Button variant="secondary" fullWidth type="button">
            Retour à la connexion
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
