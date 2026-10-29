/**
 * ENTERPRISE CMS TYPE DEFINITIONS
 *
 * Full TypeScript contracts for Supabase PostgreSQL tables,
 * Admin HQ CMS editors, draft management, and multi-storage drivers.
 */

export interface CMSProfile {
  id: string;
  full_name: string;
  professional_title: string;
  headline: string;
  location: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  is_published: boolean;
  updated_at: string;
}

export interface CMSProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  long_description: string;
  problem_solved: string;
  architecture_notes: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  stars_count: number;
  forks_count: number;
  commits_count: number;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech_used: string[];
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSEducation {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  grade: string;
  coursework: string[];
  honors: string[];
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSSkill {
  id: string;
  name: string;
  category: 'framework' | 'language' | 'tool' | 'concept';
  proficiency: 'expert' | 'proficient' | 'familiar';
  years_experience: number;
  icon_identifier: string;
  reasoning: string;
  business_outcome: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSAchievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  description: string;
  verification_url: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMSContentDraft {
  id?: string;
  section: string;
  draft_data: unknown;
  updated_at?: string;
}

export interface CMSMediaItem {
  id: string;
  name: string;
  url: string;
  provider: 'cloudinary' | 'supabase' | 'cloudflare_r2';
  size_bytes?: number;
  created_at: string;
}

export interface AllPortfolioContent {
  profile: CMSProfile;
  projects: CMSProject[];
  experience: CMSExperience[];
  education: CMSEducation[];
  skills: CMSSkill[];
  achievements: CMSAchievement[];
}
