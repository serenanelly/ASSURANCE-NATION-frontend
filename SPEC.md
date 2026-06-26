# ASSURANCE NATION — Frontend Design & Implementation Spec

## Overview
Enhance the frontend with a coherent design system, multi-language support (English/French), refined light/dark theme, and complete backend integration for all dashboard pages.

**Target**: Cohesive, accessible, responsive SaaS platform with consistent branding and user experience.

---

## 1. Design System

### 1.1 Brand Colors & Theme

**Primary Palette** (Tailwind extended colors):
- Primary: `#0066CC` (bright blue)
- Primary Dark: `#003366` (navy)
- Primary Light: `#E6F2FF` (very light blue)
- Accent: `#00AA44` (green)

**Semantic Colors**:
- Success: `#10b981` (emerald)
- Error: `#ef4444` (red)
- Warning: `#f59e0b` (amber)
- Info: `#3b82f6` (blue)

**Light Mode (`:root`)**: White backgrounds, dark text
**Dark Mode (`.dark`)**: Slate/charcoal backgrounds, light text

**CSS Variables** (persisted in theme.css & dark-mode.css):
```
--color-primary: #0066CC
--color-primary-dark: #003366
--color-accent: #00AA44
--color-white: #ffffff (light) | #1f2937 (dark)
--color-text: #1f2937 (light) | #f3f4f6 (dark)
--background: #ffffff (light) | #0f172a (dark)
```

**Implementation**:
- Tailwind `darkMode: "class"` (already configured)
- Theme provider: `next-themes` (already set up)
- CSS vars fallbacks in `:root` and `.dark`
- Persist theme choice in localStorage

---

### 1.2 Typography

**Font Stack**: Inter, system fonts (already in tailwind.config.ts)

**Scale**:
- `text-xs`: 12px (labels, badges)
- `text-sm`: 14px (secondary text, help)
- `text-base`: 16px (body default)
- `text-lg`: 18px (section headers)
- `text-xl`: 20px (page titles)
- `text-2xl`: 24px (main headings)

**Weight**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

---

### 1.3 Spacing & Layout

**Unit**: 0.5rem (8px base)
```
xs: 0.25rem (2px)
sm: 0.5rem (4px)
md: 1rem (8px)
lg: 1.5rem (12px)
xl: 2rem (16px)
```

**Layout Grid**: Tailwind 12-column grid, 1rem gutter

**Responsive Breakpoints**:
- Mobile: 320px–639px
- Tablet: 640px–1023px
- Desktop: 1024px+

---

### 1.4 Components & Patterns

**Core Components** (already exist, need refinement):
- Button (primary, secondary, outline, ghost)
- Input (text, email, password, select, radio, checkbox)
- Card (with header, body, footer)
- Modal (with overlay, backdrop)
- Table (with pagination, sorting, filtering)
- Tabs & Breadcrumb
- Badge, Spinner, Toast
- ThemeToggle (sun/moon icons)
- RoleGuard (RBAC wrapper)

**Layout Components**:
- Header (logo, nav, user menu, theme toggle, language toggle)
- Sidebar (role-based menu items)
- Main content wrapper

**Form Components**:
- Form wrapper with Zod validation
- ConsultationForm, PrescriptionForm, ReimbursementForm, UserForm

**Dashboard Components**:
- StatCard (metric display)
- ReimbursementChart (Recharts line/bar chart)
- RecentActivity (timeline list)
- ConsultationsTable, ReimbursementsTable, UsersTable

---

## 2. Internationalization (i18n)

### 2.1 Implementation Strategy

Use `next-intl` library for:
- Locale routing (`/en/...`, `/fr/...`)
- Translation files (JSON)
- Type-safe translations in components
- Locale switcher in header

**NOT using** context workaround — proper i18n middleware.

### 2.2 Structure

```
src/
├── i18n/
│   ├── locale/
│   │   ├── en.json       (English translations)
│   │   ├── fr.json       (French translations)
│   ├── request.ts        (getRequestLocale helper)
│   └── config.ts         (i18n config: locales, defaultLocale)
├── middleware.ts         (i18n routing middleware)
```

### 2.3 Translation Keys

**Namespaced keys** (dot notation in JSON):
```json
{
  "common": {
    "appName": "ASSURANCE NATION",
    "home": "Home",
    "logout": "Logout",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "email": "Email address",
    "password": "Password"
  },
  "dashboard": {
    "consultations": "Medical Consultations",
    "prescriptions": "Prescriptions",
    "reimbursements": "Reimbursements"
  }
}
```

**Locales**: `en`, `fr`
**Default**: `en`
**Persistence**: localStorage key `NEXT_PUBLIC_LOCALE`

---

## 3. Theme Management

### 3.1 ThemeProvider Enhancement

**Features**:
- `next-themes` ThemeProvider wrapping app
- `useTheme()` hook in components
- Themes: `light`, `dark`, `system`
- Persist in localStorage (`theme`)

### 3.2 ThemeToggle Component

**Location**: `src/components/common/ThemeToggle.tsx`

