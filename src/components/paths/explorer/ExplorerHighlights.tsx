'use client';

/**
 * ============================================================================
 * EXPLORER PATH - HIGHLIGHTS STEP
 * ============================================================================
 *
 * Quick visual tour of key highlights with
 * interactive cards and bite-sized content.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Trophy,
  Heart,
  Lightbulb,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Highlight {
  id: string;
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  visual: string;
  color: string;
  details: string[];
}

// ============================================================================
// DATA
// ============================================================================

const highlights: Highlight[] = [
  {
    id: 'tech',
    icon: Code,
    category: 'Technical',
    title: 'Building Modern Web Apps',
    description:
      'I specialize in creating fast, accessible, and beautiful web applications using cutting-edge technologies.',
    visual: '⚡',
    color: 'from-blue-500 to-blue-400',
    details: [
      'React & Next.js expert',
      'TypeScript-first development',
      'Performance optimization',
      'Accessible by design',
    ],
  },
  {
    id: 'projects',
    icon: Trophy,
    category: 'Projects',
    title: '20+ Shipped Products',
    description: 'From personal experiments to production applications serving thousands of users.',
    visual: '🚀',
    color: 'from-indigo-500 to-indigo-400',
    details: [
      'Enterprise SaaS platforms',
      'Open source contributions',
      'Personal passion projects',
      'Client work & freelance',
    ],
  },
  {
    id: 'philosophy',
    icon: Lightbulb,
    category: 'Philosophy',
    title: 'Clarity Over Cleverness',
    description:
      'I believe in writing code that future developers (including future me) will thank me for.',
    visual: '💡',
    color: 'from-purple-500 to-purple-400',
    details: [
      'Readable code first',
      'Boring technology choices',
      'Ship, then iterate',
      'Constraints breed creativity',
    ],
  },
  {
    id: 'beyond',
    icon: Heart,
    category: 'Beyond Code',
    title: 'More Than Just Programming',
    description:
      "I'm passionate about mentoring, writing, and helping others grow in their tech journey.",
    visual: '✨',
    color: 'from-cyan-500 to-cyan-400',
    details: [
      'Technical writing',
      'Mentoring developers',
      'Community building',
      'Continuous learning',
    ],
  },
];

// ============================================================================
// HIGHLIGHT CARD
// ============================================================================

interface HighlightCardProps {
  highlight: Highlight;
  isActive: boolean;
}

const HighlightCard = memo(function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:p-10">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-5`} />
        <div
          className={`absolute right-0 top-0 h-64 w-64 bg-gradient-to-br ${highlight.color} opacity-10 blur-3xl`}
        />

        {/* Content */}
        <div className="relative">
          {/* Category & Icon */}
          <div className="mb-6 flex items-center justify-between">
            <span
              className={`rounded-full bg-gradient-to-r px-3 py-1 ${highlight.color} text-sm font-medium text-white`}
            >
              {highlight.category}
            </span>
            <div className="text-5xl">{highlight.visual}</div>
          </div>

          {/* Title & Description */}
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{highlight.title}</h2>
          <p className="mb-8 text-lg text-white/50">{highlight.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            {highlight.details.map((detail, i) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${highlight.color}`} />
                <span className="text-sm text-white/60">{detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// NAVIGATION DOT
// ============================================================================

interface NavDotProps {
  isActive: boolean;
  onClick: () => void;
  highlight: Highlight;
}

const NavDot = memo(function NavDot({ isActive, onClick, highlight }: NavDotProps) {
  return (
    <button
      onClick={onClick}
      className={`relative h-12 w-12 rounded-xl transition-all duration-300 ${
        isActive ? `bg-gradient-to-br ${highlight.color} shadow-lg` : 'bg-white/5 hover:bg-white/10'
      } `}
    >
      <span className="text-xl">{highlight.visual}</span>
    </button>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExplorerHighlightsProps {
  onComplete: () => void;
}

export function ExplorerHighlights({ onComplete }: ExplorerHighlightsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedHighlights, setViewedHighlights] = useState<Set<number>>(new Set([0]));

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setViewedHighlights((prev) => new Set([...prev, index]));
  };

  const goNext = () => {
    const next = (currentIndex + 1) % highlights.length;
    goTo(next);
  };

  const goPrev = () => {
    const prev = (currentIndex - 1 + highlights.length) % highlights.length;
    goTo(prev);
  };

  const allViewed = viewedHighlights.size === highlights.length;
  const currentHighlight = highlights[currentIndex]!;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Quick Highlights</h1>
            <p className="text-white/40">
              Swipe through to get a quick overview • {currentIndex + 1}/{highlights.length}
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative mb-8">
            {/* Navigation Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Card */}
            <AnimatePresence mode="wait">
              <HighlightCard
                key={currentHighlight.id}
                highlight={currentHighlight}
                isActive={true}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3">
            {highlights.map((highlight, index) => (
              <NavDot
                key={highlight.id}
                highlight={highlight}
                isActive={currentIndex === index}
                onClick={() => goTo(index)}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {highlights.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-8 rounded-full transition-colors ${
                    viewedHighlights.has(i) ? 'bg-blue-500' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/30">
              {viewedHighlights.size}/{highlights.length} explored
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <p className="text-sm text-white/30">
            {allViewed ? "Great! You've seen all highlights." : 'View all highlights to continue.'}
          </p>

          <button
            onClick={onComplete}
            disabled={!allViewed}
            className={`group inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all duration-300 ${
              allViewed
                ? 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-400'
                : 'cursor-not-allowed bg-white/10 text-white/30'
            } `}
          >
            <span>Deep Dive</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExplorerHighlights;
