"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { routes } from "@/config/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          Une erreur est survenue
        </h1>
        <p className="mt-3 max-w-md text-muted">
          Nous sommes désolés, un problème inattendu s&apos;est produit. Veuillez
          réessayer ou retourner à l&apos;accueil.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Réessayer</Button>
          <Link href={routes.home}>
            <Button variant="secondary">Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
