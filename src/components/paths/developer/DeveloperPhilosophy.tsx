'use client';

/**
 * ============================================================================
 * DEVELOPER PATH - PHILOSOPHY STEP
 * ============================================================================
 * 
 * Engineering principles and philosophy section.
 * Features interactive principle cards with deep explanations.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Sparkles, 
  Target, 
  Layers, 
  ChevronRight,
  ArrowRight 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Principle {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  example: string;
}

// ============================================================================
// DATA
// ============================================================================

const principles: Principle[] = [
  {
    id: 'clarity',
    icon: Lightbulb,
    title: 'Clarity Over Cleverness',
    tagline: 'Code is read more than written',
    description: `Clever code feels satisfying to write, but becomes a burden to maintain. 
I optimize for the developer who reads this code six months from now—often that's me.

Instead of one-liner array manipulations, I break logic into named steps. 
More lines, but infinitely more readable.`,
    example: `// Instead of this:
const result = data.filter(x => x.active && x.score > 50).map(x => x.name).slice(0, 5);

// I prefer this:
const activeItems = data.filter(item => item.active);
const highScorers = activeItems.filter(item => item.score > 50);
const names = highScorers.map(item => item.name);
const topFive = names.slice(0, 5);`,
  },
  {
    id: 'constraints',
    icon: Target,
    title: 'Constraints Breed Creativity',
    tagline: 'Limitations unlock innovation',
    description: `Infinite options lead to decision paralysis. I intentionally limit choices—
fewer frameworks, smaller scope, simpler solutions.

For this site, I limited myself to one accent color, one font family, and no gradients.
These constraints made design decisions easier and results more cohesive.`,
    example: `// Project constraints that worked:
// - Max 3 dependencies for core functionality
// - No state management library (just React state)
// - Mobile-first, then enhance for desktop
// - Maximum 500 lines per component`,
  },
  {
    id: 'shipping',
    icon: Sparkles,
    title: 'Ship, Then Iterate',
    tagline: 'Perfect is the enemy of done',
    description: `I aim for "good enough to learn from" rather than "flawless but theoretical."
Real feedback from real users beats imagined requirements.

My first version of any feature is embarrassingly simple. But it's in production,
being used, generating data that informs the next iteration.`,
    example: `// Version 1: Ship it
function calculatePrice(quantity) {
  return quantity * 9.99;
}

// Version 2: After user feedback
function calculatePrice(quantity, discount = 0) {
  const base = quantity * 9.99;
  return base * (1 - discount);
}`,
  },
  {
    id: 'boring',
    icon: Layers,
    title: 'Boring Technology',
    tagline: 'Innovation budget for logic, not infrastructure',
    description: `I save my innovation budget for business logic, not infrastructure.
Proven tools mean fewer surprises at 2 AM.

PostgreSQL over the hot new database. React over the framework of the month.
Reliability compounds; novelty depreciates.`,
    example: `// My "boring" but reliable stack:
// - PostgreSQL (not the new distributed DB)
// - React (not the framework of the week)
// - Node.js (battle-tested runtime)
// - Tailwind CSS (utility-first, predictable)`,
  },
];

// ============================================================================
// PRINCIPLE CARD
// ============================================================================

interface PrincipleCardProps {
  principle: Principle;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const PrincipleCard = memo(function PrincipleCard({
  principle,
  isActive,
  onClick,
  index,
}: PrincipleCardProps) {
  const Icon = principle.icon;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className={`
        w-full text-left p-5 rounded-xl
        transition-all duration-300
        border
        ${isActive
          ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          transition-colors duration-300
          ${isActive ? 'bg-blue-500/20' : 'bg-white/5'}
        `}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/50'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}>
            {principle.title}
          </h3>
          <p className="text-sm text-white/40">{principle.tagline}</p>
        </div>

        <ChevronRight className={`
          w-5 h-5 flex-shrink-0 transition-all duration-300
          ${isActive ? 'text-blue-400 rotate-90' : 'text-white/20'}
        `} />
      </div>
    </motion.button>
  );
});

// ============================================================================
// PRINCIPLE DETAIL
// ============================================================================

interface PrincipleDetailProps {
  principle: Principle;
}

const PrincipleDetail = memo(function PrincipleDetail({ principle }: PrincipleDetailProps) {
  const Icon = principle.icon;

  return (
    <motion.div
      key={principle.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{principle.title}</h2>
          <p className="text-blue-300">{principle.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-white/60 whitespace-pre-line leading-relaxed">
          {principle.description}
        </p>
      </div>

      {/* Code Example */}
      <div className="flex-1 rounded-xl overflow-hidden border border-white/5">
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5">
          <span className="text-xs text-white/40 font-mono">example.ts</span>
        </div>
        <pre className="p-4 bg-[#0d1117] overflow-x-auto">
          <code className="text-sm font-mono text-white/70 leading-relaxed">
            {principle.example}
          </code>
        </pre>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface DeveloperPhilosophyProps {
  onComplete: () => void;
}

export function DeveloperPhilosophy({ onComplete }: DeveloperPhilosophyProps) {
  const [activePrinciple, setActivePrinciple] = useState<string>(principles[0]?.id ?? 'clarity');
  const [viewedPrinciples, setViewedPrinciples] = useState<Set<string>>(new Set([principles[0]?.id ?? 'clarity']));

  const handleSelect = (id: string) => {
    setActivePrinciple(id);
    setViewedPrinciples((prev) => new Set([...prev, id]));
  };

  const currentPrinciple = principles.find((p) => p.id === activePrinciple);
  const allViewed = viewedPrinciples.size === principles.length;

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
              Engineering Philosophy
            </h1>
            <p className="text-white/50 max-w-2xl">
              These principles guide how I approach software development.
              Click each to explore in detail.
            </p>
            
            {/* Progress */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {principles.map((p) => (
                  <div
                    key={p.id}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      viewedPrinciples.has(p.id) ? 'bg-blue-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/30">
                {viewedPrinciples.size}/{principles.length} explored
              </span>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Principle List */}
            <div className="lg:col-span-2 space-y-3">
              {principles.map((principle, index) => (
                <PrincipleCard
                  key={principle.id}
                  principle={principle}
                  isActive={activePrinciple === principle.id}
                  onClick={() => handleSelect(principle.id)}
                  index={index}
                />
              ))}
            </div>

            {/* Right: Detail View */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[500px]">
                <AnimatePresence mode="wait">
                  {currentPrinciple && (
                    <PrincipleDetail principle={currentPrinciple} />
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
            {allViewed ? 'Great! You\'ve explored all principles.' : 'Explore all principles to continue.'}
          </p>

          <button
            onClick={onComplete}
            disabled={!allViewed}
            className={`
              group inline-flex items-center gap-2
              px-6 py-3 rounded-lg
              font-medium text-white
              transition-all duration-300
              ${allViewed
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <span>Continue to Tech Stack</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperPhilosophy;
