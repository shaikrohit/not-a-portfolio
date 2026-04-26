'use client';

/**
 * ============================================================================
 * STUDENT PATH - ADVICE STEP
 * ============================================================================
 *
 * Honest advice and lessons learned, presented as
 * actionable tips with personal context.
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Target,
  Clock,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Advice {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  do: string[];
  dont: string[];
  reality: string;
}

// ============================================================================
// DATA
// ============================================================================

const adviceList: Advice[] = [
  {
    id: 'consistency',
    icon: Clock,
    title: 'Consistency Over Intensity',
    summary: '30 minutes daily beats 8-hour weekend sessions',
    do: [
      'Code for at least 30 minutes every day',
      'Build small habits that compound',
      'Track your streak to stay motivated',
    ],
    dont: [
      'Binge-code for 12 hours then burn out',
      'Skip days because "you\'re not in the mood"',
      'Wait for motivation—discipline beats motivation',
    ],
    reality:
      'I made more progress coding 30 minutes daily for 6 months than I did in my first year of sporadic "when I feel like it" learning.',
  },
  {
    id: 'projects',
    icon: Target,
    title: 'Build Projects, Not Tutorial Collections',
    summary: 'Stop watching, start building',
    do: [
      'Build something after every tutorial',
      'Rebuild the tutorial project without watching',
      'Create personal projects that excite you',
    ],
    dont: [
      'Watch 10 tutorials before building anything',
      'Follow tutorials line by line without understanding',
      'Only build what instructors tell you to build',
    ],
    reality:
      "Tutorial Hell is real. I spent 6 months watching tutorials and couldn't build a simple form. The day I started building without guidance, everything changed.",
  },
  {
    id: 'community',
    icon: Users,
    title: 'Join a Community',
    summary: 'Coding alone is hard—find your people',
    do: [
      'Join Discord servers, Twitter/X communities',
      'Share your progress publicly (build in public)',
      'Help others—teaching reinforces learning',
    ],
    dont: [
      'Isolate yourself and struggle alone',
      'Be afraid to ask "stupid" questions',
      "Compare your beginning to someone's middle",
    ],
    reality:
      'The developers I met online became my mentors, collaborators, and friends. Some even helped me get job interviews.',
  },
  {
    id: 'imposter',
    icon: Heart,
    title: 'Embrace Imposter Syndrome',
    summary: 'Everyone feels it—even senior developers',
    do: [
      'Accept that confusion is part of the process',
      'Document your wins, no matter how small',
      "Remember: if you're confused, you're learning",
    ],
    dont: [
      'Let self-doubt stop you from applying to jobs',
      'Compare yourself to people with years more experience',
      'Think "real" developers don\'t Google things',
    ],
    reality:
      "I still Google basic things. I still feel like I don't belong in technical discussions. But I've shipped products, mentored developers, and gotten paid. Feelings aren't facts.",
  },
  {
    id: 'fundamentals',
    icon: Lightbulb,
    title: 'Master Fundamentals First',
    summary: "Frameworks change; principles don't",
    do: [
      'Learn vanilla JavaScript before React',
      'Understand how the web works (HTTP, DNS, etc.)',
      'Practice problem-solving and algorithms',
    ],
    dont: [
      'Jump to frameworks before understanding basics',
      "Learn the newest framework just because it's popular",
      'Skip data structures because they\'re "boring"',
    ],
    reality:
      'When I finally understood JavaScript fundamentals, learning React took days instead of months. Fundamentals are the shortcut everyone skips.',
  },
];

// ============================================================================
// ADVICE CARD
// ============================================================================

interface AdviceCardProps {
  advice: Advice;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const AdviceCard = memo(function AdviceCard({
  advice,
  index,
  isExpanded,
  onToggle,
}: AdviceCardProps) {
  const Icon = advice.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-white">{advice.title}</h3>
            <p className="text-sm text-white/40">{advice.summary}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5"
          >
            <ArrowRight className="h-4 w-4 rotate-90 text-white/30" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 px-5 pb-5">
          {/* Do's and Don'ts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Do's */}
            <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-green-400">
                <CheckCircle className="h-4 w-4" />
                Do This
              </h4>
              <ul className="space-y-2">
                {advice.do.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-red-400">
                <XCircle className="h-4 w-4" />
                Avoid This
              </h4>
              <ul className="space-y-2">
                {advice.dont.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personal Reality */}
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
              <AlertTriangle className="h-4 w-4" />
              Real Talk
            </h4>
            <p className="text-sm text-white/50">{advice.reality}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StudentAdviceProps {
  onComplete: () => void;
}

export function StudentAdvice({ onComplete }: StudentAdviceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(adviceList[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">Honest Advice</h1>
            <p className="max-w-2xl text-white/50">
              What I wish someone told me when I started. These lessons were learned the hard
              way—hopefully they save you some time.
            </p>
          </motion.div>

          {/* Advice Cards */}
          <div className="space-y-4">
            {adviceList.map((advice, index) => (
              <AdviceCard
                key={advice.id}
                advice={advice}
                index={index}
                isExpanded={expandedId === advice.id}
                onToggle={() => handleToggle(advice.id)}
              />
            ))}
          </div>

          {/* Final Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-6 text-center"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <Heart className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">The Most Important Advice</h3>
            <p className="mx-auto max-w-lg text-white/50">
              Don't quit. The difference between developers who make it and those who don't isn't
              talent—it's persistence. Keep going, even when it's hard.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-4">
          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
          >
            <span>Ask Me Anything</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentAdvice;
