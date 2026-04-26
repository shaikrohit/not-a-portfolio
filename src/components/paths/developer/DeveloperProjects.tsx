'use client';

/**
 * ============================================================================
 * DEVELOPER PATH - PROJECTS STEP
 * ============================================================================
 * 
 * Featured projects showcase with detailed case studies,
 * technical breakdowns, and interactive previews.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Code2, 
  Layers,
  Zap,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  gradient: string;
  tech: string[];
  features: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  links: {
    demo?: string;
    github?: string;
  };
  caseStudy: {
    challenge: string;
    solution: string;
    outcome: string;
  };
}

// ============================================================================
// DATA
// ============================================================================

const projects: Project[] = [
  {
    id: 'conversational-portfolio',
    title: 'Conversational Portfolio',
    tagline: 'This very website',
    description: 'A paradigm shift from traditional portfolios. Instead of static pages, visitors choose their own path through an adaptive conversation-like experience.',
    image: '/projects/portfolio.png',
    gradient: 'from-blue-600 to-blue-400',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Framer Motion', 'Zustand'],
    features: [
      'Four distinct visitor paths',
      'Forward-only navigation',
      'Real-time state management',
      'Premium animations',
      'Type-safe throughout',
    ],
    metrics: [
      { label: 'Lighthouse Score', value: '100' },
      { label: 'First Paint', value: '<1s' },
      { label: 'Bundle Size', value: '<100KB' },
    ],
    links: {
      github: 'https://github.com/username/portfolio',
    },
    caseStudy: {
      challenge: 'Traditional portfolios feel impersonal and overwhelming. Visitors scan briefly and leave without understanding the person behind the work.',
      solution: 'Created an adaptive experience where visitors self-identify their intent upfront. Each path delivers curated content relevant to their needs.',
      outcome: 'Deeper engagement, more meaningful connections, and conversations that start with context already established.',
    },
  },
  {
    id: 'dev-toolkit',
    title: 'Developer Toolkit',
    tagline: 'CLI tools for modern workflows',
    description: 'A collection of CLI tools that automate repetitive development tasks. From scaffolding to deployment, all in one unified interface.',
    image: '/projects/toolkit.png',
    gradient: 'from-green-500 to-emerald-400',
    tech: ['Node.js', 'TypeScript', 'Commander.js', 'Chalk', 'Docker'],
    features: [
      'Project scaffolding',
      'Code generation',
      'Database migrations',
      'Deployment automation',
      'Plugin system',
    ],
    metrics: [
      { label: 'Commands', value: '25+' },
      { label: 'Weekly Saves', value: '10+ hrs' },
      { label: 'Active Users', value: '500+' },
    ],
    links: {
      demo: 'https://toolkit-docs.example.com',
      github: 'https://github.com/username/dev-toolkit',
    },
    caseStudy: {
      challenge: 'Switching between different tools for common tasks breaks flow and wastes time. Each project requires different setup procedures.',
      solution: 'Built a unified CLI that wraps and orchestrates common tools. Plugins extend functionality without bloating the core.',
      outcome: 'Consistent workflow across projects. New team members onboard faster with standardized commands.',
    },
  },
  {
    id: 'realtime-dashboard',
    title: 'Real-time Dashboard',
    tagline: 'Live data visualization platform',
    description: 'A dashboard framework for monitoring real-time data streams. WebSocket-powered updates with sub-100ms latency.',
    image: '/projects/dashboard.png',
    gradient: 'from-purple-500 to-violet-400',
    tech: ['React', 'D3.js', 'WebSockets', 'Redis', 'PostgreSQL'],
    features: [
      'Real-time updates',
      'Custom widgets',
      'Historical analysis',
      'Alert system',
      'Export capabilities',
    ],
    metrics: [
      { label: 'Update Latency', value: '<100ms' },
      { label: 'Widgets', value: '15+' },
      { label: 'Data Points/sec', value: '10K+' },
    ],
    links: {
      demo: 'https://dashboard-demo.example.com',
    },
    caseStudy: {
      challenge: 'Existing dashboards either lacked real-time capabilities or required heavy infrastructure. Teams needed insights immediately, not after batch processing.',
      solution: 'Designed a WebSocket-first architecture with smart batching to balance update frequency and performance.',
      outcome: 'Reduced incident response time by 60% through immediate visibility into system health.',
    },
  },
];

// ============================================================================
// PROJECT CARD
// ============================================================================

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const ProjectCard = memo(function ProjectCard({ project, isActive, onClick, index }: ProjectCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl
        transition-all duration-500 text-left w-full
        ${isActive ? 'ring-2 ring-blue-500/50' : ''}
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:border-white/10 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
            <p className="text-sm text-white/40">{project.tagline}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.gradient} opacity-80 flex items-center justify-center`}>
            <Code2 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 text-white/50 rounded">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-white/5 text-white/30 rounded">
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="text-center p-2 bg-white/[0.02] rounded-lg">
              <div className="text-sm font-semibold text-white">{metric.value}</div>
              <div className="text-[10px] text-white/30">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="project-indicator"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-t-full"
          />
        )}
      </div>
    </motion.button>
  );
});

// ============================================================================
// PROJECT DETAIL
// ============================================================================

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = memo(function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'casestudy'>('overview');

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} text-white text-sm mb-3`}>
          <Layers className="w-3.5 h-3.5" />
          <span>Featured Project</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
        <p className="text-white/50">{project.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('casestudy')}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'casestudy' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Case Study
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Tech Stack */}
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 text-sm bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-white/60"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="casestudy"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">The Challenge</h4>
                <p className="text-white/50 text-sm leading-relaxed">{project.caseStudy.challenge}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">The Solution</h4>
                <p className="text-white/50 text-sm leading-relaxed">{project.caseStudy.solution}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-2">The Outcome</h4>
                <p className="text-white/50 text-sm leading-relaxed">{project.caseStudy.outcome}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Links */}
      <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        )}
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-sm rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
            Source Code
          </a>
        )}
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface DeveloperProjectsProps {
  onComplete: () => void;
}

export function DeveloperProjects({ onComplete }: DeveloperProjectsProps) {
  const [activeProject, setActiveProject] = useState(projects[0]!);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToProject = (index: number) => {
    setCurrentIndex(index);
    const project = projects[index];
    if (project) setActiveProject(project);
  };

  const nextProject = () => {
    const next = (currentIndex + 1) % projects.length;
    goToProject(next);
  };

  const prevProject = () => {
    const prev = (currentIndex - 1 + projects.length) % projects.length;
    goToProject(prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Featured Projects
                </h1>
                <p className="text-white/50 max-w-2xl">
                  A selection of projects that demonstrate my approach to
                  solving problems and building products.
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={prevProject}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-white/30 min-w-[3rem] text-center">
                  {currentIndex + 1}/{projects.length}
                </span>
                <button
                  onClick={nextProject}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Project Cards */}
            <div className="lg:col-span-2 space-y-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={activeProject.id === project.id}
                  onClick={() => goToProject(index)}
                  index={index}
                />
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[600px]">
                <AnimatePresence mode="wait">
                  <ProjectDetail key={activeProject.id} project={activeProject} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToProject(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/30">
              {currentIndex + 1} of {projects.length} projects
            </span>
          </div>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>Let's Connect</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperProjects;
