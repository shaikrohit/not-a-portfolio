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
import { Lightbulb, Sparkles, Target, Layers, ChevronRight, ArrowRight } from 'lucide-react';
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
      className={`w-full rounded-xl border p-5 text-left transition-all duration-300 ${
        isActive
          ? 'border-blue-500/30 bg-blue-500/10 shadow-lg shadow-blue-500/10'
          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      } `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${isActive ? 'bg-blue-500/20' : 'bg-white/5'} `}
        >
          <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-white/50'}`} />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`mb-1 font-medium transition-colors ${isActive ? 'text-white' : 'text-white/80'}`}
          >
            {principle.title}
          </h3>
          <p className="text-sm text-white/40">{principle.tagline}</p>
        </div>

        <ChevronRight
          className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'rotate-90 text-blue-400' : 'text-white/20'} `}
        />
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
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{principle.title}</h2>
          <p className="text-blue-300">{principle.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="whitespace-pre-line leading-relaxed text-white/60">{principle.description}</p>
      </div>

      {/* Code Example */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/5">
        <div className="border-b border-white/5 bg-white/[0.02] px-4 py-2">
          <span className="font-mono text-xs text-white/40">example.ts</span>
        </div>
        <pre className="overflow-x-auto bg-[#0d1117] p-4">
          <code className="font-mono text-sm leading-relaxed text-white/70">
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
  const [viewedPrinciples, setViewedPrinciples] = useState<Set<string>>(
    new Set([principles[0]?.id ?? 'clarity'])
  );

  const handleSelect = (id: string) => {
    setActivePrinciple(id);
    setViewedPrinciples((prev) => new Set([...prev, id]));
  };

  const currentPrinciple = principles.find((p) => p.id === activePrinciple);
  const allViewed = viewedPrinciples.size === principles.length;

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
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
              Engineering Philosophy
            </h1>
            <p className="max-w-2xl text-white/50">
              These principles guide how I approach software development. Click each to explore in
              detail.
            </p>

            {/* Progress */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {principles.map((p) => (
                  <div
                    key={p.id}
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
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
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Principle List */}
            <div className="space-y-3 lg:col-span-2">
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
              <div className="sticky top-24 min-h-[500px] rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <AnimatePresence mode="wait">
                  {currentPrinciple && <PrincipleDetail principle={currentPrinciple} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-sm text-white/30">
            {allViewed
              ? "Great! You've explored all principles."
              : 'Explore all principles to continue.'}
          </p>

          <button
            onClick={onComplete}
            disabled={!allViewed}
            className={`group inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all duration-300 ${
              allViewed
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400'
                : 'cursor-not-allowed bg-white/10 text-white/30'
            } `}
          >
            <span>Continue to Tech Stack</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperPhilosophy;
