# Design System

> Visual principles, tokens, and component specifications.

This document defines the design language of "Not a Portfolio" — a system built on restraint, clarity, and timelessness.

---

## Design Philosophy

### Core Principles

1. **Classic over trendy**
   - No gradients, neon colors, or heavy shadows
   - Designs that will look good in 5 years

2. **Minimal over maximal**
   - Every element earns its place
   - Whitespace is a feature, not empty space

3. **Calm over loud**
   - Soft contrasts, subtle transitions
   - The content speaks; the design listens

4. **Intentional over decorative**
   - Every animation has purpose
   - Every color has meaning

### The Feeling We're Creating

Imagine a senior engineer's office: clean desk, quality materials, nothing flashy, everything functional. That's the digital equivalent we're building.

---

## Color System

### Philosophy

We use a **neutral palette** with **one accent color**. This constraint forces clarity and prevents visual chaos.

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#FAFAFA` | Page background |
| `surface-elevated` | `#FFFFFF` | Cards, modals |
| `text-primary` | `#171717` | Headings, primary text |
| `text-secondary` | `#525252` | Body text |
| `text-muted` | `#737373` | Captions, hints |
| `border` | `#E5E5E5` | Default borders |
| `border-strong` | `#D4D4D4` | Emphasized borders |
| `accent` | `#2563EB` | Links, focus states |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#0A0A0A` | Page background |
| `surface-elevated` | `#171717` | Cards, modals |
| `text-primary` | `#FAFAFA` | Headings, primary text |
| `text-secondary` | `#A3A3A3` | Body text |
| `text-muted` | `#737373` | Captions, hints |
| `border` | `#262626` | Default borders |
| `border-strong` | `#404040` | Emphasized borders |
| `accent` | `#3B82F6` | Links, focus states |

### Accent Color

The accent (`#2563EB` — a refined blue) signals:
- Trust and professionalism
- Interactivity (links, buttons)
- Focus states for accessibility

It's used sparingly. Most of the interface is neutral.

### Implementation

```css
:root {
  --color-surface: 250 250 250;
  --color-text-primary: 23 23 23;
  --color-accent: 37 99 235;
}

.dark {
  --color-surface: 10 10 10;
  --color-text-primary: 250 250 250;
}
```

---

## Typography

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| Body | Inter | system-ui, sans-serif |
| Headings | Playfair Display | Georgia, serif |
| Code | JetBrains Mono | Menlo, monospace |

### Why This Combination?

- **Inter**: Designed for screens, excellent readability, professional
- **Playfair Display**: Elegant serif that adds warmth to headings
- **JetBrains Mono**: Clear code display with ligatures

### Type Scale

Based on a **1.25 (major third)** modular scale:

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| `h1` | 3rem / 48px | 1.1 | Page titles |
| `h2` | 2.25rem / 36px | 1.15 | Section titles |
| `h3` | 1.875rem / 30px | 1.2 | Subsection titles |
| `h4` | 1.5rem / 24px | 1.25 | Card titles |
| `body-large` | 1.25rem / 20px | 1.6 | Lead paragraphs |
| `body` | 1rem / 16px | 1.625 | Default text |
| `body-small` | 0.875rem / 14px | 1.5 | Secondary text |
| `caption` | 0.75rem / 12px | 1.4 | Labels, hints |

