/**
 * ============================================================================
 * SECTIONS - MAIN INDEX
 * ============================================================================
 * 
 * @description Central export point for all section components.
 *              Organized by visitor path for easy imports.
 * 
 * FOLDER STRUCTURE:
 * sections/
 * ├── developer/       # Developer path sections
 * │   ├── PhilosophySection.tsx
 * │   ├── TechStackSection.tsx
 * │   ├── ProjectsSection.tsx
 * │   └── index.ts
 * │
 * ├── recruiter/       # Recruiter path sections
 * │   ├── SummarySection.tsx
 * │   ├── SkillsSection.tsx
 * │   ├── ExperienceSection.tsx
 * │   └── index.ts
 * │
 * ├── student/         # Student path sections
 * │   ├── JourneySection.tsx
 * │   ├── LearningsSection.tsx
 * │   ├── QASection.tsx
 * │   └── index.ts
 * │
 * ├── shared/          # Shared across all paths
 * │   ├── AboutSection.tsx
 * │   ├── ContactSection.tsx
 * │   └── index.ts
 * │
 * └── index.ts         # This file (main exports)
 * 
 * @usage
 * ```tsx
 * // Import by path
 * import { PhilosophySection, TechStackSection } from '@/components/sections/developer';
 * import { SummarySection, ExperienceSection } from '@/components/sections/recruiter';
 * import { JourneySection, QASection } from '@/components/sections/student';
 * import { AboutSection, ContactSection } from '@/components/sections/shared';
 * 
 * // Or import from main index
 * import { DeveloperSections, RecruiterSections, StudentSections, SharedSections } from '@/components/sections';
 * ```
 * ============================================================================
 */

// ============================================================================
// PATH-SPECIFIC EXPORTS (as namespaces for organized imports)
// ============================================================================

import * as DeveloperSections from './developer';
import * as RecruiterSections from './recruiter';
import * as StudentSections from './student';
import * as SharedSections from './shared';

export { DeveloperSections, RecruiterSections, StudentSections, SharedSections };

// ============================================================================
// INDIVIDUAL COMPONENT EXPORTS (for direct imports)
// ============================================================================

// Developer Path
export { PhilosophySection, TechStackSection, ProjectsSection } from './developer';

// Recruiter Path
export { SummarySection, SkillsSection, ExperienceSection } from './recruiter';

// Student Path
export { JourneySection, LearningsSection, QASection } from './student';

// Shared
export { AboutSection, ContactSection } from './shared';

// ============================================================================
// SECTION MAPPING (useful for dynamic rendering)
// ============================================================================

import { PhilosophySection, TechStackSection, ProjectsSection } from './developer';
import { SummarySection, SkillsSection, ExperienceSection } from './recruiter';
import { JourneySection, LearningsSection, QASection } from './student';
import { AboutSection, ContactSection } from './shared';

/**
 * Mapping of section IDs to components.
 * Use this for dynamic section rendering based on visitor type.
 */
export const sectionComponents = {
  // Developer
  philosophy: PhilosophySection,
  techStack: TechStackSection,
  projects: ProjectsSection,
  
  // Recruiter
  summary: SummarySection,
  skills: SkillsSection,
  experience: ExperienceSection,
  
  // Student
  journey: JourneySection,
  learnings: LearningsSection,
  qa: QASection,
  
  // Shared
  about: AboutSection,
  contact: ContactSection,
} as const;

/**
 * Section configuration by visitor type.
 * Defines which sections appear for each visitor path.
 */
export const sectionsByVisitorType = {
  developer: ['philosophy', 'techStack', 'projects', 'about', 'contact'],
  recruiter: ['summary', 'skills', 'experience', 'about', 'contact'],
  student: ['journey', 'learnings', 'qa', 'about', 'contact'],
  explorer: ['about', 'projects', 'contact'], // Mix of sections for explorers
} as const;

export type SectionId = keyof typeof sectionComponents;
export type VisitorType = keyof typeof sectionsByVisitorType;
