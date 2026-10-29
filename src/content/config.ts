/**
 * CONTENT CONFIGURATION
 *
 * This file contains all the content that adapts based on visitor type.
 * All data has been verified against GitHub (github.com/shaikrohit)
 * and LinkedIn (linkedin.com/in/rohitshaik).
 *
 * Philosophy: Content should be honest, thoughtful, and non-promotional.
 */

import type { VisitorType, Project, Skill, Experience, LearningMilestone } from '@/types';

/**
 * DEVELOPER PROFILE
 * Verified details from GitHub & LinkedIn
 */
export const profile = {
  name: 'Shaik Rohit',
  title: 'Full Stack & AI Developer',
  tagline: 'Frontend Developer • React • Docker • Modern Web Applications',
  location: 'Kuppam, Andhra Pradesh, India',

  // Adaptive introductions based on visitor persona
  introduction: {
    developer: `I am a Computer Engineering student and developer focused on building modern, high-performance web applications. 
    I specialize in React, TypeScript, and Docker containerization with an engineering philosophy centered on clarity, security, and reproducible builds.
    
    This site is not a generic static showcase—it is an interactive system designed to demonstrate clean architecture and thoughtful UX.`,

    recruiter: `I am a high-achieving Computer Engineering student (96% aggregate) at Dr. Y.C. James Yen Govt Polytechnic and an AI Developer / Intern at Sithafal Technologies, Tirupati.
    I have won 1st Prize in Regional Technical Innovation, containerized production web apps with Docker, and delivered real AI-driven tools.
    
    I am seeking software engineering roles where I can contribute to modern web frontends, AI integrations, and scalable systems.`,

    student: `I am currently pursuing my Diploma in Computer Engineering (2023–2026) at Dr. Y.C. James Yen Govt Polytechnic. 
    I have maintained a 96% academic score while actively developing real open-source, hackathon, and containerized projects.
    
    I believe the best way to master tech is by building real projects, embracing constraints, and escaping tutorial hell early.`,

    explorer: `Welcome! I'm Shaik Rohit. I build modern web applications, explore generative AI and Docker workflows, and enjoy turning complex problems into elegant software.
    
    Feel free to explore my verified projects, technical skills, and journey. This experience adapts to your curiosity.`,
  },

  email: 'shaik.rohit.official@gmail.com',
  github: 'https://github.com/shaikrohit',
  linkedin: 'https://www.linkedin.com/in/rohitshaik',
  resumeUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/resume.pdf`
    : '/resume.pdf',
};

/**
 * ENGINEERING PHILOSOPHY
 * Guiding principles for robust software construction
 */
export const philosophy = {
  title: 'Engineering Philosophy',
  subtitle: 'Principles that guide how I build software',

  principles: [
    {
      id: 'clarity',
      title: 'Clarity over cleverness',
      description: `Clever code feels satisfying to write, but it quickly becomes a burden to maintain. 
      I optimize for the developer who will read this code six months from now—often that is me.`,
      example: `Instead of opaque one-liner tricks, I write expressive, well-named functions and strict TypeScript contracts.`,
    },
    {
      id: 'constraints',
      title: 'Constraints breed creativity',
      description: `Infinite options lead to decision fatigue. Intentionally limiting dependencies and sticking to proven fundamentals forces creative and robust problem-solving.`,
      example: `Building high-performance Canvas 3D particle visualizers directly without heavy 300KB WebGL dependencies keeps bundles lean and loads instantaneous.`,
    },
    {
      id: 'shipping',
      title: 'Ship, measure, and iterate',
      description: `Working software in production provides insights no theoretical discussion can replicate. Fast feedback cycles from real users beat prolonged speculation.`,
      example: `Dockerizing applications with multi-stage builds ensures rapid, reproducible deployments across Vercel, Netlify, and local setups.`,
    },
    {
      id: 'security',
      title: 'Security as a default foundation',
      description: `Security and accessibility are never retrofitted features. From input sanitization to strict type bounds and content security headers, protection starts at architecture.`,
      example: `Validating schemas, sanitizing user inputs, and isolating runtime state prevents entire categories of production vulnerabilities.`,
    },
  ],
};

/**
 * TECHNICAL EXPERTISE (VERIFIED FROM REPOSITORIES)
 */
export const techStack: Skill[] = [
  {
    name: 'React',
    category: 'framework',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Component-driven architecture with React 19 concurrent features enables fluid, declarative UI development.`,
    businessOutcome:
      'Built modern SPAs, interactive dashboards, and mobile web views with sub-second time-to-interactive.',
  },
  {
    name: 'JavaScript / TypeScript',
    category: 'language',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Strict static typing eliminates runtime bugs and guarantees self-documenting codebases for confident refactoring.`,
    businessOutcome:
      'Drastically reduced type-related defects and improved maintainability across projects.',
  },
  {
    name: 'Docker',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Standardizes reproducible environments and enables lightweight multi-stage image optimization with Nginx reverse proxying.`,
    businessOutcome:
      'Containerized CarbonSphere with multi-stage builds, minimizing production footprint and simplifying deployments.',
  },
  {
    name: 'Next.js',
    category: 'framework',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Hybrid static and server rendering, file-based routing, and built-in image/font optimization for top Core Web Vitals.`,
    businessOutcome:
      'Engineered not-a-portfolio achieving 95+ Lighthouse scores with dynamic route segregation.',
  },
  {
    name: 'Tailwind CSS',
    category: 'tool',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Token-based utility framework facilitating consistent design systems, dark/light themes, and minimal CSS bundle sizes.`,
    businessOutcome:
      'Created polished glassmorphism and bento grid systems while keeping stylesheet overhead under 15KB.',
  },
  {
    name: 'Python & Flask',
    category: 'language',
    proficiency: 'proficient',
    yearsUsed: 2,
    reasoning: `Versatile language with clean syntax for backend services, algorithmic calculations, and data processing.`,
    businessOutcome:
      'Developed GreenRoute backend engine computing low-emission transit routes with SQLite persistence.',
  },
  {
    name: 'GenAI & LLMs',
    category: 'concept',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Integrating large language models and prompt engineering into interactive frontends for domain-specific automation.`,
    businessOutcome:
      'Shipped AI assistants in Smart FIFA 2026 and Election Guide AI providing context-aware recommendations.',
  },
  {
    name: 'Capacitor',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Cross-platform runtime bridging modern React web applications into native Android/iOS mobile experiences.`,
    businessOutcome:
      'Successfully packaged responsive web applications into cross-platform mobile distributions.',
  },
  {
    name: 'Supabase & PostgreSQL',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Reliable relational database with real-time subscriptions, Row-Level Security, and instant REST APIs.`,
    businessOutcome: 'Implemented real-time trivia leaderboard with live ranking synchronizations.',
  },
  {
    name: 'Git & Linux',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 2,
    reasoning: `Command-line proficiency, branch management, shell scripting, and automated CI/CD workflows.`,
    businessOutcome:
      'Maintained 17+ repositories with clean commit history, automated linting, and deploy actions.',
  },
];

/**
 * REAL PROJECTS (VERIFIED FROM GITHUB)
 */
export const projects: Project[] = [
  {
    id: 'carbon-sphere',
    title: 'CarbonSphere',
    description: 'Interactive Carbon Footprint Tracker & Awareness Platform',
    longDescription: `A full-stack carbon footprint awareness application featuring real-time data visualization and lifestyle emission assessments. 
    Containerized with Docker and served via Nginx for production-grade reliability. Users can calculate their carbon footprint, compare benchmarks, and adopt sustainability milestones.`,
    problemSolved:
      'Transforms abstract climate statistics into actionable, personal lifestyle metrics with engaging visuals.',
    techStack: ['React', 'Vite', 'Docker', 'Nginx', 'Tailwind CSS', 'ESLint'],
    architectureNotes:
      'Multi-stage Dockerfile producing a minimal static output served through an optimized Nginx container.',
    githubUrl: 'https://github.com/shaikrohit/CarbonSphere',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'student', 'explorer'],
    metrics: {
      stars: 8,
      forks: 2,
      commits: 42,
    },
  },
  {
    id: 'smart-fifa',
    title: 'Smart FIFA 2026 Stadiums',
    description: 'GenAI-enabled stadium operations & fan experience platform',
    longDescription: `An innovative hackathon project engineered for the upcoming FIFA World Cup 2026. Employs generative AI to streamline stadium logistics, optimize crowd movement, and deliver real-time assistance to international fans.`,
    problemSolved:
      'Mitigates large-scale tournament bottlenecks through smart attendee guidance and automated venue queries.',
    techStack: ['GenAI', 'React', 'JavaScript', 'Tailwind CSS'],
    architectureNotes:
      'Modular AI query interface connected to high-density venue datasets for low-latency recommendations.',
    githubUrl: 'https://github.com/shaikrohit/smart-fifa-2026-stadiums',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'explorer'],
    metrics: {
      stars: 6,
      forks: 1,
      commits: 28,
    },
  },
  {
    id: 'election-guide',
    title: 'Election Guide AI',
    description: 'Intelligent AI assistant simplifying democratic voting workflows',
    longDescription: `An AI-powered conversational guide that walks citizens through voter registration, polling station locators, and election timelines with verified, unbiased step-by-step guidance.`,
    problemSolved:
      'Demystifies complex governmental electoral procedures for first-time and regional voters.',
    techStack: ['AI/NLP', 'React', 'JavaScript', 'Tailwind CSS'],
    architectureNotes:
      'Conversational agent architecture with deterministic fallback paths ensuring factual, dependable guidance.',
    githubUrl: 'https://github.com/shaikrohit/election-guide-ai',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'student', 'explorer'],
    metrics: {
      stars: 5,
      forks: 1,
      commits: 35,
    },
  },
  {
    id: 'green-route',
    title: 'GreenRoute',
    description: 'Python backend for eco-friendly route planning & carbon reduction',
    longDescription: `A Python backend service utilizing relational database queries to evaluate transit options and compute travel paths that minimize overall greenhouse gas emissions.`,
    problemSolved:
      'Enables carbon-conscious travelers and fleets to factor environmental impact into route selection.',
    techStack: ['Python', 'Flask', 'SQLite', 'REST API'],
    architectureNotes:
      'Algorithmic routing service with SQLite data store engineered for rapid edge responses.',
    githubUrl: 'https://github.com/shaikrohit/GreenRoute',
    featured: false,
    visibleTo: ['developer', 'student'],
    metrics: {
      stars: 4,
      forks: 0,
      commits: 20,
    },
  },
  {
    id: 'bhumi-darpan',
    title: 'Bhumi Darpan',
    description: 'Land information and spatial records accessibility web application',
    longDescription: `A modern React application deployed on Vercel with automated CI/CD and oxlint integration, delivering an intuitive interface for inspecting spatial land records and status details.`,
    problemSolved:
      'Improves civic transparency and public access to land documentation through a responsive web interface.',
    techStack: ['React', 'Vite', 'Vercel', 'oxlint', 'JavaScript'],
    architectureNotes:
      'Vite-based build pipeline with high-speed automated linting and zero-configuration Vercel deployment.',
    githubUrl: 'https://github.com/shaikrohit/bhumi-darpan',
    featured: false,
    visibleTo: ['developer', 'recruiter'],
    metrics: {
      stars: 3,
      forks: 0,
      commits: 18,
    },
  },
  {
    id: 'not-a-portfolio',
    title: 'Not A Portfolio',
    description: 'Interactive conversation-driven digital identity experience',
    longDescription: `The dynamic application you are exploring right now. Features persona-driven journeys, interactive 3D particle canvas visuals, dark/light themes, and real-time Supabase trivia competitions.`,
    problemSolved:
      'Replaces stale resume lists with an adaptive, conversational presentation that respects visitor context.',
    techStack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Framer Motion',
    ],
    architectureNotes:
      'App Router architecture with server actions, client Zustand stores, and hardware-accelerated Canvas physics.',
    githubUrl: 'https://github.com/shaikrohit/not-a-portfolio',
    liveUrl: 'https://shaikrohit.tech',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'student', 'explorer'],
    metrics: {
      stars: 15,
      forks: 4,
      commits: 85,
    },
  },
];

/**
 * VERIFIED PROFESSIONAL EXPERIENCE
 */
export const experience: Experience[] = [
  {
    id: 'exp-sithafal',
    role: 'AI Developer / Intern',
    company: 'Sithafal Technologies, Tirupati',
    period: '2024 - Present',
    description: `Developing cutting-edge generative AI applications, intelligent assistants, and modern full-stack web solutions. Bridging technical AI capabilities with responsive, accessible user interfaces.`,
    achievements: [
      'Engineered enterprise conversational AI assistant workflows with reliable context management',
      'Developed responsive React frontends with high-performance animations and sub-second interactions',
      'Implemented robust client-side validation and security-first API communications',
    ],
    techUsed: ['React', 'TypeScript', 'GenAI', 'LLMs', 'Node.js', 'Tailwind CSS'],
  },
  {
    id: 'exp-polytechnic',
    role: 'Computer Engineering Student',
    company: 'Dr. Y.C. James Yen Govt Polytechnic',
    period: '2023 - 2026',
    description: `Pursuing Diploma in Computer Engineering with academic distinction. Focusing on data structures, operating systems, network security, and practical full-stack software development.`,
    achievements: [
      '1st Prize in Regional Technical Innovation Hackathon',
      'Maintained a stellar 96% aggregate score across all academic semesters',
      'Led student technical workshops on web development and open source practices',
    ],
    techUsed: ['C', 'Java', 'Python', 'Web Technologies', 'Linux', 'Computer Networks'],
  },
];

/**
 * LEARNING MILESTONES
 */
export const learningMilestones: LearningMilestone[] = [
  {
    year: 2023,
    title: 'Computer Engineering & Foundations',
    description:
      'Enrolled at Dr. Y.C. James Yen Govt Polytechnic. Mastered C programming, data structures, and computer fundamentals.',
    lesson:
      'Strong fundamentals are the true superpower. Mastering how memory and logic work makes any new framework trivial to learn.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2024,
    title: 'Modern Web & AI Developer Intern',
    description:
      'Deepened mastery in JavaScript, React, and Python. Joined Sithafal Technologies, Tirupati as AI Developer intern.',
    lesson:
      'Real-world production feedback accelerates learning tenfold compared to passive video tutorials.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2025,
    title: 'Docker, GenAI Innovation & Hackathon Win',
    description:
      'Containerized CarbonSphere with Docker + Nginx. Won 1st Prize in Regional Technical Innovation with AI stadium solutions.',
    lesson:
      'Packaging and deploying software cleanly with Docker is just as vital as writing good feature code.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2026,
    title: 'Next.js 16 & Interactive Portfolio Launch',
    description:
      'Engineered not-a-portfolio with React 19, persona routing, and 3D Canvas visualizers while graduating with 96% distinction.',
    lesson:
      'Great software is a dialogue with the user. Polish, accessibility, and thoughtful details differentiate the top 1%.',
    visibleTo: ['student', 'explorer'],
  },
];

/**
 * Q&A CONTENT
 */
export const qaContent = [
  {
    question: 'How did you balance a 96% academic record with building production apps?',
    answer: `By applying classroom computer engineering concepts directly into project work. Operating systems and networks translate directly to Docker and WebSockets. Building real tools solidifies theoretical knowledge.`,
  },
  {
    question: 'What is your advice for developers starting with Docker?',
    answer: `Start with a single project like a Vite or React app. Learn to build a multi-stage Dockerfile that builds assets in Node and serves them through lightweight Alpine Nginx. The clarity of containerization will click immediately.`,
  },
  {
    question: 'What is your primary tech stack preference?',
    answer: `React or Next.js with TypeScript and Tailwind CSS for the frontend, combined with Docker, Node.js or Python Flask for backend services, and PostgreSQL/Supabase for persistent storage.`,
  },
  {
    question: 'What excites you most about software engineering?',
    answer: `The ability to turn an idea into an interactive tool accessible to anyone worldwide in seconds, with verified security and delightful micro-interactions.`,
  },
];

/**
 * Helper function to get content based on visitor type
 */
export function getContentForVisitorType(type: VisitorType) {
  return {
    introduction: profile.introduction[type],
    projects: projects.filter((p) => p.visibleTo.includes(type)),
    milestones: learningMilestones.filter((m) => m.visibleTo.includes(type)),
    showPhilosophy: type === 'developer',
    showSkillsWithOutcomes: type === 'recruiter',
    showJourney: type === 'student' || type === 'explorer',
    showQA: type === 'student' || type === 'explorer',
  };
}
