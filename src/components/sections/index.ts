/**
 * ============================================================================
 * SECTIONS - MAIN INDEX
 * ============================================================================
 *
 * Central export point for all section components.
 */

// Root Level Primary Sections
export { HeroSection } from './HeroSection';
export { AboutSection } from './AboutSection';
export { ProjectsSection } from './ProjectsSection';
export { SkillsSection } from './SkillsSection';
export { ExperienceSection } from './ExperienceSection';
export { EducationSection } from './EducationSection';
export { AchievementsSection } from './AchievementsSection';
export { PathSelectionSection } from './PathSelectionSection';
export { ContactSection } from './ContactSection';
export { TriviaGame } from './TriviaGame';

// Namespaced and Path-specific exports
import * as DeveloperSections from './developer';
import * as RecruiterSections from './recruiter';
import * as StudentSections from './student';
import * as SharedSections from './shared';

export { DeveloperSections, RecruiterSections, StudentSections, SharedSections };

// Developer Path
export { PhilosophySection, TechStackSection } from './developer';

// Recruiter Path
export { SummarySection } from './recruiter';

// Student Path
export { JourneySection, LearningsSection, QASection } from './student';
