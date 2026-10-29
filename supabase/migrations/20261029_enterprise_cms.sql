-- ============================================================================
-- Enterprise Content Management System (CMS) Migration
-- File: supabase/migrations/20261029_enterprise_cms.sql
-- ============================================================================

-- 1. CMS PROFILE (Singleton)
CREATE TABLE IF NOT EXISTS cms_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL DEFAULT 'Shaik Rohit',
  professional_title TEXT NOT NULL DEFAULT 'Full Stack & AI Developer',
  headline TEXT NOT NULL DEFAULT 'Frontend Developer • React • Docker • Modern Web Applications',
  location TEXT NOT NULL DEFAULT 'Kuppam, Andhra Pradesh, India',
  bio TEXT NOT NULL DEFAULT 'I am a Computer Engineering student and developer focused on building modern, high-performance web applications. I specialize in React, TypeScript, and Docker containerization with an engineering philosophy centered on clarity, security, and reproducible builds.',
  email TEXT NOT NULL DEFAULT 'shaik.rohit.official@gmail.com',
  github_url TEXT DEFAULT 'https://github.com/shaikrohit',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/rohitshaik',
  resume_url TEXT DEFAULT '/resume.pdf',
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CMS PROJECTS
CREATE TABLE IF NOT EXISTS cms_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  long_description TEXT,
  problem_solved TEXT,
  architecture_notes TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  stars_count INT NOT NULL DEFAULT 0,
  forks_count INT NOT NULL DEFAULT 0,
  commits_count INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CMS EXPERIENCE
CREATE TABLE IF NOT EXISTS cms_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT DEFAULT 'India',
  description TEXT NOT NULL,
  achievements TEXT[] NOT NULL DEFAULT '{}',
  tech_used TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CMS EDUCATION
CREATE TABLE IF NOT EXISTS cms_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT DEFAULT 'Kuppam, Andhra Pradesh, India',
  grade TEXT DEFAULT '96%',
  coursework TEXT[] NOT NULL DEFAULT '{}',
  honors TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CMS SKILLS
CREATE TABLE IF NOT EXISTS cms_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('framework', 'language', 'tool', 'concept')),
  proficiency TEXT NOT NULL CHECK (proficiency IN ('expert', 'proficient', 'familiar')),
  years_experience INT NOT NULL DEFAULT 1,
  icon_identifier TEXT,
  reasoning TEXT,
  business_outcome TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CMS ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS cms_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  badge TEXT,
  description TEXT,
  verification_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. CMS CONTENT DRAFTS (Staged modifications before live publishing)
CREATE TABLE IF NOT EXISTS cms_content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL,
  draft_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CMS SETTINGS (Key-value site settings)
CREATE TABLE IF NOT EXISTS cms_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE cms_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_settings ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated read policies for published content
CREATE POLICY "Public read published cms_profile" ON cms_profile FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published cms_projects" ON cms_projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published cms_experience" ON cms_experience FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published cms_education" ON cms_education FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published cms_skills" ON cms_skills FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published cms_achievements" ON cms_achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public read cms_settings" ON cms_settings FOR SELECT USING (true);

-- Service role full access for admin CRUD operations via Server Actions
CREATE POLICY "Service role full access cms_profile" ON cms_profile FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_projects" ON cms_projects FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_experience" ON cms_experience FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_education" ON cms_education FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_skills" ON cms_skills FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_achievements" ON cms_achievements FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_content_drafts" ON cms_content_drafts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access cms_settings" ON cms_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED DATA (FACTORY DEFAULTS)
-- ============================================================================

