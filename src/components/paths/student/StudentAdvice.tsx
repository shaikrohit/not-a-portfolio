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
  Users
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
    reality: 'I made more progress coding 30 minutes daily for 6 months than I did in my first year of sporadic "when I feel like it" learning.',
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
    reality: 'Tutorial Hell is real. I spent 6 months watching tutorials and couldn\'t build a simple form. The day I started building without guidance, everything changed.',
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
      'Compare your beginning to someone\'s middle',
    ],
    reality: 'The developers I met online became my mentors, collaborators, and friends. Some even helped me get job interviews.',
  },
  {
    id: 'imposter',
    icon: Heart,
    title: 'Embrace Imposter Syndrome',
    summary: 'Everyone feels it—even senior developers',
    do: [
      'Accept that confusion is part of the process',
      'Document your wins, no matter how small',
      'Remember: if you\'re confused, you\'re learning',
    ],
    dont: [
      'Let self-doubt stop you from applying to jobs',
      'Compare yourself to people with years more experience',
      'Think "real" developers don\'t Google things',
    ],
    reality: 'I still Google basic things. I still feel like I don\'t belong in technical discussions. But I\'ve shipped products, mentored developers, and gotten paid. Feelings aren\'t facts.',
  },
  {
    id: 'fundamentals',
    icon: Lightbulb,
    title: 'Master Fundamentals First',
    summary: 'Frameworks change; principles don\'t',
    do: [
      'Learn vanilla JavaScript before React',
      'Understand how the web works (HTTP, DNS, etc.)',
      'Practice problem-solving and algorithms',
    ],
    dont: [
      'Jump to frameworks before understanding basics',
      'Learn the newest framework just because it\'s popular',
      'Skip data structures because they\'re "boring"',
    ],
    reality: 'When I finally understood JavaScript fundamentals, learning React took days instead of months. Fundamentals are the shortcut everyone skips.',
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

const AdviceCard = memo(function AdviceCard({ advice, index, isExpanded, onToggle }: AdviceCardProps) {
  const Icon = advice.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{advice.title}</h3>
            <p className="text-sm text-white/40">{advice.summary}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4 text-white/30 rotate-90" />
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
        <div className="px-5 pb-5 space-y-4">
          {/* Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Do's */}
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Do This
              </h4>
              <ul className="space-y-2">
                {advice.do.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Avoid This
              </h4>
              <ul className="space-y-2">
                {advice.dont.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personal Reality */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
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
              Honest Advice
            </h1>
            <p className="text-white/50 max-w-2xl">
              What I wish someone told me when I started. These lessons were learned 
              the hard way—hopefully they save you some time.
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
            className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
              <Heart className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              The Most Important Advice
            </h3>
            <p className="text-white/50 max-w-lg mx-auto">
              Don't quit. The difference between developers who make it and those who don't 
              isn't talent—it's persistence. Keep going, even when it's hard.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>Ask Me Anything</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentAdvice;
