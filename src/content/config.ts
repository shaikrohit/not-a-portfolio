/**
 * CONTENT CONFIGURATION
 * 
 * This file contains all the content that adapts based on visitor type.
 * The content is structured for easy updates without touching components.
 * 
 * Philosophy: Content should be honest, thoughtful, and non-promotional.
 */

import type { VisitorType, Project, Skill, Experience, LearningMilestone } from '@/types';

/**
 * DEVELOPER PROFILE
 * The person behind the code
 */
export const profile = {
  name: 'Shaik Rohit',
  title: 'Full Stack Developer & Cybersecurity Enthusiast',
  tagline: 'Building secure digital experiences with precision.',
  location: 'Kuppam, India',
  
  // Different introductions for different visitors
  introduction: {
    developer: `I'm a computer engineering student and developer who believes security isn't an afterthought—it's the foundation. 
    I specialize in building full-stack applications with a focus on penetration testing and network security.
    
    This site isn't just a portfolio; it's a window into how I secure and build the web.`,
    
    recruiter: `I'm a high-achieving Computer Engineering student (96% aggregate) and AI Developer at Sithafal Technologies. 
    I've won regional innovation awards and delivered projects ranging from AI assistants to secure network tools.
    
    I'm seeking opportunities where I can apply my skills in cybersecurity and web development to build resilient systems.`,
    
    student: `I'm currently a student at Dr. Y.C. James Yen Govt Polytechnic. I know how overwhelming it feels to start in tech, 
    especially in fields like Cybersecurity. I've maintained a 96% score while building real-world projects.
    
    I'm here to show you that with discipline and curiosity, you can master both the creative and technical sides of dev.`,
    
    explorer: `Welcome! I'm Shaik Rohit. I build things, break them (to make them better), and learn every day.
    
    Feel free to explore my work in AI, Web Dev, and Cybersecurity. This experience adapts to you.`,
  },
  
  email: 'shaik.rohit.official@gmail.com',
  github: 'https://github.com/shaikrohit',
  linkedin: 'https://www.linkedin.com/in/rohitshaik',
  resumeUrl: '/resume.pdf',
};

/**
 * ENGINEERING PHILOSOPHY
 * For developers: the thinking behind the code
 */
export const philosophy = {
  title: 'Engineering Philosophy',
  subtitle: 'Principles that guide how I build software',
  
  principles: [
    {
      id: 'clarity',
      title: 'Clarity over cleverness',
      description: `Clever code feels satisfying to write, but it becomes a burden to maintain. 
      I optimize for the developer who will read this code six months from now—often that's me.`,
      example: `Instead of one-liner array manipulations, I break logic into named steps. 
      It's more lines, but infinitely more readable.`,
    },
    {
      id: 'constraints',
      title: 'Constraints breed creativity',
      description: `Infinite options lead to decision paralysis. I intentionally limit my choices—
      fewer frameworks, smaller scope, simpler solutions. This forces creative problem-solving.`,
      example: `For this site, I limited myself to one accent color, one font family, and no gradients. 
      These constraints made design decisions easier and results more cohesive.`,
    },
    {
      id: 'shipping',
      title: 'Ship, then iterate',
      description: `Perfect is the enemy of done. I aim for "good enough to learn from" rather than 
      "flawless but theoretical." Real feedback from real users beats imagined requirements.`,
      example: `My first version of any feature is embarrassingly simple. But it's in production, 
      being used, generating data that informs the next iteration.`,
    },
    {
      id: 'boring',
      title: 'Boring technology, interesting problems',
      description: `I save my innovation budget for business logic, not infrastructure. 
      Proven tools mean fewer surprises at 2 AM.`,
      example: `PostgreSQL over the hot new database. React over the framework of the month. 
      Reliability compounds; novelty depreciates.`,
    },
  ],
};

/**
 * TECH STACK
 * Not just logos—reasoning for each choice
 */
export const techStack: Skill[] = [
  {
    name: 'TypeScript',
    category: 'language',
    proficiency: 'expert',
    yearsUsed: 5,
    reasoning: `Types catch errors before runtime and serve as documentation. 
    The productivity gain from autocomplete and refactoring support is worth the initial investment.`,
    businessOutcome: 'Reduced production bugs by 40% and accelerated onboarding for new team members.',
  },
  {
    name: 'React',
    category: 'framework',
    proficiency: 'expert',
    yearsUsed: 6,
    reasoning: `Component-based architecture aligns with how I think about UIs. 
    The ecosystem maturity means solved problems stay solved.`,
    businessOutcome: 'Built and maintained component libraries serving 50+ internal apps.',
  },
  {
    name: 'Next.js',
    category: 'framework',
    proficiency: 'expert',
    yearsUsed: 4,
    reasoning: `Server-side rendering, API routes, and file-based routing in one package. 
    It handles the infrastructure decisions I don't want to make.`,
    businessOutcome: 'Improved Lighthouse scores from 60 to 95+ across client projects.',
  },
  {
    name: 'Node.js',
    category: 'framework',
    proficiency: 'proficient',
    yearsUsed: 6,
    reasoning: `One language for frontend and backend reduces context switching. 
    The async model handles concurrent requests efficiently.`,
    businessOutcome: 'Built APIs handling 10K+ requests/second with minimal infrastructure.',
  },
  {
    name: 'PostgreSQL',
    category: 'tool',
    proficiency: 'proficient',
    yearsUsed: 5,
    reasoning: `Reliable, well-documented, handles almost any workload. 
    The boring choice that never lets me down.`,
    businessOutcome: 'Designed schemas supporting multi-tenant SaaS platforms with 100K+ users.',
  },
  {
    name: 'Tailwind CSS',
    category: 'tool',
    proficiency: 'expert',
    yearsUsed: 3,
    reasoning: `Utility classes in HTML keep styles close to markup. 
    The design system constraints lead to more consistent UIs.`,
    businessOutcome: 'Reduced CSS bundle sizes by 60% and design inconsistencies by 80%.',
  },
  {
    name: 'System Design',
    category: 'concept',
    proficiency: 'proficient',
    yearsUsed: 4,
    reasoning: `Understanding distributed systems helps me make better local decisions. 
    I think about failure modes, scalability, and data consistency.`,
    businessOutcome: 'Architected systems handling Black Friday traffic without incident.',
  },
];

