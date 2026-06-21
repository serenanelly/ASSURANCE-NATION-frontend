import Link from "next/link";
import { FileQuestion } from "@/components/icons";
import { Button } from "@/components/common/Button";
import { routes } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-primary">
          <FileQuestion className="mx-auto h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-6 text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Page introuvable
        </h2>
        <p className="mt-3 max-w-md text-muted">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href={routes.home}>
            <Button>Retour à l&apos;accueil</Button>
          </Link>
          <Link href={routes.auth.login}>
            <Button variant="secondary">Se connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
