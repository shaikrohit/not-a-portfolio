'use client';

/**
 * ============================================================================
 * STUDENT PATH - RESOURCES STEP
 * ============================================================================
 *
 * Curated learning resources with personal recommendations,
 * categorized by skill level and type.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ExternalLink,
  Star,
  BookOpen,
  Video,
  Code,
  Globe,
  CheckCircle,
  Bookmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Resource {
  id: string;
  name: string;
  type: 'course' | 'book' | 'platform' | 'youtube';
  url: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  free: boolean;
  personalNote: string;
  rating: number; // 1-5
}

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  resources: Resource[];
}

// ============================================================================
// DATA
// ============================================================================

const categories: Category[] = [
  {
    id: 'fundamentals',
    name: 'Programming Fundamentals',
    icon: Code,
    resources: [
      {
        id: '1',
        name: 'freeCodeCamp',
        type: 'platform',
        url: 'https://freecodecamp.org',
        description: 'Free, comprehensive curriculum covering HTML, CSS, JavaScript, and more.',
        level: 'beginner',
        free: true,
        personalNote: 'This is where I started. Complete the certifications in order.',
        rating: 5,
      },
      {
        id: '2',
        name: 'The Odin Project',
        type: 'course',
        url: 'https://theodinproject.com',
        description: 'Project-based curriculum that teaches full-stack development.',
        level: 'beginner',
        free: true,
        personalNote: "Best free resource for building real projects. Don't skip the exercises.",
        rating: 5,
      },
      {
        id: '3',
        name: 'JavaScript.info',
        type: 'platform',
        url: 'https://javascript.info',
        description: 'Modern JavaScript tutorial covering everything from basics to advanced.',
        level: 'intermediate',
        free: true,
        personalNote: 'My go-to reference for JavaScript. Bookmark this.',
        rating: 5,
      },
    ],
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libraries',
    icon: Globe,
    resources: [
      {
        id: '4',
        name: 'React Documentation',
        type: 'platform',
        url: 'https://react.dev',
        description: 'Official React docs with interactive examples and tutorials.',
        level: 'intermediate',
        free: true,
        personalNote: 'The new docs are amazing. Start with the Quick Start guide.',
        rating: 5,
      },
      {
        id: '5',
        name: 'Full Stack Open',
        type: 'course',
        url: 'https://fullstackopen.com',
        description: "University of Helsinki's full-stack course covering React, Node, and more.",
        level: 'intermediate',
        free: true,
        personalNote: 'Rigorous but thorough. This bridged my knowledge gaps.',
        rating: 4,
      },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube Channels',
    icon: Video,
    resources: [
      {
        id: '6',
        name: 'Fireship',
        type: 'youtube',
        url: 'https://youtube.com/@Fireship',
        description: 'Quick, informative videos on web development topics.',
        level: 'intermediate',
        free: true,
        personalNote: 'Great for staying up-to-date with new technologies.',
        rating: 5,
      },
      {
        id: '7',
        name: 'Traversy Media',
        type: 'youtube',
        url: 'https://youtube.com/@TraversyMedia',
        description: 'Practical tutorials on various web technologies.',
        level: 'beginner',
        free: true,
        personalNote: 'Brad explains things clearly. Good for project-based learning.',
        rating: 4,
      },
      {
        id: '8',
        name: 'Web Dev Simplified',
        type: 'youtube',
        url: 'https://youtube.com/@WebDevSimplified',
        description: 'Simplified explanations of complex web development concepts.',
        level: 'beginner',
        free: true,
        personalNote: 'Kyle breaks down concepts really well. Great for fundamentals.',
        rating: 4,
      },
    ],
  },
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    resources: [
      {
        id: '9',
        name: 'Eloquent JavaScript',
        type: 'book',
        url: 'https://eloquentjavascript.net',
        description: 'A modern introduction to programming through JavaScript.',
        level: 'beginner',
        free: true,
        personalNote: 'Read online for free. The exercises are challenging but worth it.',
        rating: 4,
      },
      {
        id: '10',
        name: "You Don't Know JS",
        type: 'book',
        url: 'https://github.com/getify/You-Dont-Know-JS',
        description: 'Deep dive into JavaScript mechanics and concepts.',
        level: 'advanced',
        free: true,
        personalNote: 'This book leveled up my JS understanding significantly.',
        rating: 5,
      },
    ],
  },
];

const levelConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-500/20 text-green-400' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-500/20 text-blue-400' },
  advanced: { label: 'Advanced', color: 'bg-purple-500/20 text-purple-400' },
};

const typeConfig = {
  course: { label: 'Course', icon: BookOpen },
  book: { label: 'Book', icon: BookOpen },
  platform: { label: 'Platform', icon: Globe },
  youtube: { label: 'YouTube', icon: Video },
};

// ============================================================================
// RESOURCE CARD
// ============================================================================

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

const ResourceCard = memo(function ResourceCard({ resource, index }: ResourceCardProps) {
  const TypeIcon = typeConfig[resource.type].icon;
  const level = levelConfig[resource.level];

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group block rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <TypeIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-white transition-colors group-hover:text-blue-400">
              {resource.name}
            </h4>
            <div className="mt-0.5 flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-xs ${level.color}`}>{level.label}</span>
              {resource.free && (
                <span className="rounded bg-green-500/20 px-1.5 py-0.5 text-xs text-green-400">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-white/20 transition-colors group-hover:text-white/40" />
      </div>

      <p className="mb-3 text-sm text-white/40">{resource.description}</p>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= resource.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'
            }`}
          />
        ))}
      </div>

      {/* Personal Note */}
      <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3">
        <p className="text-xs text-blue-300/70">
          <span className="font-medium text-blue-400">My take: </span>
          {resource.personalNote}
        </p>
      </div>
    </motion.a>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StudentResourcesProps {
  onComplete: () => void;
}

export function StudentResources({ onComplete }: StudentResourcesProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]!);

  const totalResources = categories.reduce((acc, cat) => acc + cat.resources.length, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Learning Resources</h1>
            <p className="max-w-2xl text-white/50">
              My personally curated list of {totalResources}+ resources that actually helped me
              learn. Every recommendation comes with my honest take.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeCategory.id === category.id
                      ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                      : 'border border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                  } `}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <span className="text-xs text-white/30">{category.resources.length}</span>
                </button>
              );
            })}
          </div>

          {/* Resources Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {activeCategory.resources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pro Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="mb-2 font-medium text-white">Pro Tip</h3>
                <p className="text-white/50">
                  Don't try to learn everything at once. Pick ONE resource and complete it fully
                  before moving to the next. Depth beats breadth when you're starting out.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Bookmark className="h-4 w-4" />
            Bookmark this page for future reference
          </div>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
          >
            <span>Get Advice</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentResources;
