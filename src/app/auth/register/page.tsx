"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez la plateforme de sécurité sociale"
      className="max-w-lg"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
