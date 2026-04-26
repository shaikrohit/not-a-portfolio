'use client';

/**
 * ============================================================================
 * STUDENT PATH - PREMIUM WARM INSPIRATIONAL DESIGN
 * ============================================================================
 *
 * Warm, friendly, and inspiring welcome experience for students.
 * Features orange/amber color palette with encouraging messaging.
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Rocket,
  BookOpen,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Star,
  Lightbulb,
  Heart,
  Zap,
  Code2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface PathPreview {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

// ============================================================================
// DATA
// ============================================================================

const pathPreviews: PathPreview[] = [
  {
    icon: Rocket,
    title: 'My Journey',
    description: 'How I went from complete beginner to professional developer',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    description: 'The best resources that actually helped me grow',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    icon: Lightbulb,
    title: 'Honest Advice',
    description: 'What I wish someone told me when I started',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    icon: MessageCircle,
    title: 'Q&A',
    description: 'Answers to common questions from aspiring developers',
    color: 'from-rose-500 to-orange-600',
  },
];

const encouragements = [
  'Every expert was once a beginner.',
  'Your journey starts with curiosity.',
  'The best time to start is now.',
  'Consistency beats intensity.',
  "You've got this! 💪",
];

// ============================================================================
// ANIMATED GREETING WITH TYPEWRITER
// ============================================================================

const AnimatedGreeting = memo(function AnimatedGreeting() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % encouragements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-xl font-semibold text-transparent md:text-2xl"
      >
        {encouragements[currentIndex]}
      </motion.div>
    </AnimatePresence>
  );
});

// ============================================================================
// FLOATING SPARKLES
// ============================================================================

const FloatingSparkles = memo(function FloatingSparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 100 + '%',
            y: '100%',
            opacity: 0,
          }}
          animate={{
            y: '-10%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'linear',
          }}
        >
          <Star className="h-3 w-3 text-amber-400/30" />
        </motion.div>
      ))}
    </div>
  );
});

// ============================================================================
// PREMIUM PATH PREVIEW CARD
// ============================================================================

interface PreviewCardProps {
  preview: PathPreview;
  index: number;
}

const PreviewCard = memo(function PreviewCard({ preview, index }: PreviewCardProps) {
  const Icon = preview.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-orange-500/30"
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${preview.color} flex flex-shrink-0 items-center justify-center shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
        <div>
          <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-orange-300">
            {preview.title}
          </h3>
          <p className="text-sm leading-relaxed text-white/50">{preview.description}</p>
        </div>
      </div>

      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StudentWelcomeProps {
  onComplete: () => void;
}

export function StudentWelcome({ onComplete }: StudentWelcomeProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#0f0a05] via-[#130d08] to-[#0a0805] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Warm gradient orbs */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent blur-3xl" />
        <div className="from-amber-600/8 via-yellow-500/4 absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tl to-transparent blur-3xl" />
        <div className="absolute left-0 top-1/2 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-rose-500/5 to-transparent blur-3xl" />

        {/* Floating sparkles */}
        <FloatingSparkles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-5xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
              className="relative mb-8 inline-flex h-24 w-24 items-center justify-center"
            >
              <div className="absolute inset-0 rotate-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600" />
              <div className="absolute inset-0 -rotate-3 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-600" />
              <div className="relative z-10 flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-2xl shadow-orange-500/30">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400"
              >
                <Star className="h-3 w-3 text-yellow-900" />
              </motion.div>
            </motion.div>

            {/* Animated Encouragement */}
            <div className="mb-6 h-12">
              <AnimatedGreeting />
            </div>

            {/* Main Heading */}
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
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Future Developer!
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-2xl text-xl leading-relaxed text-white/60"
            >
              I&apos;m excited you&apos;re here. Let me share my journey, the lessons I&apos;ve
              learned, and practical advice to help you on your path.
            </motion.p>
          </motion.div>

          {/* What You'll Discover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
              <h2 className="text-center text-xl font-semibold text-white">
                What You&apos;ll Discover
              </h2>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {pathPreviews.map((preview, index) => (
                <PreviewCard key={preview.title} preview={preview} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12 grid grid-cols-3 gap-6 rounded-2xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 p-8"
          >
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                5+
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <Code2 className="h-4 w-4 text-orange-400" />
                Years Coding
              </div>
            </div>
            <div className="border-x border-white/[0.06] text-center">
              <div className="mb-2 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                100+
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <Heart className="h-4 w-4 text-amber-400" />
                Students Helped
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Self
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <Zap className="h-4 w-4 text-yellow-400" />
                Taught
              </div>
            </div>
          </motion.div>

          {/* Personal Note - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
          >
            <div className="absolute right-0 top-0 h-32 w-32 bg-gradient-to-bl from-orange-500/10 to-transparent" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                  A Note From Me
                  <Heart className="h-4 w-4 text-rose-400" />
                </h3>
                <p className="text-lg leading-relaxed text-white/60">
                  Learning to code isn&apos;t about being smart—it&apos;s about being persistent. I
                  failed countless times, got confused constantly, and questioned my choices often.
                  But I kept going, and now I get paid to do what I love.
                  <span className="font-medium text-orange-400"> If I can do it, so can you.</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
        className="sticky bottom-0 border-t border-white/[0.06] bg-black/80 px-6 py-5 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-center">
          <button
            onClick={onComplete}
            className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25"
          >
            <span>Start My Journey</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentWelcome;