**Behavior**:
- Button with Sun (light) / Moon (dark) icon
- Cycle: Light → Dark → System → Light
- Show current theme label on hover
- Use Lucide icons (`Sun`, `Moon`, `Settings`)

**Placement**: Header (top-right, before language toggle)

---

## 4. Language Toggle

### 4.1 LanguageToggle Component

**Location**: `src/components/common/LanguageToggle.tsx`

**Design**:
- Dropdown or button toggle: "EN" | "FR"
- Use flag emoji or ISO code
- On change: update localStorage + redirect to new locale
- Current locale highlighted

**Placement**: Header (top-right, after theme toggle)

---

## 5. Header & Navigation

### 5.1 Header Layout

```
[Logo] [Nav] [Theme Toggle] [Language Toggle] [User Menu]
```

**Responsive**:
- Desktop (1024px+): Full horizontal nav
- Tablet/Mobile: Hamburger menu → Sidebar overlay

### 5.2 Header Components

**Logo**: Clickable → `/` (home) or `/dashboard` (if authenticated)

**Nav Items** (role-based):
- Public: Home, About, Contact
- PATIENT: Consultations, Prescriptions, Reimbursements, Profile
- MEDECIN: Patients (list), Consultations, Medical Records, Profile
- ASSUREUR: Users (admin), Reimbursements, Reports, Profile
- ADMIN: All + Settings

**User Menu** (dropdown):
- Profile (→ /dashboard/profile)
- Settings (→ /dashboard/settings)
- Logout
- Divider
- Logout

---

## 6. Sidebar (Dashboard Only)

### 6.1 Sidebar Structure

**Sticky left sidebar** (on desktop, hidden on mobile):
```
Logo
---
Dashboard Home
Consultations
Prescriptions
Reimbursements
[Divider]
Users (ASSUREUR/ADMIN only)
Medical Records (MEDECIN only)
[Divider]
Profile
Settings
[Divider]
Logout
```

**Styling**:
- Background: `bg-primary-light` (light) or `bg-slate-900` (dark)
- Text: Primary color on hover
- Active indicator: Left border accent
- Collapsible on mobile

---

## 7. Color Application Guide

### 7.1 Button Variants

- **Primary**: `bg-primary text-white` (CTAs, form submit)
- **Secondary**: `bg-gray-200 text-primary` (secondary actions)
- **Accent**: `bg-accent text-white` (special actions, confirmations)
- **Outline**: `border border-primary text-primary`
- **Ghost**: Text only, hover underline

### 7.2 Badges & Status

- Success: `bg-success/10 text-success border-success/20`
- Error: `bg-error/10 text-error border-error/20`
- Warning: `bg-warning/10 text-warning border-warning/20`
- Info: `bg-info/10 text-info border-info/20`

### 7.3 Links & Interactive

- Links: `text-primary hover:underline`
- Focus rings: `focus:ring-2 ring-primary`
- Hover states: Opacity + color shift

---

## 8. Backend Integration

### 8.1 API Configuration