### Text Rendering

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 {
  font-family: var(--font-serif);
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```

---

## Spacing System

### Base Unit: 4px

All spacing is a multiple of 4px. This creates mathematical harmony.

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Icon gaps |
| `3` | 12px | Small padding |
| `4` | 16px | Default padding |
| `6` | 24px | Card padding |
| `8` | 32px | Section gaps |
| `12` | 48px | Large gaps |
| `16` | 64px | Section padding |
| `24` | 96px | Major sections |

### Application

```css
/* Consistent card padding */
.card { padding: 24px; } /* 6 units */

/* Section spacing */
.section { padding-block: 96px; } /* 24 units */

/* Button padding */
.btn { padding: 12px 20px; } /* 3 × 5 units */
```

---

## Component Specifications

### Button

```
┌─────────────────────────────────┐
│  [Icon]  Label  [Icon]          │
└─────────────────────────────────┘

Padding: 12px vertical, 20px horizontal
Border-radius: 8px
Font: 14px medium
Transition: 200ms colors
```

**Variants:**

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `neutral-900` | `white` | none |
| Secondary | `transparent` | `neutral-700` | `neutral-300` |
| Ghost | `transparent` | `neutral-600` | none |
| Link | `transparent` | `neutral-700` | none (underline on hover) |

### Card

```
┌─────────────────────────────────┐
│                                 │
│  Content                        │
│                                 │
└─────────────────────────────────┘

Padding: 24px (default), 16px (small), 32px (large)
Border-radius: 8px
Border: 1px solid border-color
Background: surface-elevated
```

**Interactive variant:** Adds hover state with border color change.

### Input

```
┌─────────────────────────────────┐
│  Placeholder                    │
└─────────────────────────────────┘

Padding: 12px 16px
Border-radius: 8px
Border: 1px solid neutral-300
Focus: 2px ring, accent color
```

---

## Animation Specifications

### Principles

1. **Ease-out for entrances**: `cubic-bezier(0.4, 0, 0.2, 1)`
2. **Ease-in for exits**: `cubic-bezier(0.4, 0, 1, 1)`
3. **Never bounce or overshoot**
4. **Movement direction matches meaning**

### Timing

| Interaction | Duration |
|-------------|----------|
| Button press | 100ms |
| Hover states | 200ms |
| Micro-interactions | 200-400ms |
| Page transitions | 400-600ms |
| Reveal animations | 400-700ms |

### Standard Animations

**Fade Up** (default entrance):
```typescript
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
```

**Scale In** (emphasis):
```typescript
initial: { opacity: 0, scale: 0.96 }
animate: { opacity: 1, scale: 1 }
```

**Stagger** (lists):
```typescript
container: { staggerChildren: 0.1 }
item: fadeUp
```

### What We Don't Do

❌ Bouncing animations  
❌ Spring physics with overshoot  
❌ Parallax scrolling  
❌ Animated gradients  
❌ Floating elements  

---

## Layout

### Container Widths

| Name | Max Width | Usage |
|------|-----------|-------|
| Narrow | 720px | Text-heavy content |
| Wide | 1024px | Cards, grids |
| Full | 1280px | Full-width sections |

### Grid System

Default: 8-column grid on desktop, single column on mobile.

```css
.container-narrow { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.container-wide { max-width: 1024px; margin: 0 auto; padding: 0 24px; }
```

### Responsive Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Large desktops |

---

## Accessibility

### Focus States

All interactive elements have visible focus:

```css
*:focus-visible {
  outline: none;
  ring: 2px solid accent;
  ring-offset: 2px;
}
```

### Color Contrast

All text meets WCAG AA contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dark Mode

### Implementation

```typescript
// Theme toggle stores preference
useThemeStore.setMode('dark' | 'light' | 'system')

// Applied via class on <html>
document.documentElement.classList.add(resolvedMode)
```

### Design Considerations

- Same visual hierarchy in both modes
- Surfaces should feel like paper (light) or slate (dark)
- Accent color slightly lighter in dark mode for visibility
- Borders more subtle in dark mode

---

## Icons

### Source: Lucide

- Consistent 24px base size
- 2px stroke width
- Scale to 16px, 20px, or 24px as needed

### Usage Guidelines

```tsx
// Standard icon
<Icon className="w-5 h-5" /> // 20px

// In button
<Button leftIcon={<ArrowRight className="w-4 h-4" />}>
  Continue
</Button>

// Decorative (hidden from screen readers)
<Icon aria-hidden="true" />

// Meaningful (needs label)
<Icon aria-label="External link" />
```

---

## Shadows

We use shadows sparingly. Prefer borders and spacing.

| Name | Value | Usage |
|------|-------|-------|
| subtle | `0 1px 2px rgba(0,0,0,0.03)` | Slight elevation |
| soft | `0 2px 8px rgba(0,0,0,0.08)` | Cards on hover |
| medium | `0 4px 16px rgba(0,0,0,0.1)` | Modals |

---

## File Naming

```
components/
├── ui/
│   ├── Button.tsx      # PascalCase for components
│   ├── Card.tsx
│   └── index.ts        # Barrel export
├── layout/
│   └── Navigation.tsx
lib/
├── utils.ts            # camelCase for utilities
├── animations.ts
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-surface: 250 250 250;
  --color-text-primary: 23 23 23;
  --color-text-secondary: 82 82 82;
  --color-accent: 37 99 235;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Animation */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```
