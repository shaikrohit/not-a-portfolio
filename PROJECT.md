# Project: not-a-portfolio (Phases 7–12 Capability Showcase)

## Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables (`globals.css`, `theme.css`, `premium.css`) + View Transitions
- **Animation & 3D**: Framer Motion + Lightweight Canvas 2D spherical engine (zero-bundle, battery-saving) + CSS Keyframes
- **State & Data**: Zustand (`useThemeStore`, `usePathStore`) + Supabase (PostgreSQL + RLS) + Resend HTTP Email API
- **Layer Boundaries**:
  - `src/app/`: Next.js pages, layouts, and API routes (`/api/contact/route.ts`).
  - `src/components/layout/`: Global layout components (`Navigation`, `Footer`, `ThemeProvider`, `MorphingBackground`, `CursorGlow`, `SmoothScroll`).
  - `src/components/sections/`: Page sections (`HeroSection`, `PathSelectionSection`, `AboutSection`, `ExperienceSection`, `EducationSection`, `AchievementsSection`, `ProjectsSection`, `SkillsSection`, `TriviaGame`, `ContactSection`).
  - `src/components/contact/`: Dedicated contact module (`ContactForm`, `SocialOrbit`, `ContactInfoCards`).
  - `src/components/ui/`: Reusable primitives (`Button`, `Card`, `Input`, `TiltCard`, `MagneticButton`, `AnimatedCounter`, `SectionDivider`).
  - `src/hooks/`: Custom React hooks (`usePrefersReducedMotion`, `useMediaQuery`, `useActiveSection`).
  - `src/lib/`: External services (`supabase.ts`, `resend.ts`).
  - `src/types/`: TypeScript definitions (`ContactFormData`, `DBVisitorMessage`, `Project`, `ThemeMode`).

## Feature Inventory

| #   | Feature                             | Description                                                                                                                | Milestone | Source        |
| --- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| 1   | Contact Form UI & Validation        | Client-side validation for name, email, message with 5 visual states (pristine, valid, invalid, submitting, success/error) | M1        | Survey 1 / R1 |
| 2   | Contact API Route & Supabase        | Server-side validation, Supabase insertion into `visitor_messages` with schema fallback                                    | M1        | Survey 1 / R1 |
| 3   | Resend Email Notifications          | Dispatch formatted notification email to `shaik.rohit.official@gmail.com` via native fetch to Resend API                   | M1        | Survey 1 / R1 |
| 4   | Social Links Orbit / Grid           | Interactive rotating orbit linking to verified GitHub, LinkedIn, Email, and Portfolio URLs                                 | M1        | Survey 1 / R1 |
| 5   | Supabase Schema Migration           | Add `name` column to `visitor_messages` table in `supabase/migrations/`                                                    | M1        | Survey 1 / R1 |
| 6   | Border Token Syntax Bug Fix         | Fix `--border-subtle` and `--border-light` shorthand CSS syntax error in `globals.css` and `theme.css`                     | M2        | Survey 2 / R3 |
| 7   | FOUT Elimination                    | Inline `<head>` script in `layout.tsx` to read `localStorage` before paint and set `.dark`                                 | M2        | Survey 2 / R3 |
| 8   | Background & UI Theme Adoption      | Fix `MorphingBackground.tsx` `bg-white` and migrate UI components (`Button`, `Card`, `Input`, `Text`) to CSS variables     | M2        | Survey 2 / R3 |
| 9   | Glassmorphic Command-Bar Navigation | Refactor `Navigation.tsx` with glassmorphic command-bar styling and `IntersectionObserver` active indicator                | M2        | Survey 2 / R2 |
| 10  | Mobile Drawer Navigation            | Slide-out mobile drawer with backdrop overlay scrim, body scroll lock, and ESC key handling                                | M2        | Survey 2 / R2 |
| 11  | Section Dividers                    | Create `SectionDivider.tsx` with SVG wave/curve transitions between major page sections                                    | M2        | Survey 2 / R2 |
| 12  | Touch & Pointer Coarse Guards       | Disable 3D tilt and mouse tracking on touch devices (`@media (pointer: coarse)`) in `TiltCard` and `MagneticButton`        | M3        | Survey 3 / R4 |
| 13  | Centralized Motion & Media Hooks    | Create `usePrefersReducedMotion` and `useMediaQuery` hooks and integrate with components                                   | M3        | Survey 3 / R4 |
| 14  | Fluid Typography Clamps             | Implement responsive fluid typography with CSS `clamp()` for hero headings and titles                                      | M3        | Survey 3 / R4 |
| 15  | Offscreen Content-Visibility        | Apply `content-visibility: auto; contain-intrinsic-size: 800px;` to heavy below-the-fold sections                          | M3        | Survey 3 / R5 |
| 16  | Semantic HTML Enhancement           | Replace container `div`s with semantic `<article>` tags in project, experience, and achievement cards                      | M3        | Survey 3 / R6 |
| 17  | ARIA & Accessibility Attributes     | Add `aria-expanded` and `aria-controls` to mobile menu toggle, ensure WCAG compliance                                      | M3        | Survey 3 / R6 |
| 18  | SEO JSON-LD Person Schema           | Inject `schema.org/Person` metadata into `src/app/layout.tsx`                                                              | M3        | Survey 3 / R6 |
| 19  | E2E & Integration Test Suite        | Automated test suite verifying Tiers 1-4 for Contact, Navigation, Theme, and Layout                                        | M4        | Survey 3 / R7 |
| 20  | Code Quality & Format Cleanliness   | Format codebase with Prettier, run `type-check`, `lint`, and `build` verification with 0 errors                            | M4        | Survey 3 / R7 |