**Base URL**: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:8080/api/v1`)

**Interceptors**:
- **Request**: Attach `Authorization: Bearer <token>` from localStorage
- **Response**: 401 → refresh token via `POST /auth/refresh` → retry | redirect to login

### 8.2 Hooks for Data Fetching

**Custom hooks** (in `src/hooks/`):
- `useAuth()`: Login, register, logout, user state
- `useApi()`: Generic fetch wrapper with JWT + error handling
- `useConsultations()`: List, detail, create, update, delete
- `useReimbursements()`: CRUD operations
- `usePrescriptions()`: CRUD operations
- `useUsers()`: User admin operations

**Data Fetching Library**: React Query (TanStack Query) — already installed

---

## 9. Page Structure & Routes

### 9.1 Authentication Pages

**`/auth/login`**
- LoginForm component (email + password)
- Error toast on failure
- Success → redirect to `/dashboard`
- Forgot password link

**`/auth/register`**
- RegisterForm component (name, email, password, role select)
- Email validation, password strength
- Success → redirect to login

**`/auth/forgot-password`**
- Email input form
- Link sent toast
- Verification code input (if implemented)

### 9.2 Public Pages

**`/`** (Home)
- Hero section with brand messaging
- Features overview
- CTA buttons: Login, Register
- Responsive, light/dark support

### 9.3 Dashboard Pages

All under `/dashboard`:

**`/dashboard`** (Main dashboard)
- Role-based overview
- StatCards: Total consultations, pending reimbursements, active prescriptions
- Recent activity (consultations, prescriptions, reimbursements)
- Charts: Reimbursement trends, consultation frequency

**`/dashboard/consultations`**
- Table: Consultations list (date, doctor, status, actions)
- Filters: Date range, doctor, status
- Pagination
- Create button → `/dashboard/consultations/new`

**`/dashboard/consultations/new`**
- ConsultationForm: date, doctor (select), reason, notes
- Submit → POST `/consultations` → redirect to list + toast

**`/dashboard/consultations/[id]`**
- Consultation detail view
- Edit button (if owner or MEDECIN/ASSUREUR)
- Delete button (if ASSUREUR/ADMIN)
- Related prescriptions section

**`/dashboard/prescriptions`**
- PrescriptionsTable: Medication, dosage, duration, status
- Create button
- Filters: Status, doctor, date range

**`/dashboard/prescriptions/new`**
- PrescriptionForm: Select consultation, medication, dosage, duration (1-365 days)
- File upload (optional)
- Submit → POST `/prescriptions`

**`/dashboard/reimbursements`**
- ReimbursementsTable: Amount, date, status, actions
- Filters: Status (PENDING, APPROVED, REJECTED), date
- Stats summary: Total claimed, approved, pending

**`/dashboard/reimbursements/new`**
- ReimbursementForm: Select medical record, amount, description
- Document upload
- Submit → POST `/reimbursements`

**`/dashboard/reimbursements/dashboard`**
- Stats: Total, approved, pending, rejected
- Charts: Monthly trends, category breakdown
- Export button (optional)

**`/dashboard/users`** (ASSUREUR/ADMIN only)
- Two tabs: Assurés, Médecins
- UsersTable for each role
- Create button, delete, edit

**`/dashboard/profile`**
- User info: Name, email, role, created date
- Edit button: Update name, email, password
- Avatar upload (optional)

**`/dashboard/settings`**
- Theme preference (light/dark/system)
- Language preference (en/fr)
- Notifications toggle
- Save button

---

## 10. Implementation Phases

### Phase 1: Foundation (i18n + Theme)
- [ ] Install & configure `next-intl`
- [ ] Create translation files (en.json, fr.json)
- [ ] Implement middleware for locale routing
- [ ] Create LanguageToggle component
- [ ] Enhance ThemeToggle with cycle logic
- [ ] Update Header with both toggles

### Phase 2: Layout & Navigation
- [ ] Create/refine Sidebar component
- [ ] Update Header with responsive nav
- [ ] Create RoleGuard wrapper for pages
- [ ] Implement mobile hamburger menu

### Phase 3: Dashboard Pages (with Backend Integration)
- [ ] Consultations list & detail + API integration
- [ ] Prescriptions list & detail + API integration
- [ ] Reimbursements list, detail, stats + API integration
- [ ] User admin pages (if ASSUREUR/ADMIN)
- [ ] Profile page (user data + edit)
- [ ] Settings page (theme/language toggles)

### Phase 4: Forms & Validation
- [ ] ConsultationForm with Zod validation
- [ ] PrescriptionForm with file upload
- [ ] ReimbursementForm with document upload
- [ ] Form error handling + success toast

### Phase 5: Polish & Testing
- [ ] Responsive design refinement
- [ ] Color consistency audit
- [ ] Dark mode refinement
- [ ] i18n coverage audit (all UI strings translated)
- [ ] Component tests
- [ ] E2E tests (Cypress)

---

## 11. Files to Create/Modify

### Create:
```
src/i18n/
├── locale/
│   ├── en.json
│   ├── fr.json
├── config.ts
└── request.ts

src/components/common/
├── LanguageToggle.tsx
├── Header.tsx (enhanced)
├── Sidebar.tsx

src/components/layout/
├── MainLayout.tsx
├── DashboardLayout.tsx

src/hooks/
├── useApi.ts
├── useConsultations.ts
├── useReimbursements.ts
├── usePrescriptions.ts
├── useUsers.ts

src/app/
├── (auth)/layout.tsx
├── (auth)/login/page.tsx
├── (auth)/register/page.tsx
├── (public)/layout.tsx
├── (public)/page.tsx
├── (dashboard)/layout.tsx
├── (dashboard)/page.tsx
├── (dashboard)/consultations/page.tsx
├── (dashboard)/prescriptions/page.tsx
├── (dashboard)/reimbursements/page.tsx
├── (dashboard)/users/page.tsx
├── (dashboard)/profile/page.tsx
├── (dashboard)/settings/page.tsx
```

### Modify:
```
src/app/layout.tsx (add i18n provider)
src/config/site.ts (add locale config)
src/styles/theme.css (enhance CSS vars)
src/styles/dark-mode.css (enhance dark mode)
tailwind.config.ts (ensure colors are correct)
src/middleware.ts (add i18n routing)
```

---

## 12. Testing Strategy

- **Unit tests**: Components with Vitest
- **E2E tests**: Cypress for critical flows (login, consultation creation, reimbursement request)
- **Visual tests**: Cross-browser (light/dark, mobile/desktop)
- **i18n tests**: Verify translations are present for all UI strings
- **Accessibility**: WCAG 2.1 AA compliance check

---

## 13. Success Criteria

✅ Light/dark theme toggle works seamlessly
✅ English/French language switching (all UI strings translated)
✅ Brand colors consistent across all pages
✅ All dashboard pages connected to backend API
✅ Forms submit data correctly with validation
✅ Responsive design (mobile 320px, tablet, desktop)
✅ RBAC enforced (role-based visibility)
✅ User session persisted (JWT in localStorage)
✅ Error handling with toast notifications
✅ Loading states for async operations

---

## Next Steps

1. Review this spec
2. Proceed with **Phase 1: Foundation** (i18n + theme)
3. Build out header/sidebar layout
4. Implement dashboard pages with backend integration
5. Test across browsers and devices
