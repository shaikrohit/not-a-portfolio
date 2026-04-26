# Design System

> A systematic approach to visual language. Restraint over expression.

## Philosophy

This design system follows the principle of **intentional minimalism**. Every design token exists for a reason. Every value is part of a system. Nothing is arbitrary.

---

## Color Palette

### Neutral Scale

Our neutral palette forms the foundation. It's carefully calibrated for accessibility and readability across light and dark modes.

| Token         | Value     | Usage                     |
| ------------- | --------- | ------------------------- |
| `neutral-50`  | `#FAFAFA` | Light mode background     |
| `neutral-100` | `#F5F5F5` | Light mode surface        |
| `neutral-200` | `#E5E5E5` | Light mode border         |
| `neutral-300` | `#D4D4D4` | Muted elements            |
| `neutral-400` | `#A3A3A3` | Placeholder text          |
| `neutral-500` | `#737373` | Secondary text            |
| `neutral-600` | `#525252` | Primary text (light mode) |
| `neutral-700` | `#404040` | Strong emphasis           |
| `neutral-800` | `#262626` | Dark mode surface         |
| `neutral-900` | `#171717` | Dark mode background      |
| `neutral-950` | `#0A0A0A` | Deep dark                 |

### Accent Color

One accent color only. Blue signals trust, intelligence, and professionalism.

| Token          | Value     | Usage                  |
| -------------- | --------- | ---------------------- |
| `accent`       | `#2563EB` | Primary actions, links |
| `accent-light` | `#3B82F6` | Hover states           |
| `accent-dark`  | `#1D4ED8` | Active states          |
| `accent-muted` | `#DBEAFE` | Backgrounds, badges    |

### Semantic Colors

```css
:root {
  /* Surfaces */
  --surface-light: #fafafa;
  --surface-dark: #0a0a0a;

  /* Text */
  --text-primary-light: #171717;
  --text-primary-dark: #fafafa;
  --text-secondary: #737373;

  /* Borders */
  --border-light: #e5e5e5;
  --border-dark: #262626;
}
```

---

## Typography

### Font Stack

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Type Scale (8px base)

| Name        | Size | Line Height | Usage            |
| ----------- | ---- | ----------- | ---------------- |
| `text-xs`   | 12px | 16px        | Captions, labels |
| `text-sm`   | 14px | 20px        | Secondary text   |
| `text-base` | 16px | 24px        | Body text        |
| `text-lg`   | 18px | 28px        | Large body       |
| `text-xl`   | 20px | 28px        | Small headings   |
| `text-2xl`  | 24px | 32px        | Section headings |
| `text-3xl`  | 30px | 36px        | Page headings    |
| `text-4xl`  | 36px | 40px        | Hero text        |
| `text-5xl`  | 48px | 48px        | Display text     |

### Font Weights

- `400` — Regular (body text)
- `500` — Medium (emphasis)
- `600` — Semibold (headings)
- `700` — Bold (strong emphasis)

---

## Spacing

### 8px Grid System

All spacing uses multiples of 8px for consistency and rhythm.

| Token      | Value | Usage            |
| ---------- | ----- | ---------------- |
| `space-0`  | 0px   | No spacing       |
| `space-1`  | 4px   | Tight spacing    |
| `space-2`  | 8px   | Compact spacing  |
| `space-3`  | 12px  | Default gap      |
| `space-4`  | 16px  | Standard padding |
| `space-5`  | 20px  | Medium spacing   |
| `space-6`  | 24px  | Section gap      |
| `space-8`  | 32px  | Large spacing    |
| `space-10` | 40px  | Component gap    |
| `space-12` | 48px  | Section padding  |
| `space-16` | 64px  | Layout spacing   |
| `space-20` | 80px  | Large sections   |
| `space-24` | 96px  | Hero spacing     |

---

## Motion

### Timing Functions

