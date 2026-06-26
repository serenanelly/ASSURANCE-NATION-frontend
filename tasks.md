# ASSURANCE NATION Frontend Implementation Tasks

## Task Dependencies

```
Phase 1: Foundation
├── T1.1: Install & configure next-intl
├── T1.2: Create translation files (en.json, fr.json)
├── T1.3: Implement i18n middleware
├── T1.4: Create LanguageToggle component
├── T1.5: Enhance ThemeToggle component
└── T1.6: Update Header with theme & language toggles

Phase 2: Layout & Navigation
├── T2.1: Create Sidebar component (depends on T1)
├── T2.2: Create MainLayout & DashboardLayout (depends on T2.1)
├── T2.3: Create mobile menu/hamburger (depends on T2.2)
└── T2.4: Update routing structure (depends on T2.2)

Phase 3: Dashboard Pages
├── T3.1: Consultations list & detail page (depends on T2.4)
├── T3.2: Prescriptions list & detail page (depends on T2.4)
├── T3.3: Reimbursements list & stats page (depends on T2.4)
├── T3.4: User admin pages (depends on T2.4)
├── T3.5: Profile page (depends on T2.4)
└── T3.6: Settings page (depends on T2.4)

Phase 4: Forms & Validation
├── T4.1: ConsultationForm (depends on T3.1)
├── T4.2: PrescriptionForm (depends on T3.2)
├── T4.3: ReimbursementForm (depends on T3.3)
└── T4.4: UserForm (depends on T3.4)

Phase 5: Backend Integration
├── T5.1: Create useApi hook (depends on T1)
├── T5.2: Create useConsultations hook (depends on T5.1)
├── T5.3: Create useReimbursements hook (depends on T5.1)
├── T5.4: Create usePrescriptions hook (depends on T5.1)
├── T5.5: Create useUsers hook (depends on T5.1)
└── T5.6: Integrate hooks into pages (depends on T3 & T5.x)

Phase 6: Polish & Testing
├── T6.1: Responsive design refinement
├── T6.2: Color consistency audit
├── T6.3: Dark mode refinement
├── T6.4: i18n coverage audit
└── T6.5: Unit & E2E tests
```

## Detailed Tasks

### Phase 1: Foundation

**T1.1: Install & configure next-intl**
- Status: not_started
- Dependencies: none
- Subtasks:
  - Install `next-intl` package
  - Update tsconfig.json for path aliasing
  - Create i18n config in `src/i18n/config.ts`
  - Test build succeeds

**T1.2: Create translation files**
- Status: not_started
- Dependencies: T1.1
- Subtasks:
  - Create `src/i18n/locale/en.json` with all UI strings
  - Create `src/i18n/locale/fr.json` with French translations
  - Verify both files have identical structure
  - Document translation key naming convention

**T1.3: Implement i18n middleware**
- Status: not_started
- Dependencies: T1.2
- Subtasks:
  - Create `src/i18n/request.ts` with getRequestLocale helper
  - Update `src/middleware.ts` for locale routing
  - Test locale switching in browser (/en/..., /fr/...)
  - Verify default locale fallback

**T1.4: Create LanguageToggle component**
- Status: not_started
- Dependencies: T1.3
- Subtasks:
  - Build LanguageToggle component (EN/FR toggle)
  - Add locale persistence to localStorage
  - On change: redirect to new locale path
  - Show current locale indicator

**T1.5: Enhance ThemeToggle component**
- Status: not_started
- Dependencies: none
- Subtasks:
  - Update existing ThemeToggle to cycle Light → Dark → System
  - Add tooltip showing current theme
  - Verify persistence in localStorage
  - Test dark mode CSS loads correctly

**T1.6: Update Header with toggles**
- Status: not_started
- Dependencies: T1.4, T1.5
- Subtasks:
  - Place ThemeToggle and LanguageToggle in Header
  - Responsive positioning (top-right)
  - Test on mobile/tablet/desktop
  - Verify no styling conflicts

