'use client';

/**
 * ENTRY EXPERIENCE - PREMIUM REDESIGN
 *
 * The most critical component of this site.
 * Apple-level quality with cinematic transitions.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Briefcase, GraduationCap, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useVisitorStore, useNavigationStore } from '@/store';
import { cn } from '@/lib/utils';
import type { VisitorType, VisitorTypeOption } from '@/types';

/**
 * Visitor type options with path-specific colors
 */
const visitorOptions: VisitorTypeOption[] = [
  {
    id: 'developer',
    label: 'Developer',
    description: 'Explore engineering philosophy and architecture decisions',
    icon: 'code',
  },
  {
    id: 'recruiter',
    label: 'Recruiter / Hiring Manager',
    description: 'Professional summary and qualifications',
    icon: 'briefcase',
  },
  {
    id: 'student',
    label: 'Student',
    description: 'Learning journey and growth path',
    icon: 'graduation',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    description: 'Browse freely and discover',
    icon: 'compass',
  },
];

const iconMap = {
  code: Code2,
  briefcase: Briefcase,
  graduation: GraduationCap,
  compass: Compass,
};

const pathColors = {
  developer: 'from-cyan-500 to-blue-600',
  recruiter: 'from-blue-500 to-indigo-600',
  student: 'from-orange-500 to-amber-600',
  explorer: 'from-purple-500 to-fuchsia-600',
};

export function EntryExperience() {
  const [stage, setStage] = useState<'greeting' | 'question' | 'options' | 'transition'>(
    'greeting'
  );
  const [selectedType, setSelectedType] = useState<VisitorType | null>(null);

  const { setVisitorType, startSession, hasCompletedEntry } = useVisitorStore();
  const { setCurrentSection, unlockSection } = useNavigationStore();

  // Start session when component mounts
  useEffect(() => {
    startSession();
  }, [startSession]);

  // If entry is already completed, skip to main content
  useEffect(() => {
    if (hasCompletedEntry) {
      setStage('transition');
    }
  }, [hasCompletedEntry]);

  // Progress through stages
  useEffect(() => {
    if (stage === 'greeting') {
      const timer = setTimeout(() => setStage('question'), 2500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleTypeSelect = (type: VisitorType) => {
    setSelectedType(type);
    setVisitorType(type);

    // Unlock appropriate sections based on visitor type
    const sectionsToUnlock = getSectionsForVisitorType(type);
    sectionsToUnlock.forEach((section) => unlockSection(section));

    // Transition to main content
    setTimeout(() => {
      setStage('transition');
      setCurrentSection(getInitialSectionForType(type));
    }, 800);
  };

  // Skip rendering if already transitioned
  if (stage === 'transition' && hasCompletedEntry) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#080808]',
        'flex items-center justify-center',
        'transition-opacity duration-1000',
        stage === 'transition' && 'pointer-events-none opacity-0'
      )}
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 blur-3xl" />

        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <AnimatePresence mode="wait">
          {/* Stage 1: Greeting */}
          {stage === 'greeting' && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <motion.div
                className="mx-auto h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-light tracking-wide text-white/60 md:text-3xl"
              >
                Welcome.
              </motion.p>
            </motion.div>
          )}

          {/* Stage 2: Question */}
          {stage === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
                >
                  Before I introduce myself,
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-light text-white/50 md:text-2xl"
                >
                  I&apos;d like to know who you are.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => setStage('options')}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 text-white/70 transition-all duration-500 hover:border-white/30 hover:bg-white/[0.02] hover:text-white"
                >
                  <span className="text-lg">Continue</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Stage 3: Options */}
          {stage === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3"
              >
                <Sparkles className="h-5 w-5 text-blue-400" />
                <p className="text-lg text-white/60">Select the path that best describes you</p>
              </motion.div>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                {visitorOptions.map((option, index) => (
                  <VisitorTypeCard
                    key={option.id}
                    option={option}
                    index={index}
                    isSelected={selectedType === option.id}
                    onSelect={() => handleTypeSelect(option.id)}
                  />
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-white/30"
              >
                You can change this later. No commitment required.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Visitor Type Card - Premium Design
 * Interactive card with path-specific colors
 */
interface VisitorTypeCardProps {
  option: VisitorTypeOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function VisitorTypeCard({ option, index, isSelected, onSelect }: VisitorTypeCardProps) {
  const Icon = iconMap[option.icon as keyof typeof iconMap];
  const colorClass = pathColors[option.id as keyof typeof pathColors];

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-6 text-left',
        'border transition-all duration-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        isSelected
          ? 'border-white/20 bg-white/[0.08] shadow-xl'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
      )}
    >
      {/* Gradient background on selection */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500',
          colorClass,
          isSelected && 'opacity-10'
        )}
      />

      {/* Hover glow effect */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-5',
          colorClass
        )}
      />

      <div className="relative z-10 space-y-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500',
            isSelected ? `bg-gradient-to-br ${colorClass} shadow-lg` : 'bg-white/[0.05]'
          )}
        >
          <Icon
            className={cn(
              'h-6 w-6 transition-colors duration-300',
              isSelected ? 'text-white' : 'text-white/50 group-hover:text-white/80'
            )}
          />
        </motion.div>

        <div>
          <p
            className={cn(
              'text-lg font-semibold transition-colors duration-300',
              isSelected ? 'text-white' : 'text-white/90'
            )}
          >
            {option.label}
          </p>
          <p
            className={cn(
              'mt-1.5 text-sm leading-relaxed transition-colors duration-300',
              isSelected ? 'text-white/60' : 'text-white/40'
            )}
          >
            {option.description}
          </p>
        </div>
      </div>

      {/* Selection indicator */}
      <motion.div
        className={cn('absolute right-4 top-4 h-3 w-3 rounded-full bg-gradient-to-br', colorClass)}
        initial={false}
        animate={{
          scale: isSelected ? 1 : 0,
          opacity: isSelected ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Bottom shine line on hover */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100',
          isSelected ? 'via-white/30' : 'via-white/10'
        )}
      />
    </motion.button>
  );
}

/**
 * Helper: Get sections to unlock based on visitor type
 */
function getSectionsForVisitorType(type: VisitorType): string[] {
  switch (type) {
    case 'developer':
      return ['about', 'philosophy', 'stack', 'projects', 'contact'];
    case 'recruiter':
      return ['about', 'summary', 'skills', 'experience', 'contact'];
    case 'student':
    case 'explorer':
      return ['about', 'journey', 'learnings', 'qa', 'contact'];
    default:
      return ['about', 'contact'];
  }
}

/**
 * Helper: Get initial section for visitor type
 */
function getInitialSectionForType(type: VisitorType): string {
  switch (type) {
    case 'developer':
      return 'philosophy';
    case 'recruiter':
      return 'summary';
    case 'student':
    case 'explorer':
      return 'journey';
    default:
      return 'about';
  }
}

export default EntryExperience;
