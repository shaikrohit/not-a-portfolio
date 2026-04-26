# Not a Portfolio

> A conversation-driven digital identity experience. Built in 2025, not migrated from 2019.

This is not a traditional portfolio. It's a dialogue.

Visitors don't scroll through content—they interact with it. They choose who they are, and the experience adapts. It's minimal, intentional, and respectful of both the visitor's time and intelligence.

[Live Demo](https://shaikrohit.tech) · [Architecture](./docs/ARCHITECTURE.md) · [Design System](./docs/DESIGN-SYSTEM.md) · [Roadmap](./docs/ROADMAP.md)

---

## Why This Matters

Most portfolios are museums: static displays meant to be observed. This project takes a different approach.

**The core insight:** Different visitors have different needs.

- A **developer** wants to understand how you think about code
- A **recruiter** needs to quickly assess qualifications
- A **student** is looking for genuine guidance
- An **explorer** is just curious

Instead of making everyone wade through the same content, this site asks one question at the start: _"Who are you?"_

Then it adapts.

---

## The Experience

### Entry

The first screen is intentionally sparse. No hero images. No buzzwords. Just a calm greeting and a choice.

```
"Before I introduce myself, I'd like to know who you are."

[ Developer ]  [ Recruiter ]  [ Student ]  [ Explorer ]
```

This single interaction shapes the entire journey.

### Adaptive Paths

| Path          | Focus            | Content                                                        |
| ------------- | ---------------- | -------------------------------------------------------------- |
| **Developer** | How you think    | Engineering philosophy, architecture decisions, tech reasoning |
| **Recruiter** | What you've done | Clear metrics, skills → outcomes mapping, one-click resume     |
| **Student**   | How you learned  | Honest mistakes, hard-won lessons, genuine encouragement       |
| **Explorer**  | Who you are      | Curiosity-driven exploration, serendipitous discovery          |

### Interaction Over Consumption

- **Short prompts** instead of long paragraphs
- **Micro-decisions** to keep visitors engaged
- **Unlockable sections** for deeper exploration
- **Thoughtful pauses** that let ideas breathe

No infinite scrolling. No content overload.

---

## Modern Stack (2025+)

This project follows strict modern practices. No legacy debt. No deprecated dependencies.

### Core Technologies

| Layer     | Technology    | Version | Reasoning                                 |
| --------- | ------------- | ------- | ----------------------------------------- |
| Framework | Next.js       | 14.2+   | App Router, Server Components, Edge-ready |
| Runtime   | React         | 18.3+   | Concurrent features, Server Components    |
| Language  | TypeScript    | 5.7+    | Strict mode, latest type features         |
| Styling   | Tailwind CSS  | 3.4+    | JIT compilation, design tokens            |
| Animation | Framer Motion | 11+     | Layout animations, gesture support        |
| State     | Zustand       | 5+      | Minimal, TypeScript-native                |
| Database  | Supabase      | 2.45+   | Postgres, RLS, Edge Functions             |

### Quality Tooling

| Tool              | Version | Purpose                             |
| ----------------- | ------- | ----------------------------------- |
| ESLint            | 9+      | **Flat config**, type-aware linting |
| Prettier          | 3.4+    | Consistent formatting               |
| TypeScript ESLint | 8+      | Modern parser, strict checks        |

### Why These Specific Versions?

**ESLint 9 (Flat Config)** — ESLint 8 uses the legacy `.eslintrc` format. ESLint 9 introduces flat config (`eslint.config.mjs`), which is simpler, more powerful, and the future of ESLint.

**Zustand 5** — Version 4 is in maintenance mode. Version 5 has better TypeScript inference and smaller bundle size.

**Framer Motion 11** — Major performance improvements, better tree-shaking, modern React patterns.

---

## Project Structure

```
/
├── .github/
│   └── workflows/
│       └── ci.yml           # Quality checks on every PR
├── docs/
│   ├── ARCHITECTURE.md      # System design decisions
│   ├── DESIGN-SYSTEM.md     # Visual language documentation
│   └── ROADMAP.md           # Future plans
├── src/
│   ├── app/
│   │   ├── _actions/        # Server Actions (data mutations)
│   │   ├── _lib/            # Shared utilities & animations
│   │   ├── layout.tsx       # Root layout (Server Component)
│   │   └── page.tsx         # Home page (Client Component)
│   ├── components/
│   │   ├── entry/           # Entry experience
│   │   ├── layout/          # Navigation, Footer
│   │   ├── sections/        # Content sections
│   │   └── ui/              # Design system primitives
│   ├── content/             # All text content (easy to customize)
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   ├── styles/              # Global CSS & tokens
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
├── supabase/
│   └── schema.sql           # Database schema
├── .editorconfig            # Editor settings
├── .nvmrc                   # Node version
├── eslint.config.mjs        # ESLint flat config
├── prettier.config.mjs      # Prettier settings
├── tailwind.config.ts       # Design tokens
└── tsconfig.json            # TypeScript config
```

### Architecture Principles

1. **Server Components by default** — Client Components only when needed
2. **Colocation** — Related files live together
3. **Explicit boundaries** — `"use client"` is intentional, not accidental
4. **Type safety end-to-end** — From database to UI

---

## Getting Started

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- npm 10+ (specified in `engines`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/not-a-portfolio.git
cd not-a-portfolio

# Install dependencies
npm install

# Start development server (with Turbo)
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required for analytics (optional for development)
NEXT_PUBLIC_SITE_URL=https://shaikrohit.tech
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Available Scripts

```bash
npm run dev          # Start dev server with Turbo
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint with zero warnings policy
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run type-check   # TypeScript validation
npm run validate     # Run all checks
npm run preflight    # Validate + security audit
```

---

## Quality Guarantees

### CI Pipeline

Every pull request runs:

1. **Type checking** — No TypeScript errors
2. **Linting** — ESLint with zero warnings
3. **Formatting** — Prettier consistency
4. **Security audit** — No moderate+ vulnerabilities
5. **Build** — Successful production build
6. **Lighthouse** — Performance ≥90, Accessibility ≥90

### Code Quality

- ✅ ESLint 9 flat config with strict rules
- ✅ TypeScript strict mode + noUncheckedIndexedAccess
- ✅ Prettier with Tailwind plugin
- ✅ No deprecated dependencies
- ✅ No legacy patterns

---

## Customization

### Content

All content lives in `src/content/config.ts`. Edit this file to personalize:

```typescript
export const profile = {
  name: 'Your Name',
  tagline: 'Your tagline',
  introduction: {
    developer: 'Message for developers...',
    recruiter: 'Message for recruiters...',
    // ...
  },
};
```

### Design Tokens

Customize the visual system in `tailwind.config.ts`:

```typescript
colors: {
  accent: {
    DEFAULT: '#2563EB', // Change this to your brand color
  },
},
```

### Adding Sections

1. Create component in `src/components/sections/`
2. Add to section renderer in `src/app/page.tsx`
3. Register in navigation store

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Setup

In Vercel dashboard:

1. Add environment variables from `.env.example`
2. Enable Edge runtime for API routes
3. Configure custom domain

---

## Legacy Avoidance

This project explicitly avoids:

| ❌ Legacy            | ✅ Modern                         |
| -------------------- | --------------------------------- |
| `.eslintrc.json`     | `eslint.config.mjs` (flat config) |
| ESLint 8             | ESLint 9                          |
| Pages Router         | App Router                        |
| `getServerSideProps` | Server Components                 |
| Class components     | Function components               |
| `useEffect` for data | Server Actions                    |
| Moment.js            | date-fns                          |
| Lodash               | Native methods                    |
| Node 18              | Node 20+                          |

---

## Upgrade Strategy

### Staying Current

1. **Weekly**: Run `npm outdated` to check for updates
2. **Monthly**: Review changelogs for major dependencies
3. **Quarterly**: Audit for deprecated patterns

### Migration Path

When Next.js 15 releases:

- Review breaking changes
- Update in feature branch
- Run full test suite
- Deploy to preview environment

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Run `npm run preflight` before committing
4. Push and create Pull Request

All PRs must pass CI checks.

---

## License

MIT — See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- Design inspiration from [Rauno Freiberg](https://rauno.me)
- Animation patterns from [Framer Motion docs](https://www.framer.com/motion/)
- Architecture influenced by [Next.js App Router examples](https://github.com/vercel/next.js/tree/canary/examples)

---

<p align="center">
  <sub>Built with intention. Maintained with discipline.</sub>
</p>
