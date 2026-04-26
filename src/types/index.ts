/**
 * TYPE DEFINITIONS
 * 
 * Central type definitions for the application.
 * Strong typing enables confident refactoring and clear contracts.
 */

/**
 * Visitor Types
 * 
 * These four personas represent the primary audiences.
 * The entire content strategy adapts based on this selection.
 */
export type VisitorType = 'developer' | 'recruiter' | 'student' | 'explorer';

export interface VisitorTypeOption {
  id: VisitorType;
  label: string;
  description: string;
  icon: string;
}

/**
 * Analytics & Visitor Tracking
 * 
 * We collect minimal, ethical data.
 * No personal information. No cookies for tracking.
 * Just enough to understand who visits and how.
 */
export interface VisitorSession {
  id: string;
  visitorType: VisitorType | null;
  country: string | null;
  enteredAt: Date;
  pagesVisited: string[];
  timeSpentSeconds: number;
  lastActiveAt: Date;
}

export interface VisitorMessage {
  id: string;
  sessionId: string;
  visitorType: VisitorType;
  message: string;
  createdAt: Date;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  visitorsByType: Record<VisitorType, number>;
  topCountries: Array<{ country: string; count: number }>;
  averageTimeSpent: number;
  thisMonth: {
    developers: number;
    recruiters: number;
    students: number;
    explorers: number;
  };
}

/**
 * Content Types
 * 
 * Structured content that adapts to visitor types.
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  problemSolved: string;
  techStack: string[];
  architectureNotes: string;
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  visibleTo: VisitorType[];
  metrics?: {
    stars: number;
    forks: number;
    commits: number;
  };
}

export interface Skill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept';
  proficiency: 'expert' | 'proficient' | 'familiar';
  yearsUsed: number;
  reasoning: string; // Why this skill matters
  businessOutcome?: string; // For recruiters: what value does this bring?
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  techUsed: string[];
}

export interface LearningMilestone {
  year: number;
  title: string;
  description: string;
  lesson: string;
  visibleTo: VisitorType[];
}

/**
 * UI State Types
 */
export interface NavigationState {
  currentSection: string;
  visitedSections: string[];
  unlockedSections: string[];
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;
}

/**
 * Interaction Types
 * 
 * Micro-interactions and prompts that guide the conversation.
 */
export interface Prompt {
  id: string;
  question: string;
  options: PromptOption[];
  context?: string;
  forVisitorTypes: VisitorType[];
}

export interface PromptOption {
  id: string;
  label: string;
  leadsTo: string; // Section or next prompt ID
  metadata?: Record<string, unknown>;
}

export interface UnlockableSection {
  id: string;
  title: string;
  isUnlocked: boolean;
  unlockCondition: string;
  content: React.ReactNode;
}

/**
 * GitHub Integration Types
 */
export interface GitHubStats {
  username: string;
  publicRepos: number;
  followers: number;
  following: number;
  contributions: number;
  topLanguages: Array<{ name: string; percentage: number }>;
  recentActivity: GitHubActivity[];
}

export interface GitHubActivity {
  type: 'commit' | 'pr' | 'issue' | 'release';
  repo: string;
  description: string;
  date: Date;
}

/**
 * Form Types
 */
export interface ContactFormData {
  visitorType: VisitorType;
  message: string;
  email?: string; // Optional
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
