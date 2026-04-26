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
import { ArrowRight, Code, Briefcase, Heart, BookOpen, Star } from 'lucide-react';
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
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
        <h4 className="mb-2 font-medium text-white">Featured Projects</h4>
        <p className="text-sm text-white/50">Some things I've built that I'm proud of.</p>
      </div>

      <div className="space-y-4">
        {featuredProjects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:border-white/10"
          >
            <h5 className="mb-2 font-medium text-white">{project.name}</h5>
            <p className="mb-3 text-sm text-white/40">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded bg-white/5 px-2 py-0.5 text-xs text-white/50">
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
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
        <h4 className="mb-2 font-medium text-white">Skills Overview</h4>
        <p className="text-sm text-white/50">My top technical proficiencies.</p>
      </div>

      <div className="space-y-4">
        {topSkills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-white">{skill.name}</span>
              <span className="text-sm text-blue-400">{skill.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-indigo-400" />
          <span className="font-medium text-white">5+ Years Experience</span>
        </div>
        <p className="text-sm text-white/40">
          From agency work to startups to enterprise. Led teams, shipped products, and learned
          something new every day.
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
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
        <h4 className="mb-2 font-medium text-white">Beyond the Code</h4>
        <p className="text-sm text-white/50">What I do when I'm not coding (rarely 😄).</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {interests.map((interest, i) => (
          <motion.div
            key={interest.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center"
          >
            <div className="mb-2 text-3xl">{interest.emoji}</div>
            <h5 className="mb-1 font-medium text-white">{interest.title}</h5>
            <p className="text-sm text-white/40">{interest.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center gap-3">
          <Heart className="h-5 w-5 text-purple-400" />
          <span className="font-medium text-white">Core Values</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Curiosity', 'Integrity', 'Growth', 'Impact', 'Balance'].map((value) => (
            <span
              key={value}
              className="rounded-lg bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
            >
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
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
        <h4 className="mb-2 font-medium text-white">Always Learning</h4>
        <p className="text-sm text-white/50">What I'm currently exploring and studying.</p>
      </div>

      <div className="space-y-3">
        {currentlyLearning.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
              <Star className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-white/70">{item}</span>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-5">
        <div className="mb-3 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <span className="font-medium text-white">Learning Philosophy</span>
        </div>
        <p className="text-sm text-white/50">
          "You never stop being a student. The moment you think you know everything is the moment
          you stop growing."
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
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Deep Dive</h1>
            <p className="max-w-2xl text-white/50">
              Explore different aspects of who I am and what I do. Pick a category that interests
              you.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border border-white/10 bg-white/10 text-white'
                      : 'border border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                  } `}
                >
                  <Icon className="h-4 w-4" />
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
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <p className="text-sm text-white/30">Explore all tabs to get the full picture.</p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-indigo-400"
          >
            <span>Let's Connect</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExplorerDeepDive;