```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Duration Scale

| Token             | Value | Usage                |
| ----------------- | ----- | -------------------- |
| `duration-fast`   | 150ms | Micro-interactions   |
| `duration-normal` | 250ms | Standard transitions |
| `duration-slow`   | 400ms | Complex animations   |
| `duration-slower` | 600ms | Page transitions     |

### Animation Principles

1. **Ease-out for entrances** — Elements arriving feel natural
2. **Ease-in for exits** — Elements leaving feel natural
3. **Never exceed 800ms** — Longer feels sluggish
4. **Reduce motion support** — Respect `prefers-reduced-motion`

---

## Components

### Button Variants

```tsx
// Primary - Main actions
<Button variant="primary">Get Started</Button>

// Secondary - Alternative actions
<Button variant="secondary">Learn More</Button>

// Ghost - Tertiary actions
<Button variant="ghost">Cancel</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card States

| State   | Border               | Shadow | Background     |
| ------- | -------------------- | ------ | -------------- |
| Default | `border-neutral-200` | none   | `surface`      |
| Hover   | `border-neutral-300` | `sm`   | `surface`      |
| Active  | `border-accent`      | `sm`   | `accent-muted` |

### Input States

| State    | Border               | Ring                     |
| -------- | -------------------- | ------------------------ |
| Default  | `border-neutral-200` | none                     |
| Focus    | `border-accent`      | `ring-2 ring-accent/20`  |
| Error    | `border-red-500`     | `ring-2 ring-red-500/20` |
| Disabled | `border-neutral-100` | none                     |

---

## Accessibility

### Color Contrast Requirements

- **WCAG AA**: Minimum 4.5:1 for body text
- **WCAG AA**: Minimum 3:1 for large text (18px+)
- All color combinations tested with tools

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Visible focus states
- Skip links for main content

### Screen Reader Support

- Semantic HTML structure
- ARIA labels where needed
- Live regions for dynamic content
- Alt text for all images

---

## Dark Mode

Dark mode is **mandatory** and the default. Implementation uses CSS custom properties with class-based toggling.

```css
:root {
  --bg: var(--surface-light);
  --text: var(--text-primary-light);
}

.dark {
  --bg: var(--surface-dark);
  --text: var(--text-primary-dark);
}
```

### Dark Mode Principles

1. **Not just inverted** — Dark surfaces use neutral-900/950, not pure black
2. **Reduced contrast** — Slightly muted whites for comfort
3. **Accent preservation** — Same accent colors work in both modes
4. **Shadow reduction** — Less shadow in dark mode (less visible anyway)

---

## Responsive Design

### Breakpoints

| Name  | Value  | Target        |
| ----- | ------ | ------------- |
| `sm`  | 640px  | Large phones  |
| `md`  | 768px  | Tablets       |
| `lg`  | 1024px | Small laptops |
| `xl`  | 1280px | Desktops      |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach

Always start with mobile styles, then enhance for larger screens:

```css
/* Mobile first */
.container {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}
```

---

## File Organization

```
src/
├── app/
│   ├── _lib/
│   │   ├── utils.ts      # Utility functions
│   │   └── animations.ts # Framer Motion variants
│   ├── _actions/
│   │   └── analytics.ts  # Server actions
│   └── _styles/
│       └── tokens.css    # Design tokens
├── styles/
│   └── globals.css       # Global styles
└── components/
    └── ui/               # Design system components
```

---

## Usage Guidelines

### Do

- ✅ Use design tokens, not raw values
- ✅ Follow the 8px spacing grid
- ✅ Test both light and dark modes
- ✅ Ensure keyboard accessibility
- ✅ Use semantic HTML elements

### Don't

- ❌ Use arbitrary colors or spacing
- ❌ Create one-off component styles
- ❌ Ignore focus states
- ❌ Use animations > 800ms
- ❌ Skip dark mode testing

---

_This design system is a living document. It evolves with the project while maintaining core principles._
