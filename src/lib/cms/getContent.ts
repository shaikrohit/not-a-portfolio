import { supabase } from '@/lib/supabase';
import {
  profile as defaultProfile,
  projects as defaultProjects,
  techStack as defaultSkills,
  experience as defaultExperience,
} from '@/content/config';
import type {
  CMSProfile,
  CMSProject,
  CMSExperience,
  CMSEducation,
  CMSSkill,
  CMSAchievement,
  AllPortfolioContent,
} from '@/types/cms';

export const DEFAULT_PROFILE: CMSProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: defaultProfile.name,
  professional_title: defaultProfile.title,
  headline: defaultProfile.tagline,
  location: defaultProfile.location,
  bio: defaultProfile.introduction.developer,
  email: defaultProfile.email,
  github_url: defaultProfile.github,
  linkedin_url: defaultProfile.linkedin,
  resume_url: defaultProfile.resumeUrl,
  is_published: true,
  updated_at: '2026-10-29T00:00:00Z',
};

export const DEFAULT_PROJECTS: CMSProject[] = defaultProjects.map((p, idx) => ({
  id: `00000000-0000-0000-0001-${String(idx + 1).padStart(12, '0')}`,
  slug: p.id,
  title: p.title,
  tagline: p.description,
  long_description: p.longDescription,
  problem_solved: p.problemSolved,
  architecture_notes: p.architectureNotes,
  tech_stack: p.techStack,
  github_url: p.githubUrl,
  live_url: p.liveUrl || '',
  thumbnail_url: '',
  stars_count: p.metrics?.stars || 0,
  forks_count: p.metrics?.forks || 0,
  commits_count: p.metrics?.commits || 0,
  is_featured: p.featured,
  sort_order: idx + 1,
  is_published: true,
}));

export const DEFAULT_EXPERIENCE: CMSExperience[] = defaultExperience.map((e, idx) => ({
  id: `00000000-0000-0000-0002-${String(idx + 1).padStart(12, '0')}`,
  company: e.company,
  role: e.role,
  period: e.period,
  location: 'Andhra Pradesh, India',
  description: e.description,
  achievements: e.achievements,
  tech_used: e.techUsed,
  sort_order: idx + 1,
  is_published: true,
}));

export const DEFAULT_EDUCATION: CMSEducation[] = [
  {
    id: '00000000-0000-0000-0003-000000000001',
    institution: 'Dr. Y.C. James Yen Govt Polytechnic',
    degree: 'Diploma in Computer Engineering',
    period: '2023 - 2026',
    location: 'Kuppam, Andhra Pradesh, India',
    grade: '96%',
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (Java / C++)',
      'Computer Networks & Protocols',
      'Operating Systems & Linux Shell',
      'Database Management & SQL',
      'Cybersecurity & Network Defense',
    ],
    honors: ['Top percentile academic distinction', 'State Board of Technical Education Honors'],
    sort_order: 1,
    is_published: true,
  },
];

export const DEFAULT_SKILLS: CMSSkill[] = defaultSkills.map((s, idx) => ({
  id: `00000000-0000-0000-0004-${String(idx + 1).padStart(12, '0')}`,
  name: s.name,
  category: s.category,
  proficiency: s.proficiency,
  years_experience: s.yearsUsed,
  icon_identifier: s.name.toLowerCase(),
  reasoning: s.reasoning,
  business_outcome: s.businessOutcome || '',
  sort_order: idx + 1,
  is_published: true,
}));

