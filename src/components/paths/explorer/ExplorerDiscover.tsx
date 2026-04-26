'use client';

/**
 * ============================================================================
 * EXPLORER PATH - PREMIUM COSMIC DESIGN
 * ============================================================================
 *
 * Mysterious, adventurous discovery experience with cosmic
 * purple/pink palette and exploration-focused UI.
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  Coffee,
  ArrowRight,
  Eye,
  Star,
  Rocket,
  Map,
  Telescope,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface InterestArea {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

// ============================================================================
// DATA
// ============================================================================

const interestAreas: InterestArea[] = [
  {
    id: 'technical',
    icon: Code,
    title: 'Technical Work',
    description: 'See the projects, technologies, and engineering principles I use',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Professional Background',
    description: 'My career journey, experience, and professional achievements',
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    id: 'learning',
    icon: GraduationCap,
    title: 'Learning & Growth',
    description: 'How I approach learning and what resources helped me grow',
    color: 'from-pink-500 to-fuchsia-500',
  },
  {
    id: 'personal',
    icon: Coffee,
    title: 'Personal Side',
    description: 'Beyond the code—interests, philosophy, and what drives me',
    color: 'from-violet-500 to-purple-500',
  },
];

const quickFacts = [
  { label: 'Years Coding', value: '5+', icon: Code },
  { label: 'Projects Built', value: '20+', icon: Rocket },
  { label: 'Technologies', value: '15+', icon: Telescope },
  { label: 'Coffees/Day', value: '☕☕☕', icon: Coffee },
];

// ============================================================================
// COSMIC STAR FIELD
// ============================================================================

const CosmicStarField = memo(function CosmicStarField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Static stars */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute h-0.5 w-20 bg-gradient-to-r from-purple-400 to-transparent"
          style={{
            top: `${20 + i * 30}%`,
            rotate: -45,
          }}
          initial={{ left: '-10%', opacity: 0 }}
          animate={{ left: '110%', opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 3 + i * 4,
            repeatDelay: 8 + i * 2,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// PREMIUM INTEREST CARD
// ============================================================================

interface InterestCardProps {
  area: InterestArea;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const InterestCard = memo(function InterestCard({
  area,
  isSelected,
  onSelect,
  index,
}: InterestCardProps) {
  const Icon = area.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ${
        isSelected
          ? 'border-purple-500/50 bg-white/[0.08] shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.04]'
      } `}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 ${isSelected ? 'opacity-10' : ''} transition-opacity duration-500 group-hover:opacity-5`}
      />

      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Star className="h-3 w-3 text-purple-400/50" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${area.color} mb-4 flex items-center justify-center shadow-lg shadow-purple-500/20`}
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>

        <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-purple-300">
          {area.title}
        </h3>
        <p className="text-sm leading-relaxed text-white/50">{area.description}</p>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
            >
              <Eye className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.button>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExplorerDiscoverProps {
  onComplete: () => void;
}

export function ExplorerDiscover({ onComplete }: ExplorerDiscoverProps) {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#0a0510] via-[#0d0815] to-[#08050f] text-white">
      {/* Premium Cosmic Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="via-fuchsia-600/8 absolute left-1/4 top-0 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-purple-600/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-pink-600/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="from-violet-500/8 absolute left-0 top-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r to-transparent blur-3xl" />

        {/* Star field */}
        <CosmicStarField />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            {/* Animated Compass Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 15 }}
              className="relative mb-8 inline-flex h-24 w-24 items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-2xl shadow-purple-500/30">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Compass className="h-12 w-12 text-white" />
                </motion.div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '60px 60px' }}
              >
                <Star className="h-3 w-3 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Welcome,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Explorer!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-2xl text-xl leading-relaxed text-white/60"
            >
              Curious minds welcome! Let&apos;s discover what interests you most. This is your
              personalized journey through my world.
            </motion.p>
          </motion.div>

          {/* Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16 flex flex-wrap justify-center gap-4"
          >
            {quickFacts.map((fact, i) => {
              const FactIcon = fact.icon;
              return (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-4 text-center backdrop-blur-sm"
                >
                  <div className="mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                    {fact.value}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                    <FactIcon className="h-3 w-3 text-purple-400" />
                    {fact.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Interest Areas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
              <h2 className="flex items-center gap-2 text-center text-xl font-semibold text-white">
                <Map className="h-5 w-5 text-purple-400" />
                What interests you?
                <span className="text-sm text-white/40">(Select any)</span>
              </h2>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {interestAreas.map((area, index) => (
                <InterestCard
                  key={area.id}
                  area={area}
                  isSelected={selectedAreas.has(area.id)}
                  onSelect={() => toggleArea(area.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Personalized Message */}
          <AnimatePresence>
            {selectedAreas.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 p-8 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="mx-auto mb-4 h-10 w-10 text-purple-400" />
                  </motion.div>
                  <p className="text-lg text-white/70">
                    Great choices! I&apos;ll show you the most relevant highlights based on your
                    interests.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
        className="sticky bottom-0 border-t border-white/[0.06] bg-black/80 px-6 py-5 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="text-sm text-white/40">
            {selectedAreas.size === 0
              ? 'Select interests for a personalized experience, or continue to see everything.'
              : `${selectedAreas.size} area${selectedAreas.size > 1 ? 's' : ''} selected`}
          </p>

          <button
            onClick={onComplete}
            className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <span>Start Exploring</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ExplorerDiscover;