### Phase 2: Layout & Navigation

**T2.1: Create Sidebar component**
- Status: not_started
- Dependencies: T1.6
- Subtasks:
  - Build Sidebar with role-based menu items
  - Add active state indicator (left border)
  - Implement collapsible on mobile
  - Apply brand colors (primary light background)

**T2.2: Create MainLayout & DashboardLayout**
- Status: not_started
- Dependencies: T2.1
- Subtasks:
  - Create `src/components/layout/MainLayout.tsx` (Header + optional Sidebar)
  - Create `src/components/layout/DashboardLayout.tsx` (Header + Sidebar + main)
  - Apply responsive grid (desktop: sidebar + content, mobile: stacked)
  - Test layout on all breakpoints

**T2.3: Create mobile menu**
- Status: not_started
- Dependencies: T2.2
- Subtasks:
  - Add hamburger button on mobile (<640px)
  - Create overlay menu for navigation
  - Close on item click or outside click
  - Smooth animations

**T2.4: Update routing structure**
- Status: not_started
- Dependencies: T2.2
- Subtasks:
  - Reorganize `src/app` with layout groups: (auth), (public), (dashboard)
  - Update `src/middleware.ts` to handle all routes
  - Verify protected routes redirect to login
  - Test all routes accessible

### Phase 3: Dashboard Pages

**T3.1: Consultations list & detail page**
- Status: not_started
- Dependencies: T2.4
- Subtasks:
  - Create `/dashboard/consultations` page with table
  - Implement filters (date range, doctor, status)
  - Add pagination
  - Create `/dashboard/consultations/new` form page
  - Create `/dashboard/consultations/[id]` detail page
  - Connect to backend API (GET /consultations, POST, PUT, DELETE)

**T3.2: Prescriptions list & detail page**
- Status: not_started
- Dependencies: T2.4
- Subtasks:
  - Create `/dashboard/prescriptions` page with table
  - Add filters (status, doctor, date)
  - Implement create form
  - Create detail view with edit/delete
  - Connect to backend API

**T3.3: Reimbursements list & stats page**
- Status: not_started
- Dependencies: T2.4
- Subtasks:
  - Create `/dashboard/reimbursements` page with table
  - Add filters (status, date range)
  - Show stats: Total, approved, pending, rejected
  - Create `/dashboard/reimbursements/dashboard` stats page with charts
  - Connect to backend API

**T3.4: User admin pages**
- Status: not_started
- Dependencies: T2.4
- Subtasks:
  - Create `/dashboard/users` page (ASSUREUR/ADMIN only)
  - Implement tabs: Assurés, Médecins
  - Show UsersTable for each role
  - Add create/edit/delete functionality
  - Connect to backend API

**T3.5: Profile page**
- Status: not_started
- Dependencies: T2.4
- Subtasks:
  - Create `/dashboard/profile` page
  - Display user info (name, email, role, created date)
  - Add edit form (name, email, password)
  - Add avatar upload (optional)
  - Connect to backend API (GET /users/me, PUT)

**T3.6: Settings page**
- Status: not_started
- Dependencies: T1.6
- Subtasks:
  - Create `/dashboard/settings` page
  - Show theme preference selector (light/dark/system)
  - Show language preference selector (en/fr)
  - Add notifications toggle
  - Save settings to localStorage & backend

### Phase 4: Forms & Validation

**T4.1: ConsultationForm**
- Status: not_started
- Dependencies: T3.1
- Subtasks:
  - Build form with React Hook Form + Zod
  - Fields: Date, Doctor (select), Reason, Notes
  - Client-side validation
  - Error display with focus management
  - Submit handler with error toast

**T4.2: PrescriptionForm**
- Status: not_started
- Dependencies: T3.2
- Subtasks:
  - Build form with React Hook Form + Zod
  - Fields: Consultation (select), Medication, Dosage, Duration (1-365)
  - File upload (optional)
  - Validation: Duration range, required fields
  - Submit handler

