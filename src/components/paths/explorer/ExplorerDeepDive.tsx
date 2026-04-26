'use client';

/**
 * ============================================================================
 * EXPLORER PATH - DEEP DIVE STEP
 * ============================================================================
 * 
 * Detailed exploration with tabbed sections for
 * different content areas.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Code,
  Briefcase,
  Heart,
  BookOpen,
  Star
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface Project {
  name: string;
  description: string;
  tech: string[];
}

interface Skill {
  name: string;
  level: number;
}

interface Interest {
  emoji: string;
  title: string;
  description: string;
}

// ============================================================================
// DATA
// ============================================================================

const tabs: Tab[] = [
  { id: 'work', icon: Code, label: 'Work' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'interests', icon: Heart, label: 'Interests' },
  { id: 'learning', icon: BookOpen, label: 'Learning' },
];

const featuredProjects: Project[] = [
  {
    name: 'Conversational Portfolio',
    description: 'This very website! A unique approach to personal branding.',
    tech: ['Next.js', 'React', 'TypeScript'],
  },
  {
    name: 'Developer Toolkit',
    description: 'CLI tools that automate repetitive development tasks.',
    tech: ['Node.js', 'TypeScript', 'Commander'],
  },
  {
    name: 'Real-time Dashboard',
    description: 'Live data visualization with sub-100ms updates.',
    tech: ['React', 'WebSockets', 'D3.js'],
  },
];

const topSkills: Skill[] = [
  { name: 'React / Next.js', level: 95 },
  { name: 'TypeScript', level: 92 },
  { name: 'Node.js', level: 88 },
  { name: 'System Design', level: 85 },
];

const interests: Interest[] = [
  { emoji: '☕', title: 'Coffee Enthusiast', description: 'Pour-over, always' },
  { emoji: '📚', title: 'Avid Reader', description: 'Sci-fi and tech books' },
  { emoji: '🎮', title: 'Casual Gamer', description: 'Strategy and puzzles' },
  { emoji: '🎸', title: 'Music Lover', description: 'Learning guitar (badly)' },
];

const currentlyLearning = [
  'Rust for systems programming',
  'AI/ML fundamentals',
  'Distributed systems design',
  'Public speaking',
];

// ============================================================================
// WORK TAB CONTENT
// ============================================================================

const WorkContent = memo(function WorkContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <h4 className="font-medium text-white mb-2">Featured Projects</h4>
        <p className="text-sm text-white/50">Some things I've built that I'm proud of.</p>
      </div>

      <div className="space-y-4">
        {featuredProjects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
          >
            <h5 className="font-medium text-white mb-2">{project.name}</h5>
            <p className="text-sm text-white/40 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-xs bg-white/5 text-white/50 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// ============================================================================
// EXPERIENCE TAB CONTENT
// ============================================================================

const ExperienceContent = memo(function ExperienceContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <h4 className="font-medium text-white mb-2">Skills Overview</h4>
        <p className="text-sm text-white/50">My top technical proficiencies.</p>
      </div>

      <div className="space-y-4">
        {topSkills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{skill.name}</span>
              <span className="text-sm text-blue-400">{skill.level}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          <span className="font-medium text-white">5+ Years Experience</span>
        </div>
        <p className="text-sm text-white/40">
          From agency work to startups to enterprise. Led teams, shipped products, 
          and learned something new every day.
        </p>
      </div>
    </div>
  );
});

// ============================================================================
// INTERESTS TAB CONTENT
// ============================================================================

const InterestsContent = memo(function InterestsContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <h4 className="font-medium text-white mb-2">Beyond the Code</h4>
        <p className="text-sm text-white/50">What I do when I'm not coding (rarely 😄).</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {interests.map((interest, i) => (
          <motion.div
            key={interest.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/5 text-center"
          >
            <div className="text-3xl mb-2">{interest.emoji}</div>
            <h5 className="font-medium text-white mb-1">{interest.title}</h5>
            <p className="text-sm text-white/40">{interest.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Heart className="w-5 h-5 text-purple-400" />
          <span className="font-medium text-white">Core Values</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Curiosity', 'Integrity', 'Growth', 'Impact', 'Balance'].map((value) => (
            <span key={value} className="px-3 py-1 text-sm bg-purple-500/10 text-purple-300 rounded-lg">
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// LEARNING TAB CONTENT
// ============================================================================

const LearningContent = memo(function LearningContent() {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <h4 className="font-medium text-white mb-2">Always Learning</h4>
        <p className="text-sm text-white/50">What I'm currently exploring and studying.</p>
      </div>

      <div className="space-y-3">
        {currentlyLearning.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-white/70">{item}</span>
          </motion.div>
        ))}
      </div>

      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span className="font-medium text-white">Learning Philosophy</span>
        </div>
        <p className="text-sm text-white/50">
          "You never stop being a student. The moment you think you know everything 
          is the moment you stop growing."
        </p>
      </div>
    </div>
  );
});

// ============================================================================
// TAB CONTENT RENDERER
// ============================================================================

const tabContent: Record<string, React.ComponentType> = {
  work: WorkContent,
  experience: ExperienceContent,
  interests: InterestsContent,
  learning: LearningContent,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExplorerDeepDiveProps {
  onComplete: () => void;
}

export function ExplorerDeepDive({ onComplete }: ExplorerDeepDiveProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 'work');

  const ActiveContent = tabContent[activeTab] ?? WorkContent;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Deep Dive
            </h1>
            <p className="text-white/50 max-w-2xl">
              Explore different aspects of who I am and what I do.
              Pick a category that interests you.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl
                    text-sm font-medium whitespace-nowrap transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'bg-white/[0.02] text-white/50 border border-white/5 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveContent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-white/30">
            Explore all tabs to get the full picture.
          </p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>Let's Connect</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExplorerDeepDive;