## Milestones

| #   | Name                                                     | Scope                               | Dependencies | Status |
| --- | -------------------------------------------------------- | ----------------------------------- | ------------ | ------ |
| M1  | Contact & Backend Integration (Phase 7)                  | Features 1, 2, 3, 4, 5              | none         | DONE   |
| M2  | Navigation & Theme Redesign (Phases 8 & 9)               | Features 6, 7, 8, 9, 10, 11         | none         | DONE   |
| M3  | Responsiveness, Performance & Polish (Phases 10, 11, 12) | Features 12, 13, 14, 15, 16, 17, 18 | M2           | DONE   |
| M4  | E2E Testing Suite & Quality Verification (R7)            | Features 19, 20                     | M1, M2, M3   | DONE   |

## Interface Contracts

### 1. Contact Form Client ↔ API Route (`/api/contact`)

- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string (min 2 chars, required)",
    "email": "string (valid email format, required)",
    "message": "string (min 10 chars, max 5000 chars, required)",
    "visitorType": "'developer' | 'recruiter' | 'student' | 'explorer' (optional, default: 'developer')",
    "sessionId": "string (optional)"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Thank you! Your message has been received."
  }
  ```
- **Error Response** (`400 Bad Request` or `500 Internal Server Error`):
  ```json
  {
    "success": false,
    "error": "Detailed validation or server error message"
  }
  ```

### 2. Active Section Navigation ↔ Page Sections

- Each target section must possess an `id` matching the `navItems` array (`about`, `experience`, `education`, `achievements`, `projects`, `skills`, `trivia`, `contact`).
- `useActiveSection` observes sections via `IntersectionObserver` with `rootMargin: '-20% 0px -70% 0px'` and updates `activeSection` state.

### 3. Theme System Tokens

- CSS Variables in `:root` and `:root[data-theme="dark"]`:
  - `--border-subtle`: `rgba(0, 0, 0, 0.08)` (light) / `rgba(255, 255, 255, 0.08)` (dark)
  - `--border-light`: `rgba(0, 0, 0, 0.14)` (light) / `rgba(255, 255, 255, 0.14)` (dark)
  - `--surface-base`: `#ffffff` (light) / `#07090e` (dark)
  - `--surface-card`: `rgba(255, 255, 255, 0.9)` (light) / `rgba(13, 17, 23, 0.85)` (dark)
  - `--text-primary`: `#0f172a` (light) / `#f8fafc` (dark)

## Code Layout

- Exclusive file ownership rules:
  - **M1 Worker**: `src/components/contact/*`, `src/app/api/contact/route.ts`, `supabase/migrations/*`, `src/types/index.ts`, `src/lib/supabase.ts`, `src/components/sections/ContactSection.tsx`.
  - **M2 Worker**: `src/components/layout/Navigation.tsx`, `src/components/ui/SectionDivider.tsx`, `src/styles/globals.css`, `src/styles/theme.css`, `src/app/layout.tsx`, `src/components/layout/MorphingBackground.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Text.tsx`, `src/app/page.tsx` (divider insertions).
  - **M3 Worker**: `src/hooks/usePrefersReducedMotion.ts`, `src/hooks/useMediaQuery.ts`, `src/components/ui/TiltCard.tsx`, `src/components/ui/MagneticButton.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/ProjectsSection.tsx`, `src/components/sections/ExperienceSection.tsx`, `src/components/sections/AchievementsSection.tsx`, `src/styles/premium.css`.
  - **M4 Worker**: E2E test scripts, verification suites, formatting.
