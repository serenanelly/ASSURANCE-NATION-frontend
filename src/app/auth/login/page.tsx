import type { Metadata } from "next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenue"
      subtitle="Connectez-vous à votre espace ASSURANCE NATION"
    >
      <LoginForm />
    </AuthLayout>
  );
}