export const DEFAULT_ACHIEVEMENTS: CMSAchievement[] = [
  {
    id: '00000000-0000-0000-0005-000000000001',
    title: '1st Prize — Regional Technical Innovation',
    issuer: 'Regional Technical Hackathon',
    date: '2025',
    badge: 'Hackathon Champion',
    description:
      'Awarded 1st place for designing AI-enabled smart stadium operations and crowd logistics workflows for FIFA 2026.',
    verification_url: 'https://github.com/shaikrohit/smart-fifa-2026-stadiums',
    sort_order: 1,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000002',
    title: '96% Academic Aggregate Score',
    issuer: 'State Board of Technical Education',
    date: '2023 - 2026',
    badge: 'Academic Distinction',
    description:
      'Sustained top-tier academic distinction throughout the Computer Engineering Diploma at Dr. Y.C. James Yen Govt Polytechnic.',
    verification_url: '',
    sort_order: 2,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000003',
    title: 'AI Developer / Intern @ Sithafal Technologies',
    issuer: 'Sithafal Technologies, Tirupati',
    date: '2024 - Present',
    badge: 'Industry Experience',
    description:
      'Spearheaded generative AI assistant integrations, prompt engineering flows, and responsive React frontend architecture in Tirupati.',
    verification_url: '',
    sort_order: 3,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000004',
    title: 'Docker Production Containerization',
    issuer: 'DevOps & System Architecture',
    date: '2024',
    badge: 'DevOps & Architecture',
    description:
      'Architected multi-stage Docker builds and Nginx deployment pipelines for CarbonSphere, streamlining containerized delivery.',
    verification_url: 'https://github.com/shaikrohit/CarbonSphere',
    sort_order: 4,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000005',
    title: 'Cross-Platform Mobile with Capacitor',
    issuer: 'Mobile Engineering',
    date: '2025',
    badge: 'Mobile Engineering',
    description:
      'Engineered touch-optimized web applications and packaged cross-platform mobile distributions for native environments.',
    verification_url: '',
    sort_order: 5,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000006',
    title: 'Cybersecurity & Ethical Defense',
    issuer: 'Security Foundation',
    date: '2024',
    badge: 'Security Foundation',
    description:
      'Practical expertise in penetration testing, network protocols, input sanitization, and OWASP top security best practices.',
    verification_url: '',
    sort_order: 6,
    is_published: true,
  },
];

export async function getPortfolioContent(): Promise<AllPortfolioContent> {
  if (!supabase) {
    return {
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      experience: DEFAULT_EXPERIENCE,
      education: DEFAULT_EDUCATION,
      skills: DEFAULT_SKILLS,
      achievements: DEFAULT_ACHIEVEMENTS,
    };
  }

  try {
    const [profileRes, projectsRes, expRes, eduRes, skillsRes, achRes] = await Promise.all([
      supabase.from('cms_profile').select('*').eq('is_published', true).limit(1).maybeSingle(),
      supabase
        .from('cms_projects')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cms_experience')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cms_education')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cms_skills')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('cms_achievements')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
    ]);

    return {
      profile: profileRes?.data
        ? ({ ...DEFAULT_PROFILE, ...profileRes.data } as CMSProfile)
        : DEFAULT_PROFILE,
      projects:
        projectsRes?.data && projectsRes.data.length > 0
          ? (projectsRes.data as CMSProject[])
          : DEFAULT_PROJECTS,
      experience:
        expRes?.data && expRes.data.length > 0
          ? (expRes.data as CMSExperience[])
          : DEFAULT_EXPERIENCE,
      education:
        eduRes?.data && eduRes.data.length > 0
          ? (eduRes.data as CMSEducation[])
          : DEFAULT_EDUCATION,
      skills:
        skillsRes?.data && skillsRes.data.length > 0
          ? (skillsRes.data as CMSSkill[])
          : DEFAULT_SKILLS,
      achievements:
        achRes?.data && achRes.data.length > 0
          ? (achRes.data as CMSAchievement[])
          : DEFAULT_ACHIEVEMENTS,
    };
  } catch (error) {
    console.error(
      'Failed to query Supabase CMS tables, falling back to static config defaults:',
      error
    );
    return {
      profile: DEFAULT_PROFILE,
      projects: DEFAULT_PROJECTS,
      experience: DEFAULT_EXPERIENCE,
      education: DEFAULT_EDUCATION,
      skills: DEFAULT_SKILLS,
      achievements: DEFAULT_ACHIEVEMENTS,
    };
  }
}