INSERT INTO cms_profile (id, full_name, professional_title, headline, location, bio, email, github_url, linkedin_url, resume_url, is_published)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Shaik Rohit',
  'Full Stack & AI Developer',
  'Frontend Developer • React • Docker • Modern Web Applications',
  'Kuppam, Andhra Pradesh, India',
  'I am a Computer Engineering student and developer focused on building modern, high-performance web applications. I specialize in React, TypeScript, and Docker containerization with an engineering philosophy centered on clarity, security, and reproducible builds. This site is not a generic static showcase—it is an interactive system designed to demonstrate clean architecture and thoughtful UX.',
  'shaik.rohit.official@gmail.com',
  'https://github.com/shaikrohit',
  'https://www.linkedin.com/in/rohitshaik',
  '/resume.pdf',
  true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cms_projects (slug, title, tagline, long_description, problem_solved, architecture_notes, tech_stack, github_url, live_url, stars_count, forks_count, commits_count, is_featured, sort_order, is_published)
VALUES
(
  'carbon-sphere',
  'CarbonSphere',
  'Interactive Carbon Footprint Tracker & Awareness Platform',
  'A full-stack carbon footprint awareness application featuring real-time data visualization and lifestyle emission assessments. Containerized with Docker and served via Nginx for production-grade reliability.',
  'Transforms abstract climate statistics into actionable, personal lifestyle metrics with engaging visuals.',
  'Multi-stage Dockerfile producing a minimal static output served through an optimized Nginx container.',
  ARRAY['React', 'Vite', 'Docker', 'Nginx', 'Tailwind CSS', 'ESLint'],
  'https://github.com/shaikrohit/CarbonSphere',
  NULL,
  8, 2, 42,
  true, 1, true
),
(
  'smart-fifa',
  'Smart FIFA 2026 Stadiums',
  'GenAI-enabled stadium operations & fan experience platform',
  'An innovative hackathon project engineered for the upcoming FIFA World Cup 2026. Employs generative AI to streamline stadium logistics, optimize crowd movement, and deliver real-time assistance to international fans.',
  'Mitigates large-scale tournament bottlenecks through smart attendee guidance and automated venue queries.',
  'Modular AI query interface connected to high-density venue datasets for low-latency recommendations.',
  ARRAY['GenAI', 'React', 'JavaScript', 'Tailwind CSS'],
  'https://github.com/shaikrohit/smart-fifa-2026-stadiums',
  NULL,
  6, 1, 28,
  true, 2, true
),
(
  'election-guide',
  'Election Guide AI',
  'Intelligent AI assistant simplifying democratic voting workflows',
  'An AI-powered conversational guide that walks citizens through voter registration, polling station locators, and election timelines with verified, unbiased step-by-step guidance.',
  'Demystifies complex governmental electoral procedures for first-time and regional voters.',
  'Conversational agent architecture with deterministic fallback paths ensuring factual, dependable guidance.',
  ARRAY['AI/NLP', 'React', 'JavaScript', 'Tailwind CSS'],
  'https://github.com/shaikrohit/election-guide-ai',
  NULL,
  5, 1, 35,
  true, 3, true
),
(
  'green-route',
  'GreenRoute',
  'Python backend for eco-friendly route planning & carbon reduction',
  'A Python backend service utilizing relational database queries to evaluate transit options and compute travel paths that minimize overall greenhouse gas emissions.',
  'Enables carbon-conscious travelers and fleets to factor environmental impact into route selection.',
  'Algorithmic routing service with SQLite data store engineered for rapid edge responses.',
  ARRAY['Python', 'Flask', 'SQLite', 'REST API'],
  'https://github.com/shaikrohit/GreenRoute',
  NULL,
  4, 0, 20,
  false, 4, true
),
(
  'bhumi-darpan',
  'Bhumi Darpan',
  'Land information and spatial records accessibility web application',
  'A modern React application deployed on Vercel with automated CI/CD and oxlint integration, delivering an intuitive interface for inspecting spatial land records and status details.',
  'Improves civic transparency and public access to land documentation through a responsive web interface.',
  'Vite-based build pipeline with high-speed automated linting and zero-configuration Vercel deployment.',
  ARRAY['React', 'Vite', 'Vercel', 'oxlint', 'JavaScript'],
  'https://github.com/shaikrohit/bhumi-darpan',
  NULL,
  3, 0, 18,
  false, 5, true
),
(
  'not-a-portfolio',
  'Not A Portfolio',
  'Interactive conversation-driven digital identity experience',
  'The dynamic application you are exploring right now. Features persona-driven journeys, interactive 3D particle canvas visuals, dark/light themes, and real-time Supabase trivia competitions.',
  'Replaces stale resume lists with an adaptive, conversational presentation that respects visitor context.',
  'App Router architecture with server actions, client Zustand stores, and hardware-accelerated Canvas physics.',
  ARRAY['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
  'https://github.com/shaikrohit/not-a-portfolio',
  'https://shaikrohit.tech',
  15, 4, 85,
  true, 6, true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO cms_experience (company, role, period, location, description, achievements, tech_used, sort_order, is_published)
VALUES
(
  'Sithafal Technologies, Tirupati',
  'AI Developer / Intern',
  '2024 - Present',
  'Tirupati, Andhra Pradesh, India',
  'Developing cutting-edge generative AI applications, intelligent assistants, and modern full-stack web solutions. Bridging technical AI capabilities with responsive, accessible user interfaces.',
  ARRAY[
    'Engineered enterprise conversational AI assistant workflows with reliable context management',
    'Developed responsive React frontends with high-performance animations and sub-second interactions',
    'Implemented robust client-side validation and security-first API communications'
  ],
  ARRAY['React', 'TypeScript', 'GenAI', 'LLMs', 'Node.js', 'Tailwind CSS'],
  1,
  true
),
(
  'Dr. Y.C. James Yen Govt Polytechnic',
  'Computer Engineering Student',
  '2023 - 2026',
  'Kuppam, Andhra Pradesh, India',
  'Pursuing Diploma in Computer Engineering with academic distinction. Focusing on data structures, operating systems, network security, and practical full-stack software development.',
  ARRAY[
    '1st Prize in Regional Technical Innovation Hackathon',
    'Maintained a stellar 96% aggregate score across all academic semesters',
    'Led student technical workshops on web development and open source practices'
  ],
  ARRAY['C', 'Java', 'Python', 'Web Technologies', 'Linux', 'Computer Networks'],
  2,
  true
);

INSERT INTO cms_education (institution, degree, period, location, grade, coursework, honors, sort_order, is_published)
VALUES
(
  'Dr. Y.C. James Yen Govt Polytechnic',
  'Diploma in Computer Engineering',
  '2023 - 2026',
  'Kuppam, Andhra Pradesh, India',
  '96%',
  ARRAY[
    'Data Structures & Algorithms',
    'Object-Oriented Programming (Java / C++)',
    'Computer Networks & Protocols',
    'Operating Systems & Linux Shell',
    'Database Management & SQL',
    'Cybersecurity & Network Defense'
  ],
  ARRAY['Top percentile academic distinction', 'State Board of Technical Education Honors'],
  1,
  true
);

INSERT INTO cms_skills (name, category, proficiency, years_experience, icon_identifier, reasoning, business_outcome, sort_order, is_published)
VALUES
(
  'React', 'framework', 'expert', 2, 'react',
  'Component-driven architecture with React 19 concurrent features enables fluid, declarative UI development.',
  'Built modern SPAs, interactive dashboards, and mobile web views with sub-second time-to-interactive.',
  1, true
),
(
  'JavaScript / TypeScript', 'language', 'expert', 2, 'typescript',
  'Strict static typing eliminates runtime bugs and guarantees self-documenting codebases for confident refactoring.',
  'Drastically reduced type-related defects and improved maintainability across projects.',
  2, true
),
(
  'Docker', 'tool', 'proficient', 1, 'docker',
  'Standardizes reproducible environments and enables lightweight multi-stage image optimization with Nginx reverse proxying.',
  'Containerized CarbonSphere with multi-stage builds, minimizing production footprint and simplifying deployments.',
  3, true
),
(
  'Next.js', 'framework', 'proficient', 1, 'nextjs',
  'Hybrid static and server rendering, file-based routing, and built-in image/font optimization for top Core Web Vitals.',
  'Engineered not-a-portfolio achieving 95+ Lighthouse scores with dynamic route segregation.',
  4, true
),
(
  'Tailwind CSS', 'tool', 'expert', 2, 'tailwind',
  'Token-based utility framework facilitating consistent design systems, dark/light themes, and minimal CSS bundle sizes.',
  'Created polished glassmorphism and bento grid systems while keeping stylesheet overhead under 15KB.',
  5, true
),
(
  'Python & Flask', 'language', 'proficient', 2, 'python',
  'Versatile language with clean syntax for backend services, algorithmic calculations, and data processing.',
  'Developed GreenRoute backend engine computing low-emission transit routes with SQLite persistence.',
  6, true
),
(
  'GenAI & LLMs', 'concept', 'proficient', 1, 'ai',
  'Integrating large language models and prompt engineering into interactive frontends for domain-specific automation.',
  'Shipped AI assistants in Smart FIFA 2026 and Election Guide AI providing context-aware recommendations.',
  7, true
),
(
  'Capacitor', 'tool', 'proficient', 1, 'capacitor',
  'Cross-platform runtime bridging modern React web applications into native Android/iOS mobile experiences.',
  'Successfully packaged responsive web applications into cross-platform mobile distributions.',
  8, true
),
(
  'Supabase & PostgreSQL', 'tool', 'proficient', 1, 'supabase',
  'Reliable relational database with real-time subscriptions, Row-Level Security, and instant REST APIs.',
  'Implemented real-time trivia leaderboard with live ranking synchronizations.',
  9, true
),
(
  'Git & Linux', 'tool', 'proficient', 2, 'git',
  'Command-line proficiency, branch management, shell scripting, and automated CI/CD workflows.',
  'Maintained 17+ repositories with clean commit history, automated linting, and deploy actions.',
  10, true
);

INSERT INTO cms_achievements (title, issuer, date, badge, description, verification_url, sort_order, is_published)
VALUES
(
  '1st Prize — Regional Technical Innovation',
  'Regional Technical Hackathon',
  '2025',
  'Hackathon Champion',
  'Awarded 1st place for designing AI-enabled smart stadium operations and crowd logistics workflows for FIFA 2026.',
  'https://github.com/shaikrohit/smart-fifa-2026-stadiums',
  1, true
),
(
  '96% Academic Aggregate Score',
  'State Board of Technical Education',
  '2023 - 2026',
  'Academic Distinction',
  'Sustained top-tier academic distinction throughout the Computer Engineering Diploma at Dr. Y.C. James Yen Govt Polytechnic.',
  NULL,
  2, true
),
(
  'AI Developer / Intern @ Sithafal Technologies',
  'Sithafal Technologies, Tirupati',
  '2024 - Present',
  'Industry Experience',
  'Spearheaded generative AI assistant integrations, prompt engineering flows, and responsive React frontend architecture in Tirupati.',
  NULL,
  3, true
),
(
  'Docker Production Containerization',
  'DevOps & System Architecture',
  '2024',
  'DevOps & Architecture',
  'Architected multi-stage Docker builds and Nginx deployment pipelines for CarbonSphere, streamlining containerized delivery.',
  'https://github.com/shaikrohit/CarbonSphere',
  4, true
),
(
  'Cross-Platform Mobile with Capacitor',
  'Mobile Engineering',
  '2025',
  'Mobile Engineering',
  'Engineered touch-optimized web applications and packaged cross-platform mobile distributions for native environments.',
  NULL,
  5, true
),
(
  'Cybersecurity & Ethical Defense',
  'Security Foundation',
  '2024',
  'Security Foundation',
  'Practical expertise in penetration testing, network protocols, input sanitization, and OWASP top security best practices.',
  NULL,
  6, true
);
