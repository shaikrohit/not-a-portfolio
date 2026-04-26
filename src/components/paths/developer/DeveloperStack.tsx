'use client';

/**
 * ============================================================================
 * DEVELOPER PATH - TECH STACK STEP
 * ============================================================================
 * 
 * Interactive technology stack showcase with skill levels,
 * experience timelines, and categorized organization.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Technology {
  name: string;
  icon: string;
  level: 'expert' | 'advanced' | 'intermediate';
  years: number;
  description: string;
  highlights: string[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  technologies: Technology[];
}

// ============================================================================
// DATA
// ============================================================================

const categories: Category[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    color: '#3B82F6',
    technologies: [
      {
        name: 'React',
        icon: '⚛️',
        level: 'expert',
        years: 4,
        description: 'My primary UI library. Deeply familiar with hooks, context, suspense, and server components.',
        highlights: ['Server Components', 'Custom Hooks', 'Performance Optimization', 'Testing'],
      },
      {
        name: 'TypeScript',
        icon: '📘',
        level: 'expert',
        years: 3,
        description: 'Type-first development. I leverage advanced types for better DX and fewer runtime errors.',
        highlights: ['Generics', 'Discriminated Unions', 'Type Guards', 'Module Augmentation'],
      },
      {
        name: 'Next.js',
        icon: '▲',
        level: 'advanced',
        years: 3,
        description: 'Full-stack React framework. App Router, Server Actions, ISR, and edge functions.',
        highlights: ['App Router', 'Server Actions', 'Middleware', 'Edge Runtime'],
      },
      {
        name: 'Tailwind CSS',
        icon: '🎨',
        level: 'advanced',
        years: 2,
        description: 'Utility-first CSS for rapid prototyping and consistent design systems.',
        highlights: ['Custom Design Systems', 'JIT Mode', 'Plugin Development'],
      },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    color: '#22C55E',
    technologies: [
      {
        name: 'Node.js',
        icon: '🟢',
        level: 'advanced',
        years: 4,
        description: 'Server-side JavaScript runtime. APIs, CLIs, and real-time applications.',
        highlights: ['REST APIs', 'WebSockets', 'Streaming', 'Worker Threads'],
      },
      {
        name: 'Python',
        icon: '🐍',
        level: 'intermediate',
        years: 2,
        description: 'Data processing, automation scripts, and machine learning experiments.',
        highlights: ['FastAPI', 'Data Processing', 'Automation', 'ML Basics'],
      },
      {
        name: 'PostgreSQL',
        icon: '🐘',
        level: 'advanced',
        years: 3,
        description: 'Relational database of choice. Complex queries, indexing, and performance tuning.',
        highlights: ['Query Optimization', 'Indexing', 'JSON Operations', 'Migrations'],
      },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Tools',
    color: '#F59E0B',
    technologies: [
      {
        name: 'Docker',
        icon: '🐳',
        level: 'advanced',
        years: 3,
        description: 'Containerization for consistent development and deployment environments.',
        highlights: ['Multi-stage Builds', 'Compose', 'Optimization', 'Networking'],
      },
      {
        name: 'Git',
        icon: '📦',
        level: 'expert',
        years: 5,
        description: 'Version control mastery. Complex rebasing, hooks, and workflow optimization.',
        highlights: ['Rebasing', 'Hooks', 'Bisect', 'Worktrees'],
      },
      {
        name: 'CI/CD',
        icon: '🔄',
        level: 'intermediate',
        years: 2,
        description: 'Automated testing and deployment pipelines with GitHub Actions and similar tools.',
        highlights: ['GitHub Actions', 'Automated Testing', 'Deployment'],
      },
    ],
  },
];

const levelConfig = {
  expert: { label: 'Expert', color: 'text-blue-400', bg: 'bg-blue-500/20', width: '100%' },
  advanced: { label: 'Advanced', color: 'text-green-400', bg: 'bg-green-500/20', width: '75%' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/20', width: '50%' },
};

// ============================================================================
// CATEGORY TAB
// ============================================================================

interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}

const CategoryTab = memo(function CategoryTab({ category, isActive, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-300
        ${isActive
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:text-white/60 hover:bg-white/5'
        }
      `}
    >
      {category.name}
      <span className={`ml-2 text-xs ${isActive ? 'text-blue-400' : 'text-white/20'}`}>
        {category.technologies.length}
      </span>
    </button>
  );
});

// ============================================================================
// TECHNOLOGY CARD
// ============================================================================

interface TechCardProps {
  tech: Technology;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const TechCard = memo(function TechCard({ tech, index, isSelected, onClick }: TechCardProps) {
  const config = levelConfig[tech.level];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className={`
        text-left p-5 rounded-xl
        transition-all duration-300 border
        ${isSelected
          ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20'
          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tech.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{tech.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-white/30" />
              <span className="text-xs text-white/30">{tech.years} years</span>
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Skill Bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
        />
      </div>

      <p className="text-sm text-white/40 line-clamp-2">{tech.description}</p>
    </motion.button>
  );
});

// ============================================================================
// TECHNOLOGY DETAIL
// ============================================================================

interface TechDetailProps {
  tech: Technology;
}

const TechDetail = memo(function TechDetail({ tech }: TechDetailProps) {
  const config = levelConfig[tech.level];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center text-3xl">
          {tech.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{tech.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-sm ${config.color}`}>{config.label}</span>
            <span className="text-white/20">•</span>
            <span className="text-sm text-white/40">{tech.years} years experience</span>
          </div>
        </div>
      </div>

      {/* Full Skill Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-white/30 mb-2">
          <span>Proficiency</span>
          <span>{config.label}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: config.width }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 mb-6 leading-relaxed">{tech.description}</p>

      {/* Highlights */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white/80 mb-3">Key Expertise</h4>
        <div className="flex flex-wrap gap-2">
          {tech.highlights.map((highlight, i) => (
            <motion.span
              key={highlight}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white/60"
            >
              {highlight}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{tech.years}</div>
          <div className="text-xs text-white/30">Years</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{tech.highlights.length}</div>
          <div className="text-xs text-white/30">Specialties</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  (tech.level === 'expert' && star <= 3) ||
                  (tech.level === 'advanced' && star <= 2) ||
                  (tech.level === 'intermediate' && star <= 1)
                    ? 'text-blue-400 fill-blue-400'
                    : 'text-white/10'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-white/30 mt-1">Level</div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface DeveloperStackProps {
  onComplete: () => void;
}

export function DeveloperStack({ onComplete }: DeveloperStackProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 'frontend');
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  // Select first tech of category on category change
  React.useEffect(() => {
    if (currentCategory && currentCategory.technologies.length > 0) {
      setSelectedTech(currentCategory.technologies[0] ?? null);
    }
  }, [activeCategory, currentCategory]);

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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Technology Stack
            </h1>
            <p className="text-white/50 max-w-2xl">
              The tools and technologies I work with daily. Each selected for
              reliability, performance, and developer experience.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Tech Grid */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {currentCategory?.technologies.map((tech, index) => (
                    <TechCard
                      key={tech.name}
                      tech={tech}
                      index={index}
                      isSelected={selectedTech?.name === tech.name}
                      onClick={() => setSelectedTech(tech)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {selectedTech ? (
                    <TechDetail key={selectedTech.name} tech={selectedTech} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/20">
                      Select a technology
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-white/30">
            Explore the stack to understand my technical capabilities.
          </p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperStack;
