'use client';

/**
 * ============================================================================
 * RECRUITER PATH - ACHIEVEMENTS STEP
 * ============================================================================
 *
 * Notable achievements, certifications, and recognition
 * with metrics and impact quantification.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Trophy,
  Award,
  Star,
  TrendingUp,
  Users,
  Zap,
  Target,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Achievement {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  metric: string;
  year: string;
  category: 'impact' | 'recognition' | 'certification';
}

// ============================================================================
// DATA
// ============================================================================

const achievements: Achievement[] = [
  {
    id: '1',
    icon: TrendingUp,
    title: 'Performance Optimization Lead',
    description:
      'Led frontend modernization project that improved Core Web Vitals across all products',
    metric: '65% faster load times',
    year: '2023',
    category: 'impact',
  },
  {
    id: '2',
    icon: Users,
    title: 'Team Growth Champion',
    description: 'Mentored 5 junior developers through structured learning paths',
    metric: '3 promoted to senior',
    year: '2023',
    category: 'impact',
  },
  {
    id: '3',
    icon: Trophy,
    title: 'Innovation Award',
    description: 'Recognized for creating company-wide component library',
    metric: '40% faster development',
    year: '2022',
    category: 'recognition',
  },
  {
    id: '4',
    icon: Zap,
    title: 'Scale Achievement',
    description: 'Architected system that handled 100x user growth without downtime',
    metric: '1K → 100K users',
    year: '2021',
    category: 'impact',
  },
  {
    id: '5',
    icon: Award,
    title: 'AWS Solutions Architect',
    description: 'Professional certification for designing distributed systems on AWS',
    metric: 'Professional Level',
    year: '2022',
    category: 'certification',
  },
  {
    id: '6',
    icon: Target,
    title: 'Zero-Downtime Deployment',
    description: 'Implemented CI/CD pipeline reducing deployment risk to zero',
    metric: '0 production incidents',
    year: '2022',
    category: 'impact',
  },
];

const certifications = [
  { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', year: '2022' },
  { name: 'Professional Scrum Master I', issuer: 'Scrum.org', year: '2021' },
  { name: 'GraphQL Professional', issuer: 'Apollo GraphQL', year: '2021' },
];

const contributions = [
  { type: 'Open Source', count: '15+', description: 'Pull requests merged' },
  { type: 'Tech Talks', count: '8', description: 'Conference presentations' },
  { type: 'Blog Posts', count: '25+', description: 'Technical articles written' },
];

// ============================================================================
// ACHIEVEMENT CARD
// ============================================================================

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
}

const AchievementCard = memo(function AchievementCard({
  achievement,
  index,
}: AchievementCardProps) {
  const Icon = achievement.icon;

  const categoryColors = {
    impact: 'from-blue-500 to-blue-400',
    recognition: 'from-yellow-500 to-yellow-400',
    certification: 'from-green-500 to-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10"
    >
      {/* Background Glow */}
      <div
        className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${categoryColors[achievement.category]} opacity-5 blur-3xl transition-opacity group-hover:opacity-10`}
      />

      {/* Content */}
      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`h-12 w-12 rounded-xl bg-gradient-to-br ${categoryColors[achievement.category]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-sm text-white/30">{achievement.year}</span>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-white">{achievement.title}</h3>
        <p className="mb-4 text-sm text-white/40">{achievement.description}</p>

        {/* Metric Highlight */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5">
          <Star className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">{achievement.metric}</span>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// CERTIFICATION BADGE
// ============================================================================

interface CertificationBadgeProps {
  cert: (typeof certifications)[0];
  index: number;
}

const CertificationBadge = memo(function CertificationBadge({
  cert,
  index,
}: CertificationBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
        <BookOpen className="h-5 w-5 text-green-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-white">{cert.name}</div>
        <div className="text-xs text-white/30">
          {cert.issuer} • {cert.year}
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecruiterAchievementsProps {
  onComplete: () => void;
}

export function RecruiterAchievements({ onComplete }: RecruiterAchievementsProps) {
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
              Achievements & Recognition
            </h1>
            <p className="max-w-2xl text-white/50">
              Measurable impact and recognition earned through consistent delivery and technical
              excellence.
            </p>
          </motion.div>

          {/* Main Achievements Grid */}
          <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Award className="h-5 w-5 text-green-400" />
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <CertificationBadge key={cert.name} cert={cert} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Community Contributions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
            >
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Community Contributions
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {contributions.map((contrib) => (
                  <div key={contrib.type} className="rounded-xl bg-white/[0.02] p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{contrib.count}</div>
                    <div className="mt-1 text-sm font-medium text-white">{contrib.type}</div>
                    <div className="text-xs text-white/30">{contrib.description}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-sm text-white/30">All achievements backed by verifiable references.</p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
          >
            <span>Get In Touch</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAchievements;