/**
 * PROJECTS
 * Deep showcases, not a long list
 */
export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Project Name',
    description: 'A brief, compelling one-liner about what this does.',
    longDescription: `This project started as a weekend experiment and evolved into a production system 
    serving real users. I built it to solve a problem I personally faced.
    
    The interesting technical challenge was handling real-time updates at scale 
    without overwhelming the database. I solved this with a hybrid approach...`,
    problemSolved: `Manual data entry was eating 10 hours/week. 
    This tool reduced it to 30 minutes through intelligent automation.`,
    techStack: ['TypeScript', 'Next.js', 'PostgreSQL', 'WebSockets'],
    architectureNotes: `Event-sourced architecture for audit trails. 
    CQRS pattern separates read/write concerns. 
    Redis for caching hot data.`,
    githubUrl: 'https://github.com/yourusername/project',
    liveUrl: 'https://project.com',
    featured: true,
    visibleTo: ['developer', 'recruiter'],
    metrics: {
      stars: 120,
      forks: 25,
      commits: 340,
    },
  },
  {
    id: 'project-2',
    title: 'Another Project',
    description: 'Brief description of this project.',
    longDescription: `Detailed explanation of the project, the problem it solves, 
    and the technical decisions made along the way.`,
    problemSolved: 'What pain point this addresses.',
    techStack: ['React', 'Node.js', 'MongoDB'],
    architectureNotes: 'Key architectural decisions and their reasoning.',
    githubUrl: 'https://github.com/yourusername/project2',
    featured: true,
    visibleTo: ['developer', 'recruiter', 'student'],
  },
];

/**
 * EXPERIENCE
 * For recruiters: professional history
 */
export const experience: Experience[] = [
  {
    id: 'exp-1',
    role: 'Senior Software Engineer',
    company: 'Company Name',
    period: '2022 - Present',
    description: `Led development of core platform features. 
    Mentored junior engineers and established team coding standards.`,
    achievements: [
      'Reduced page load times by 60% through strategic caching and code splitting',
      'Built real-time collaboration features serving 10K+ concurrent users',
      'Established CI/CD practices that reduced deployment time from hours to minutes',
    ],
    techUsed: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'exp-2',
    role: 'Software Engineer',
    company: 'Previous Company',
    period: '2019 - 2022',
    description: `Full-stack development on customer-facing products. 
    Collaborated with design and product teams to ship features.`,
    achievements: [
      'Shipped user authentication system handling 1M+ monthly active users',
      'Migrated legacy codebase to TypeScript, reducing bugs by 40%',
      'Built internal tools that saved 20 hours/week of manual work',
    ],
    techUsed: ['JavaScript', 'React', 'Python', 'MySQL', 'GCP'],
  },
];

/**
 * LEARNING JOURNEY
 * For students: honest growth story
 */
export const learningMilestones: LearningMilestone[] = [
  {
    year: 2016,
    title: 'First Line of Code',
    description: 'Started with Python tutorials. Built a calculator that barely worked.',
    lesson: `Motivation beats talent in the beginning. I wasn't naturally gifted—I was just stubborn enough to keep going.`,
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2017,
    title: 'First "Real" Project',
    description: 'Built a todo app. Yes, another todo app. But it was MY todo app.',
    lesson: `Tutorial hell is real. The only escape is building something yourself, even if it's imperfect.`,
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2018,
    title: 'First Job in Tech',
    description: 'Landed a junior role. Felt completely out of my depth.',
    lesson: `Imposter syndrome never fully goes away, but you learn to act despite it. Everyone else is figuring it out too.`,
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2019,
    title: 'First Major Mistake',
    description: 'Deployed buggy code to production. Broke things for 1000+ users.',
    lesson: `Mistakes are inevitable. What matters is how quickly you recover and what systems you build to prevent recurrence.`,
    visibleTo: ['student', 'explorer'],
  },
  {
    year: 2021,
    title: 'Led a Team',
    description: 'Became tech lead. Realized writing code was the easy part.',
    lesson: `Technical skills plateau. Communication, empathy, and system thinking become the differentiators.`,
    visibleTo: ['student', 'explorer'],
  },
];

/**
 * Q&A CONTENT
 * For explorers and students
 */
export const qaContent = [
  {
    question: 'What would you tell your younger self?',
    answer: `Start building sooner. Reading tutorials feels productive, but real learning happens when you're stuck on a problem you actually care about solving.`,
  },
  {
    question: 'How do you stay current with technology?',
    answer: `I don't chase every new framework. I follow a few thoughtful engineers, read production post-mortems, and only deep-dive when a technology solves a real problem I'm facing.`,
  },
  {
    question: `What's your biggest weakness?`,
    answer: `I can over-engineer solutions. I've learned to timebox exploration and ask "what's the simplest thing that could work?" more often.`,
  },
  {
    question: 'Remote or in-office?',
    answer: `I've done both. Remote for deep focus work, in-office for collaboration phases. Hybrid with intention.`,
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
