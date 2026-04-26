# 📁 Project Structure Guide

> A beginner-friendly guide to understanding this codebase.

## 🗂️ Folder Overview

```
src/
├── app/                    # 🚀 Next.js App Router (pages & layouts)
├── components/             # 🧩 All React components
│   ├── ui/                 # 🎨 Reusable design system components
│   ├── layout/             # 📐 Page structure (header, footer, nav)
│   ├── sections/           # 📄 Page content sections
│   └── features/           # ⚡ Feature-specific components
├── lib/                    # 🔧 Utility functions & helpers
├── hooks/                  # 🪝 Custom React hooks
├── store/                  # 📦 Global state management (Zustand)
├── content/                # ✍️ All text content & data
├── styles/                 # 🎨 Global CSS & design tokens
└── types/                  # 📝 TypeScript type definitions
```

---

## 📚 Detailed Breakdown

### `/app` — Next.js App Router

This is where Next.js looks for pages. Each folder = a route.

| File         | Purpose                                    |
| ------------ | ------------------------------------------ |
| `layout.tsx` | Root layout (wraps all pages, loads fonts) |
| `page.tsx`   | Home page (`/`)                            |
| `_actions/`  | Server Actions (database operations)       |
| `_lib/`      | App-specific utilities                     |

### `/components` — React Components

#### `/components/ui` — Design System

Reusable, styled building blocks. Use these everywhere!

| Component    | What it does      | Example                                    |
| ------------ | ----------------- | ------------------------------------------ |
| `Button`     | Clickable actions | `<Button variant="primary">Click</Button>` |
| `Card`       | Content container | `<Card>Content here</Card>`                |
| `Text`       | Typography        | `<Text variant="h1">Title</Text>`          |
| `Input`      | Form inputs       | `<Input placeholder="Email" />`            |
| `Animations` | Motion wrappers   | `<FadeIn>Content</FadeIn>`                 |

#### `/components/layout` — Page Structure

Components that define the page layout.

| Component       | Purpose                |
| --------------- | ---------------------- |
| `Navigation`    | Top navigation bar     |
| `Footer`        | Page footer            |
| `ThemeProvider` | Dark/light mode toggle |

#### `/components/sections` — Page Sections

Each major section of content. Organized by visitor type.

| File                 | For whom                          |
| -------------------- | --------------------------------- |
| `DeveloperSections/` | Developers (philosophy, projects) |
| `RecruiterSections/` | Recruiters (experience, skills)   |
| `StudentSections/`   | Students (journey, advice)        |
| `SharedSections/`    | Everyone (about, contact)         |

#### `/components/features` — Feature Components

Complex, feature-specific components.

| Component             | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `EntryExperience`     | The welcome flow where visitors choose their path |
| `VisitorTypeSelector` | The four-button selector                          |

### `/lib` — Utilities

Helper functions used across the app.

| File            | Contains                                |
| --------------- | --------------------------------------- |
| `utils.ts`      | `cn()`, `formatDate()`, general helpers |
| `animations.ts` | Framer Motion animation presets         |
| `supabase.ts`   | Database client & functions             |

### `/hooks` — Custom Hooks

Reusable React hooks for common patterns.

| Hook              | Purpose                  |
| ----------------- | ------------------------ |
| `useTimeTracking` | Track time spent on site |
| `usePageTracking` | Track visited pages      |
| `useMediaQuery`   | Responsive breakpoints   |

### `/store` — State Management

Global state using Zustand.

| Store             | Manages                            |
| ----------------- | ---------------------------------- |
| `visitorStore`    | Visitor type, session info         |
| `navigationStore` | Current section, unlocked sections |
| `themeStore`      | Dark/light mode preference         |

### `/content` — Content & Data

All text content lives here. Easy to edit!

| File        | Contains                            |
| ----------- | ----------------------------------- |
| `config.ts` | Profile, projects, philosophy, etc. |
| `index.ts`  | Re-exports everything               |

### `/styles` — Global Styles

CSS files and design tokens.

| File          | Contains                             |
| ------------- | ------------------------------------ |
| `globals.css` | Base styles, CSS variables, Tailwind |

### `/types` — TypeScript Types

Shared type definitions.

| File       | Contains         |
| ---------- | ---------------- |
| `index.ts` | All shared types |

---

## 🔄 How Data Flows

```
1. User visits site
   ↓
2. EntryExperience shows welcome
   ↓
3. User selects visitor type (Developer/Recruiter/Student/Explorer)
   ↓
4. visitorStore saves selection
   ↓
5. page.tsx reads visitor type
   ↓
6. Correct sections are rendered (Developer → DeveloperSections)
   ↓
7. Sections pull content from /content/config.ts
```

---

## 🎨 Component Usage Examples

### Using a Button

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Click Me
</Button>;
```

### Using Text

```tsx
import { Text } from '@/components/ui';

<Text variant="h1">Big Title</Text>
<Text variant="body" muted>Smaller, muted text</Text>
```

### Using Animations

```tsx
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';

<FadeIn>
  <h1>This fades in</h1>
</FadeIn>

<StaggerChildren>
  <StaggerItem>First</StaggerItem>
  <StaggerItem>Second</StaggerItem>
  <StaggerItem>Third</StaggerItem>
</StaggerChildren>
```

---

## 📝 Naming Conventions

| Type       | Convention           | Example                             |
| ---------- | -------------------- | ----------------------------------- |
| Components | PascalCase           | `Button.tsx`, `EntryExperience.tsx` |
| Utilities  | camelCase            | `utils.ts`, `formatDate()`          |
| Hooks      | camelCase with "use" | `useTimeTracking.ts`                |
| Types      | PascalCase           | `VisitorType`, `ButtonProps`        |
| CSS        | kebab-case           | `globals.css`, `.card-container`    |
| Folders    | lowercase            | `components/`, `sections/`          |

---

## 🚀 Quick Reference

### Import Aliases

```tsx
import { Button } from '@/components/ui'; // Components
import { cn } from '@/lib/utils'; // Utilities
import { useVisitorStore } from '@/store'; // State
import { profile } from '@/content'; // Content
import type { VisitorType } from '@/types'; // Types
```

### File Creation Checklist

When creating a new component:

1. ✅ Create `ComponentName.tsx` in correct folder
2. ✅ Add `'use client'` if using hooks/state
3. ✅ Export from `index.ts`
4. ✅ Add TypeScript props interface
5. ✅ Add JSDoc comment explaining purpose

---

_This guide is for beginners. When in doubt, look at existing components for patterns!_