**T4.3: ReimbursementForm**
- Status: not_started
- Dependencies: T3.3
- Subtasks:
  - Build form
  - Fields: Medical record (select), Amount, Description
  - Document upload
  - Validation: Positive amount
  - Submit handler

**T4.4: UserForm**
- Status: not_started
- Dependencies: T3.4
- Subtasks:
  - Build form for create/edit
  - Fields: Name, Email, Role (select), Password (on create)
  - Validation with Zod
  - Submit handler

### Phase 5: Backend Integration

**T5.1: Create useApi hook**
- Status: not_started
- Dependencies: T1.3
- Subtasks:
  - Build generic `useApi` hook in `src/hooks/useApi.ts`
  - Implement JWT interceptor (attach Bearer token)
  - Implement 401 refresh logic (retry or redirect)
  - Add error handling and type safety
  - Export request/response types

**T5.2: Create useConsultations hook**
- Status: not_started
- Dependencies: T5.1
- Subtasks:
  - Build hook with: list, detail, create, update, delete
  - Use React Query (TanStack) for caching
  - Implement error handling
  - Document usage

**T5.3: Create useReimbursements hook**
- Status: not_started
- Dependencies: T5.1
- Subtasks:
  - Build hook with CRUD + stats
  - Use React Query
  - Implement filtering/pagination

**T5.4: Create usePrescriptions hook**
- Status: not_started
- Dependencies: T5.1
- Subtasks:
  - Build hook with CRUD
  - Use React Query
  - Handle file uploads

**T5.5: Create useUsers hook**
- Status: not_started
- Dependencies: T5.1
- Subtasks:
  - Build hook with list, detail, create, update, delete
  - Filter by role (Assure, Medecin)
  - Use React Query

**T5.6: Integrate hooks into pages**
- Status: not_started
- Dependencies: T5.2, T5.3, T5.4, T5.5, T3
- Subtasks:
  - Update T3 pages to use hooks
  - Add loading spinners during fetch
  - Add error toast on failure
  - Test data flows end-to-end

### Phase 6: Polish & Testing

**T6.1: Responsive design refinement**
- Status: not_started
- Dependencies: T3, T4
- Subtasks:
  - Test all pages on mobile (320px), tablet (640px), desktop (1024px+)
  - Adjust spacing, font sizes, button sizes
  - Fix layout issues
  - Verify touch targets are at least 44x44px

**T6.2: Color consistency audit**
- Status: not_started
- Dependencies: T3, T4
- Subtasks:
  - Audit all components for brand color usage
  - Ensure links are primary blue
  - Ensure success states use accent green
  - Verify error states use red
  - Update any inconsistent components

**T6.3: Dark mode refinement**
- Status: not_started
- Dependencies: T6.2
- Subtasks:
  - Test all pages in dark mode
  - Verify readability (contrast ratios)
  - Update color vars if needed
  - Fix any CSS issues in dark mode

**T6.4: i18n coverage audit**
- Status: not_started
- Dependencies: T1.2, T3, T4
- Subtasks:
  - Audit all UI strings are translated
  - Verify en.json and fr.json have same keys
  - Test language switching on all pages
  - Add missing translations

**T6.5: Unit & E2E tests**
- Status: not_started
- Dependencies: T3, T4, T5
- Subtasks:
  - Write Vitest unit tests for components
  - Write Cypress E2E tests for critical flows
  - Verify test coverage >= 80%
  - Document test instructions

---

## Summary

- **Total Tasks**: 32 (organized in 6 phases)
- **Estimated Timeline**: 4-6 weeks (with full-time development)
- **Key Technologies**: next-intl, next-themes, React Query, Zod, Tailwind CSS, Axios
- **Target**: Fully functional, accessible, i18n-ready SaaS frontend
