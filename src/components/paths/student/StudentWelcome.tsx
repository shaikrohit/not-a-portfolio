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
  Code2
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
  "Every expert was once a beginner.",
  "Your journey starts with curiosity.",
  "The best time to start is now.",
  "Consistency beats intensity.",
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
        className="text-xl md:text-2xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent font-semibold"
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '100%',
            opacity: 0 
          }}
          animate={{ 
            y: '-10%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'linear'
          }}
        >
          <Star className="w-3 h-3 text-amber-400/30" />
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
      className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start gap-4">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${preview.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors">{preview.title}</h3>
          <p className="text-sm text-white/50 leading-relaxed">{preview.description}</p>
        </div>
      </div>
      
      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a05] via-[#130d08] to-[#0a0805] text-white flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Warm gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-orange-600/10 via-amber-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-amber-600/8 via-yellow-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-rose-500/5 to-transparent rounded-full blur-3xl" />
        
        {/* Floating sparkles */}
        <FloatingSparkles />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-5xl mx-auto w-full">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
              className="relative inline-flex items-center justify-center w-24 h-24 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl -rotate-3" />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              
              {/* Decorative elements */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Star className="w-3 h-3 text-yellow-900" />
              </motion.div>
            </motion.div>

            {/* Animated Encouragement */}
            <div className="h-12 mb-6">
              <AnimatedGreeting />
            </div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.95] tracking-tight"
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
              className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              I&apos;m excited you&apos;re here. Let me share my journey, the lessons I&apos;ve learned, 
              and practical advice to help you on your path.
            </motion.p>
          </motion.div>

          {/* What You'll Discover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500/50" />
              <h2 className="text-xl font-semibold text-white text-center">
                What You&apos;ll Discover
              </h2>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500/50" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
            className="grid grid-cols-3 gap-6 p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-500/20 mb-12"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">5+</div>
              <div className="text-sm text-white/50 flex items-center justify-center gap-2">
                <Code2 className="w-4 h-4 text-orange-400" />
                Years Coding
              </div>
            </div>
            <div className="text-center border-x border-white/[0.06]">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-sm text-white/50 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-amber-400" />
                Students Helped
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">Self</div>
              <div className="text-sm text-white/50 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Taught
              </div>
            </div>
          </motion.div>

          {/* Personal Note - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  A Note From Me
                  <Heart className="w-4 h-4 text-rose-400" />
                </h3>
                <p className="text-white/60 leading-relaxed text-lg">
                  Learning to code isn&apos;t about being smart—it&apos;s about being persistent. 
                  I failed countless times, got confused constantly, and questioned my choices often.
                  But I kept going, and now I get paid to do what I love.
                  <span className="text-orange-400 font-medium"> If I can do it, so can you.</span>
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
        className="sticky bottom-0 px-6 py-5 bg-black/80 backdrop-blur-xl border-t border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <button
            onClick={onComplete}
            className="group flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Start My Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentWelcome;
