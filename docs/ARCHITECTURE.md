# Architecture

> Technical decisions and their reasoning.

This document explains the architectural choices behind "Not a Portfolio" — why certain patterns were chosen, how data flows through the system, and the trade-offs considered.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Entry     │  │  Sections   │  │      Navigation         │  │
│  │  Experience │  │  (Adaptive) │  │   (Visitor-aware)       │  │ 
│  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │
│         │                │                      │               │
│         ▼                ▼                      ▼               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Zustand Stores                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │   │
│  │  │  Visitor   │  │ Navigation │  │      Theme         │  │   │
│  │  │   Store    │  │   Store    │  │      Store         │  │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────────┬──────────┘  │   │
│  └────────┼───────────────┼───────────────────┼─────────────┘   │
│           │               │                   │                 │
│           └───────────────┼───────────────────┘                 │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │     localStorage       │                         │
│              │   (Persisted State)    │                         │
│              └────────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Analytics (Optional)
                            ▼
              ┌────────────────────────┐
              │       Supabase         │
              │   ┌────────────────┐   │
              │   │   Sessions     │   │
              │   │   Messages     │   │
              │   └────────────────┘   │
              └────────────────────────┘
```

---

## Core Architectural Decisions

### 1. Client-Side State with Server Rendering

**Decision:** Use Next.js App Router with client-side state management (Zustand).

**Reasoning:**
- The visitor's journey is inherently stateful (visitor type, current section, visited pages)
- State needs to persist across page navigations
- Server components can't hold client state, but can render static content
- Zustand provides a simple, TypeScript-first API

**Alternative Considered:** Server-side session management
- Rejected because it adds complexity without benefit for this use case
- No authentication needed, just preference storage

### 2. Adaptive Content Architecture

**Decision:** Single page with conditional section rendering, not separate routes.

**Reasoning:**
```tsx
// What we chose: Conditional rendering
<SectionRenderer visitorType={visitorType} currentSection={currentSection} />

// Alternative: Separate routes (/developer/philosophy, /recruiter/summary)
// Rejected: More files, harder to maintain, URL structure exposes implementation
```

**Benefits:**
- Content configuration lives in one place (`src/content/config.ts`)
- Adding new visitor types requires minimal changes
- Simpler mental model: one page, many views

### 3. Component Organization

```
components/
├── ui/           # Design system primitives (Button, Card, Text)
├── layout/       # Structural components (Navigation, Footer)
├── entry/        # Entry experience (the first interaction)
└── sections/     # Content sections (grouped by visitor type)
```

**Principle:** Components are organized by *role*, not by feature.

**Why:**
- `ui/` components are context-agnostic and reusable
- `sections/` components know about content but not about routing
- `layout/` components know about structure but not about content

---

## State Management

### Store Structure

```typescript
// Three separate stores for different concerns
useVisitorStore    // Who is visiting, their session
useNavigationStore // Where they are in the journey
useThemeStore      // Light/dark mode preference
```

**Why separate stores?**
- Each concern has different persistence needs
- Easier to reason about and test
- Zustand handles this elegantly with minimal overhead

### Persistence Strategy

```typescript
// Visitor state: Persisted to localStorage
persist(
  (set, get) => ({ /* state */ }),
  {
    name: 'visitor-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      visitorType: state.visitorType,
      hasCompletedEntry: state.hasCompletedEntry,
    }),
  }
)
```

**What's persisted:**
- `visitorType`: So returning visitors skip the entry screen
- `hasCompletedEntry`: Entry completion flag
- `unlockedSections`: Progress through the site

**What's NOT persisted:**
- Active session details (recreated on each visit)
- UI state (menus, modals)

---

## Analytics Architecture

### Privacy-First Design

```typescript
// Data we collect
interface VisitorSession {
  id: string;              // Random, not linked to identity
  visitorType: string;     // Self-reported
  country: string;         // Derived from timezone, not IP
  pagesVisited: string[];  // Navigation path
  timeSpentSeconds: number;
}
```

**Why timezone for country?**
```typescript
// Instead of IP geolocation (privacy-invasive)
const country = getCountryFromTimezone();
// Uses Intl.DateTimeFormat().resolvedOptions().timeZone
// Less precise, but doesn't require external services
```

### Database Schema (Supabase)

```sql
-- Visitor sessions (aggregated for dashboard)
CREATE TABLE visitor_sessions (
  id TEXT PRIMARY KEY,
  visitor_type TEXT,
  country TEXT,
  pages_visited TEXT[],
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages
CREATE TABLE visitor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES visitor_sessions(id),
  visitor_type TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security: Public read for aggregated stats, insert-only for sessions
```

---

## Animation Philosophy

### Constraints

1. **Never bouncing** — Professional, not playful
2. **Ease-out for entrances** — Things arriving feel natural
3. **Ease-in for exits** — Things leaving don't linger
4. **200-400ms for micro-interactions** — Fast enough to feel responsive
5. **500-800ms for transitions** — Slow enough to be noticed

### Implementation

```typescript
// Centralized animation variants
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.4, 0, 0.2, 1] // Smooth ease-out
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  },
};
```

**Why centralized?**
- Consistency across the site
- Easy to adjust timing globally
- Components don't need to know animation details

---

## Content Architecture

### Configuration-Driven Content

All content lives in `src/content/config.ts`:

```typescript
// Profile information
export const profile = {
  name: 'Your Name',
  introduction: {
    developer: '...',  // Different intro per visitor type
    recruiter: '...',
    student: '...',
    explorer: '...',
  },
};

