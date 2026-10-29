# E2E Test Infra: not-a-portfolio

## Test Philosophy

- Opaque-box, requirement-driven. Derived from `ORIGINAL_REQUEST.md` and user-facing requirements.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Testing.

## Feature Inventory & Test Mapping

| #   | Feature                                             | Source (Requirement) | Tier 1 | Tier 2 | Tier 3 |
| --- | --------------------------------------------------- | -------------------- | :----: | :----: | :----: |
| 1   | Contact Form Input Validation                       | ORIGINAL_REQUEST §R1 |   5    |   5    |   ✓    |
| 2   | Contact API Route & Supabase Persistence            | ORIGINAL_REQUEST §R1 |   5    |   5    |   ✓    |
| 3   | Resend Email Notifications                          | ORIGINAL_REQUEST §R1 |   5    |   5    |   ✓    |
| 4   | Social Links Orbit / Profile Grid                   | ORIGINAL_REQUEST §R1 |   5    |   5    |   ✓    |
| 5   | Glassmorphism Navigation Bar                        | ORIGINAL_REQUEST §R2 |   5    |   5    |   ✓    |
| 6   | Active Section Indicator (Scroll & Intersection)    | ORIGINAL_REQUEST §R2 |   5    |   5    |   ✓    |
| 7   | Mobile Drawer / Bottom Navigation                   | ORIGINAL_REQUEST §R2 |   5    |   5    |   ✓    |
| 8   | Section Dividers & Boundary Blends                  | ORIGINAL_REQUEST §R2 |   5    |   5    |   ✓    |
| 9   | Dark/Light Theme Switching                          | ORIGINAL_REQUEST §R3 |   5    |   5    |   ✓    |
| 10  | Contrast, CSS Tokens & Theme Consistency            | ORIGINAL_REQUEST §R3 |   5    |   5    |   ✓    |
| 11  | Viewport Responsiveness (320px–4K)                  | ORIGINAL_REQUEST §R4 |   5    |   5    |   ✓    |
| 12  | Prefers-Reduced-Motion Graceful Fallbacks           | ORIGINAL_REQUEST §R4 |   5    |   5    |   ✓    |
| 13  | Touch Interactions & Pointer Coarse Guards          | ORIGINAL_REQUEST §R4 |   5    |   5    |   ✓    |
| 14  | Performance & Dynamic Component Lazy Loading        | ORIGINAL_REQUEST §R5 |   5    |   5    |   ✓    |
| 15  | Anti-Lag & Smooth Frame Rates                       | ORIGINAL_REQUEST §R5 |   5    |   5    |   ✓    |
| 16  | Micro-Interactions & Hover/Focus Feedback           | ORIGINAL_REQUEST §R6 |   5    |   5    |   ✓    |
| 17  | Semantic HTML Tags (`<article>`, `<nav>`, `<main>`) | ORIGINAL_REQUEST §R6 |   5    |   5    |   ✓    |
| 18  | ARIA Accessibility Attributes                       | ORIGINAL_REQUEST §R6 |   5    |   5    |   ✓    |
| 19  | SEO & JSON-LD Person Metadata                       | ORIGINAL_REQUEST §R6 |   5    |   5    |   ✓    |
| 20  | Code Quality, Lint, Type-Check & Build Verification | ORIGINAL_REQUEST §R7 |   5    |   5    |   ✓    |

## Test Architecture

- Test Runner: Node test harness / Vitest integration tests
- Verification Semantics: Strict exit code 0; assertions on validation states, HTTP payloads, CSS token variables, DOM landmarks, and ARIA attributes
- Directory Layout: `tests/e2e/`, `tests/fixtures/`

## Real-World Application Scenarios (Tier 4)

| #   | Scenario                                                                                                | Features Exercised      | Complexity |
| --- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| 1   | Recruiter submits valid message via ContactForm with Supabase persistence and email notification        | F1, F2, F3, F4          | Medium     |
| 2   | Visitor navigates entire portfolio using command-bar and mobile drawer without layout jumping           | F5, F6, F7, F8          | Medium     |
| 3   | User switches between Light and Dark mode with zero FOUT and valid CSS border tokens                    | F9, F10, F15            | High       |
| 4   | Mobile visitor on narrow screen (360px) interacts with touch, reduced motion, and responsive typography | F11, F12, F13, F14      | High       |
| 5   | Full capability showcase validation: SEO JSON-LD Person schema, ARIA accessibility, clean build         | F16, F17, F18, F19, F20 | High       |

## Coverage Thresholds

- Tier 1: ≥5 test cases per feature (Happy-path / isolated equivalence class representatives)
- Tier 2: ≥5 test cases per feature (Boundary values, empty strings, max characters, invalid formats)
- Tier 3: Pairwise coverage across major feature interactions (Theme x Nav, Mobile x Form, Reduced Motion x Canvas)
- Tier 4: ≥5 realistic end-to-end workload scenarios
