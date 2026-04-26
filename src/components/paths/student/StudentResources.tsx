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
  Bookmark
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
        personalNote: 'Best free resource for building real projects. Don\'t skip the exercises.',
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
        description: 'University of Helsinki\'s full-stack course covering React, Node, and more.',
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
        name: 'You Don\'t Know JS',
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
      className="group block p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <TypeIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
              {resource.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded ${level.color}`}>
                {level.label}
              </span>
              {resource.free && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                  Free
                </span>
              )}
            </div>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
      </div>

      <p className="text-sm text-white/40 mb-3">{resource.description}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= resource.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'
            }`}
          />
        ))}
      </div>

      {/* Personal Note */}
      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
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
              Learning Resources
            </h1>
            <p className="text-white/50 max-w-2xl">
              My personally curated list of {totalResources}+ resources that actually helped me learn.
              Every recommendation comes with my honest take.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                    text-sm font-medium transition-all duration-300
                    ${activeCategory.id === category.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/[0.02] text-white/50 border border-white/5 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
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
            className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Pro Tip</h3>
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
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <Bookmark className="w-4 h-4" />
            Bookmark this page for future reference
          </div>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>Get Advice</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentResources;
