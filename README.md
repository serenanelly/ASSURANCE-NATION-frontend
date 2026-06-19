# ASSURANCE NATION — Frontend

Interface web Next.js pour la plateforme de gestion des consultations médicales, prescriptions et remboursements de sécurité sociale.

## Prérequis

- Node.js 18+
- npm 9+
- Backend Spring Boot en cours d'exécution (voir [backend README](../backend/README.md))

## Installation

```bash
cd frontend
npm install
```

## Configuration

Copiez le fichier d'exemple et adaptez les variables :

```bash
cp .env.example .env.local
```

| Variable | Description | Valeur par défaut |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_APP_URL` | URL du frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_DEFAULT_THEME` | Thème par défaut (`light`, `dark`, `system`) | `light` |
| `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` | Activer les toasts | `true` |
| `NEXT_PUBLIC_ENABLE_PDF_EXPORT` | Activer l'export PDF | `true` |

## Démarrage

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@assurance-nation.local` | `admin123` |
| Médecin | `medecin.demo@assurance-nation.local` | `Password1!` |
| Patient | `patient.demo@assurance-nation.local` | `Password1!` |

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run test:coverage` | Tests avec couverture de code |
| `npm run cypress:open` | Interface Cypress (E2E) |
| `npm run cypress:run` | Tests E2E en mode headless |

## Tests

### Tests unitaires

```bash
npm run test
npm run test:coverage
```

### Tests E2E (Cypress)

Démarrez le serveur de développement, puis :

```bash
npm run cypress:open   # mode interactif
npm run cypress:run    # mode CI
```

## Structure du projet

```
src/
├── app/              # Pages Next.js (App Router)
├── components/       # Composants réutilisables
│   ├── common/       # Button, Input, Card, etc.
│   ├── forms/        # Formulaires (Login, ChangePassword, etc.)
│   ├── layout/       # PublicLayout, AuthLayout
│   └── dashboard/    # StatCard, ReimbursementChart
├── config/           # Routes, API, site
├── context/          # Auth, Notifications
├── hooks/            # Hooks personnalisés
├── lib/              # API client, validators, utils
├── styles/           # CSS global et thème
└── types/            # Types TypeScript
```

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **UI** : React 18, Tailwind CSS, Lucide icons
- **État** : React Query, Context API
- **Formulaires** : React Hook Form + Zod
- **Thème** : next-themes (clair / sombre)
- **Tests** : Vitest, Testing Library, Cypress

## Couleurs de la marque

| Couleur | Hex |
|---|---|
| Primary | `#0066CC` |
| Navy | `#003366` |
| Accent | `#00AA44` |
