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
  credly_url: defaultProfile.credly,
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
    institution: 'Madanapalle Institute of Technology & Science',
    degree: 'B.Tech - CSE (Cyber Security)',
    field_of_study: 'Computer Science & Engineering (Cyber Security)',
    period: '2026 - 2029',
    location: 'Madanapalle, Andhra Pradesh, India',
    grade: 'Pursuing',
    status: 'pursuing',
    coursework: [
      'Cybersecurity & Network Defense',
      'Ethical Hacking & Penetration Testing',
      'Digital Forensics & Incident Response',
      'Data Structures & Algorithms',
      'Operating Systems & Linux Shell',
      'Object-Oriented Programming (Java / Python)',
    ],
    honors: [
      'Second-Year B.Tech Student in Cyber Security',
      'OWASP Open-Source Security Contributor',
      'Active CTF Challenge Competitor',
    ],
    sort_order: 1,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0003-000000000002',
    institution: 'Dr. Y.C. James Yen Govt Polytechnic, Kuppam',
    degree: 'Diploma in Computer Engineering (DCME)',
    field_of_study: 'Computer Engineering',
    period: '2023 - 2026',
    location: 'Kuppam, Andhra Pradesh, India',
    grade: '88.5%',
    status: 'completed',
    coursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (Java / C++)',
      'Computer Networks & Protocols',
      'Operating Systems & Linux Shell',
      'Database Management & SQL',
      'Web Technologies & Development',
    ],
    honors: [
      '88.5% Distinction in State Technical Board Examinations',
      '1st Prize in Regional Technical Innovation Hackathon',
    ],
    sort_order: 2,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0003-000000000003',
    institution: 'Elena Bettini English Medium High School',
    degree: 'Secondary School Certificate (SSC)',
    field_of_study: 'General High School Curriculum',
    period: '2022 - 2023',
    location: 'Palamaner, Andhra Pradesh, India',
    grade: '78.8%',
    status: 'completed',
    coursework: [
      'Mathematics & Analytics',
      'Physical & Biological Sciences',
      'Information & Computer Basics',
      'English & Languages',
    ],
    honors: ['First Class Academic Completion'],
    sort_order: 3,
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
    title: 'OWASP Open-Source Security Contributions',
    issuer: 'OWASP Foundation & GitHub',
    date: '2026',
    badge: 'Open-Source Security',
    description:
      'Active contributor to OWASP-related security repositories and open-source tooling on GitHub.',
    verification_url: 'https://github.com/shaikrohit',
    sort_order: 1,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000002',
    title: 'Capture The Flag (CTF) Cybersecurity Challenges',
    issuer: 'Cybersecurity Community Challenges',
    date: '2025 - 2026',
    badge: 'CTF Competitor',
    description:
      'Solved challenges across network packet analysis, digital forensics, cryptography, web security, OSINT, and binary exploitation.',
    verification_url: '',
    sort_order: 2,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000003',
    title: 'Python Programming Certification',
    issuer: 'APSSDC',
    date: 'May 2026',
    badge: 'Certified Developer',
    description:
      'Certified in Python Programming covering object-oriented architecture, data processing, and scripting.',
    verification_url: '',
    sort_order: 3,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000004',
    title: 'Getting Started with Generative AI',
    issuer: 'IBM SkillsBuild',
    date: 'March 2026',
    badge: 'AI Certification',
    description:
      'Certified by IBM in Generative AI fundamentals, prompt engineering, and LLM application integrations.',
    verification_url: '',
    sort_order: 4,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000005',
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: 'December 2025',
    badge: 'Cisco Security',
    description:
      'Comprehensive foundation in network defense, cybersecurity principles, threat intelligence, and privacy.',
    verification_url: '',
    sort_order: 5,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000006',
    title: 'Python Essentials Certification',
    issuer: 'edX & Cisco Networking Academy',
    date: 'July 2024',
    badge: 'edX Certified',
    description:
      'Foundational mastery of Python data types, algorithms, logic branching, and modular programming.',
    verification_url: '',
    sort_order: 6,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000007',
    title: '1st Prize — Regional Technical Innovation',
    issuer: 'State Technical Hackathon',
    date: '2025',
    badge: 'Hackathon Champion',
    description:
      'Won 1st Place for architectural prototype in AI-enabled smart stadium operations and logistics.',
    verification_url: 'https://github.com/shaikrohit/smart-fifa-2026-stadiums',
    sort_order: 7,
    is_published: true,
  },
  {
    id: '00000000-0000-0000-0005-000000000008',
    title: '88.5% DCME Academic Distinction',
    issuer: 'State Board of Technical Education & Training',
    date: '2023 - 2026',
    badge: 'Academic Distinction',
    description:
      'Completed 3-year Computer Engineering Diploma with 88.5% aggregate distinction score.',
    verification_url: '',
    sort_order: 8,
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