// Projects with visibility rules
export const projects: Project[] = [
  {
    title: 'Project Name',
    visibleTo: ['developer', 'recruiter'], // Shown to these types
    // ...
  },
];
```

**Benefits:**
- Non-developers can update content without touching components
- Clear separation between content and presentation
- Easy to add new visitor types or content categories

### Type Safety

```typescript
// All content is strongly typed
interface Project {
  id: string;
  title: string;
  description: string;
  visibleTo: VisitorType[]; // Type-safe array
}
```

---

## Performance Considerations

### Bundle Size

- **Framer Motion**: Used sparingly, only imported where needed
- **Zustand**: ~1KB, minimal overhead
- **No lodash**: Custom utilities instead of importing a full library

### Rendering Strategy

```tsx
// Server Components for static content
export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>  {/* Client Component */}
          {children}     {/* Can be Server or Client */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Image Optimization

```tsx
// Using next/image for automatic optimization
<Image
  src="/project-screenshot.png"
  alt="Project screenshot"
  width={800}
  height={450}
  placeholder="blur"
  blurDataURL="data:image/..." // Inline blur placeholder
/>
```

---

## Security Considerations

### Headers

```javascript
// next.config.js
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }];
}
```

### Supabase Row Level Security

```sql
-- Only allow inserting sessions, not reading individual ones
CREATE POLICY "Allow insert" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

-- Only allow reading aggregated data
CREATE POLICY "Allow aggregated read" ON visitor_sessions
  FOR SELECT USING (false); -- Use functions for aggregation instead
```

---

## Trade-offs & Future Considerations

### Current Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Client-side state | Requires JavaScript; no SSR for visitor-specific content |
| Single page app | Larger initial bundle; all sections loaded |
| localStorage persistence | Lost if cookies cleared; not synced across devices |
| Timezone for geo | Less accurate than IP lookup; may be wrong |

### Future Improvements

1. **Edge Functions**: Move analytics aggregation to Supabase Edge Functions
2. **ISR for Content**: Use Incremental Static Regeneration for content updates
3. **A/B Testing**: Test different entry experiences
4. **Offline Support**: Service worker for return visitors

---

## Appendix: Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main page, section orchestration |
| `src/store/index.ts` | All Zustand stores |
| `src/content/config.ts` | All content configuration |
| `src/lib/animations.ts` | Animation variants |
| `tailwind.config.ts` | Design system tokens |
