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
  title: 'Undergraduate Student & Security Explorer | CSE (Cyber Security)',
  tagline:
    'CSE (Cyber Security) Student @ MITS • Software Developer • Exploring Cybersecurity & Secure Systems',
  location: 'Palamaner, Andhra Pradesh, India',

  // Adaptive introductions based on visitor persona
  introduction: {
    developer: `I am a second-year B.Tech undergraduate studying Computer Science & Engineering (Cyber Security) at Madanapalle Institute of Technology & Science, actively exploring both modern software engineering and cybersecurity domains.
    I completed a Junior Software Engineer internship at Sithafal Technologies, engineered the Bhumi Darpan land acquisition platform, and actively participate in CTF challenges and OWASP open-source activities.
    
    My engineering focus spans full-stack React and Python systems, secure software architecture, network defense, and low-level binary analysis.`,

    recruiter: `I am an undergraduate student pursuing B.Tech in CSE (Cyber Security) at Madanapalle Institute of Technology & Science with a completed Diploma in Computer Engineering (88.5% distinction from Dr. Y.C. James Yen Govt Polytechnic).
    I previously interned as a Junior Software Engineer at Sithafal Technologies Pvt. Ltd., developed the Bhumi Darpan digital land management platform, and hold certifications in Python (APSSDC), Generative AI (IBM), and Cybersecurity (Cisco).
    
    I am actively exploring hands-on opportunities across software engineering, security analysis, and network defense.`,

    student: `I am an undergraduate student pursuing B.Tech in CSE (Cyber Security) at Madanapalle Institute of Technology & Science (2026–2029) after completing my Diploma in Computer Engineering with 88.5% distinction.
    
    Beyond academics, I am exploring cybersecurity through CTF competitions (cryptography, forensics, web security, binary exploitation), contributing to OWASP open-source initiatives, and building production web prototypes.`,

    explorer: `Welcome! I'm Shaik Rohit — an undergraduate student exploring the intersection of software engineering, network defense, and cybersecurity at Madanapalle Institute of Technology & Science.
    
    Explore my verified projects (including Bhumi Darpan), security tools, and technical milestones.`,
  },

  email: 'shaik.rohit.official@gmail.com',
  github: 'https://github.com/shaikrohit',
  linkedin: 'https://www.linkedin.com/in/rohitshaik',
  credly: 'https://www.credly.com/users/shaikrohit',
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
    name: 'Python',
    category: 'language',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Core language for security scripting, network packet manipulation, backend services, and algorithmic problem-solving.`,
    businessOutcome:
      'Engineered automated security testing scripts and low-emission routing algorithms.',
  },
  {
    name: 'React & Next.js',
    category: 'framework',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Component-driven architecture with React 19 concurrent features and Next.js hybrid rendering for fluid, accessible UIs.`,
    businessOutcome:
      'Developed Bhumi Darpan land acquisition platform and modern responsive frontends.',
  },
  {
    name: 'Network Security & Ethical Hacking',
    category: 'concept',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Network vulnerability assessment, penetration testing, protocol inspection, cryptography, and defensive auditing.`,
    businessOutcome:
      'Applied in CTF competitions across network analysis, web exploitation, and OWASP open-source security.',
  },
  {
    name: 'Java',
    category: 'language',
    proficiency: 'proficient',
    yearsUsed: 2,
    reasoning: `Object-oriented programming, strict typing, file I/O handling, and robust exception-handled systems.`,
    businessOutcome:
      'Built foundational software projects and concurrent object-oriented architectures.',
  },
  {
    name: 'Bash & Kali Linux',
    category: 'tool',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Security-focused operating system and Unix shell scripting for system administration, pipeline automation, and exploitation.`,
    businessOutcome: 'Automated reconnaissance, payload execution, and command-line forensics.',
  },
  {
    name: 'Security Tooling (TShark, Scapy, Pwntools, GDB)',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Packet dissection with TShark/Scapy, binary debugging with GDB, readelf/objdump inspection, and CTF exploit development with Pwntools.`,
    businessOutcome:
      'Solves binary exploitation, reverse engineering, and traffic analysis challenges.',
  },
  {
    name: 'JavaScript / TypeScript',
    category: 'language',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Strict static typing eliminates runtime bugs and guarantees self-documenting codebases for confident refactoring.`,
    businessOutcome:
      'Maintained type safety and clean architecture across web platforms and enterprise CMS.',
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
    name: 'Tailwind CSS',
    category: 'tool',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Token-based utility framework facilitating consistent design systems, dark/light themes, and minimal CSS bundle sizes.`,
    businessOutcome:
      'Created polished glassmorphism and bento grid systems while keeping stylesheet overhead under 15KB.',
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
    name: 'Supabase & PostgreSQL',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 1,
    reasoning: `Reliable relational database with real-time subscriptions, Row-Level Security, and instant REST APIs.`,
    businessOutcome: 'Implemented real-time trivia leaderboard with live ranking synchronizations.',
  },
  {
    name: 'Git & GitHub',
    category: 'tool',
    proficiency: 'expert',
    yearsUsed: 2,
    reasoning: `Command-line proficiency, branch management, automated CI/CD workflows, and open-source collaboration.`,
    businessOutcome:
      'Active open-source contributions to OWASP-related repositories with clean git workflows.',
  },
];

/**
 * REAL PROJECTS (VERIFIED FROM GITHUB)
 */
export const projects: Project[] = [
  {
    id: 'bhumi-darpan',
    title: 'Bhumi Darpan',
    description: 'Digital Land Acquisition & Secure GIS Management Platform',
    longDescription: `A comprehensive enterprise-grade platform engineered to digitize land acquisition, parcel documentation, and compensation disbursement workflows. 
    Features interactive dashboards, GIS parcel boundary mapping, cryptographic document verification pipelines, automated compensation valuation, Rehabilitation & Resettlement (R&R), possession tracking, and spatial analytics workflows.`,
    problemSolved:
      'Eliminates bureaucratic delays and tampering risks by replacing manual land paperwork with tamper-evident document verification and interactive GIS parcel boundary mapping.',
    techStack: [
      'React',
      'JavaScript',
      'GIS Mapping',
      'Document Security',
      'Tailwind CSS',
      'Vite',
      'Vercel',
    ],
    architectureNotes:
      'Modular React frontend with geospatial GIS integration, cryptographic integrity checks for deed documents, and role-based clearance pipelines.',
    githubUrl: 'https://github.com/shaikrohit/bhumi-darpan',
    liveUrl: 'https://github.com/shaikrohit/bhumi-darpan',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'student', 'explorer'],
    metrics: {
      stars: 5,
      forks: 1,
      commits: 24,
    },
  },
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
    role: 'Junior Software Engineer Intern',
    company: 'Sithafal Technologies Pvt. Ltd.',
    period: 'Nov 2025 - May 2026',
    description: `Worked on functionality-focused software applications, contributed to production feature development, and gained hands-on experience in software development practices.`,
    achievements: [
      'Contributed to core feature engineering on production-facing applications in Tirupati',
      'Implemented responsive React frontends and integrated client-server data flows',
      'Awarded Junior Software Engineer Internship Completion Certificate',
    ],
    techUsed: ['React', 'JavaScript', 'Python', 'Node.js', 'REST APIs', 'Git'],
  },
  {
    id: 'exp-mits',
    role: 'B.Tech CSE (Cyber Security) Student',
    company: 'Madanapalle Institute of Technology & Science',
    period: '2026 - 2029 (Pursuing)',
    description: `Second-year undergraduate in Computer Science & Engineering (Cyber Security). Actively engaged in network security research, CTF competitions, and open-source contributions.`,
    achievements: [
      'Active contributor to OWASP open-source security initiatives on GitHub',
      'Participant in CTF challenges spanning network analysis, forensics, crypto, and binary exploitation',
      'Completed industry certifications in Cybersecurity (Cisco) and Python Programming (APSSDC)',
    ],
    techUsed: ['Python', 'Java', 'Bash', 'Kali Linux', 'TShark', 'Scapy', 'Pwntools', 'GDB'],
  },
  {
    id: 'exp-polytechnic',
    role: 'Computer Engineering Diploma Graduate',
    company: 'Dr. Y.C. James Yen Govt Polytechnic, Kuppam',
    period: '2023 - 2026',
    description: `Completed 3-year Diploma in Computer Engineering (DCME) with 88.5% academic distinction. Built foundations in operating systems, networks, and software engineering.`,
    achievements: [
      'Graduated with 88.5% aggregate distinction in State Technical Board Examinations',
      '1st Prize in Regional Technical Innovation Hackathon',
      'Conducted student workshops on web development and Linux command line',
    ],
    techUsed: ['C', 'Java', 'Python', 'Web Technologies', 'Linux', 'Networks'],
  },
];

/**
 * LEARNING MILESTONES
 */
export const learningMilestones: LearningMilestone[] = [
  {
    year: 2023,
    title: 'Computer Engineering Diploma (DCME)',
    description:
      'Enrolled at Dr. Y.C. James Yen Govt Polytechnic, Kuppam. Mastered C programming, data structures, and computer fundamentals.',
    lesson:
      'Strong fundamentals are the true superpower. Mastering how memory, networks, and logic work makes any new framework intuitive to learn.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2024,
    title: 'Python Essentials & Security Foundations',
    description:
      'Completed edX Python Essentials. Deepened practical knowledge in networking, Linux shell scripting, and ethical defense.',
    lesson:
      'Building foundational scripts and mastering command-line forensics beats passive theory every single time.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2025,
    title: 'Cisco Cybersecurity & Sithafal Internship',
    description:
      'Earned Cisco Introduction to Cybersecurity certification. Joined Sithafal Technologies Pvt. Ltd. as Junior Software Engineer Intern in Tirupati.',
    lesson:
      'Real-world production feedback on functionality-focused software accelerates professional growth tenfold.',
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2026,
    title: 'B.Tech CSE (Cyber Security) & Bhumi Darpan Platform',
    description:
      'Graduated DCME with 88.5% distinction. Joined Madanapalle Institute of Technology & Science for B.Tech CSE (Cyber Security). Built Bhumi Darpan land acquisition platform.',
    lesson:
      'Security and user experience must be designed together. Great software is dependable, accessible, and robust under adversarial scrutiny.',
    visibleTo: ['student', 'explorer'],
  },
];

/**
 * Q&A CONTENT
 */
export const qaContent = [
  {
    question: 'How did you balance academic excellence with building production software?',
    answer: `By applying theoretical computer science concepts directly into practical software engineering and CTF security challenges. Operating systems, network protocols, and algorithms translate directly into secure code and efficient system design.`,
  },
  {
    question: 'What is your primary focus in Cybersecurity?',
    answer: `Network security, ethical hacking, penetration testing, and secure application architecture. I actively participate in CTF challenges (forensics, crypto, web security, binary exploitation) and contribute to OWASP open-source initiatives.`,
  },
  {
    question: 'What is your primary tech stack preference?',
    answer: `React, TypeScript, and Tailwind CSS for the frontend, combined with Python, Java, Bash, and Linux tools (Kali, TShark, Scapy, Pwntools, GDB) for backend engineering and security workflows.`,
  },
  {
    question: 'What excites you most about software engineering and security?',
    answer: `The interplay between defensive engineering and offensive discovery—building resilient platforms like Bhumi Darpan while rigorously securing systems against real-world vulnerabilities.`,
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
