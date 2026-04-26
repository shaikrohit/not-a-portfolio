# 🧩 Components Folder

> All React components live here, organized by purpose.

## Folder Structure

```
components/
├── ui/                 # 🎨 Design System (reusable everywhere)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Text.tsx
│   ├── Input.tsx
│   ├── Animations.tsx
│   └── index.ts        # Exports all UI components
│
├── layout/             # 📐 Page Layout Components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   └── index.ts
│
├── sections/           # 📄 Page Sections (by visitor type)
│   ├── developer/      # Developer path sections
│   │   ├── PhilosophySection.tsx
│   │   ├── TechStackSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── index.ts
│   ├── recruiter/      # Recruiter path sections
│   │   ├── SummarySection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   └── index.ts
│   ├── student/        # Student/Explorer path sections
│   │   ├── JourneySection.tsx
│   │   ├── LearningsSection.tsx
│   │   ├── QASection.tsx
│   │   └── index.ts
│   ├── shared/         # Shared across all paths
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── index.ts
│   └── index.ts        # Exports all sections
│
└── features/           # ⚡ Feature-specific components
    ├── entry/          # Entry experience flow
    │   ├── EntryExperience.tsx
    │   ├── VisitorTypeCard.tsx
    │   └── index.ts
    └── index.ts
```

## How to Use

### Import from UI

```tsx
import { Button, Card, Text } from '@/components/ui';
```

### Import Sections

```tsx
import { PhilosophySection } from '@/components/sections/developer';
import { AboutSection } from '@/components/sections/shared';
```

### Import Features

```tsx
import { EntryExperience } from '@/components/features/entry';
```

## Naming Rules

1. **Files**: PascalCase matching component name (`Button.tsx`)
2. **Folders**: lowercase (`developer/`, `ui/`)
3. **Index files**: Always re-export components
4. **One component per file** (except small helpers)
