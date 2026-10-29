'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Briefcase,
  Boxes,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { CMSAchievement } from '@/types/cms';

interface AchievementsSectionProps {
  achievements?: CMSAchievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps = {}) {
  const iconList = [Trophy, Target, Briefcase, Boxes, Smartphone, ShieldCheck];
  const colorList = [
    'from-amber-500 to-yellow-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-indigo-500',
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-red-500 to-rose-500',
  ];

  const defaultAchievements = [
    {
      icon: Trophy,
      color: 'from-amber-500 to-yellow-500',
      badge: 'Hackathon Champion',
      title: '1st Prize — Regional Technical Innovation',
      description:
        'Awarded 1st place for designing AI-enabled smart stadium operations and crowd logistics workflows for FIFA 2026.',
    },
    {
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Academic Distinction',
      title: '96% Academic Aggregate Score',
      description:
        'Sustained top-tier academic distinction throughout the Computer Engineering Diploma at Dr. Y.C. James Yen Govt Polytechnic.',
    },
    {
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500',
      badge: 'Industry Experience',
      title: 'AI Developer / Intern @ Sithafal Technologies',
      description:
        'Spearheaded generative AI assistant integrations, prompt engineering flows, and responsive React frontend architecture in Tirupati.',
    },
    {
      icon: Boxes,
      color: 'from-cyan-500 to-blue-500',
      badge: 'DevOps & Architecture',
      title: 'Docker Production Containerization',
      description:
        'Architected multi-stage Docker builds and Nginx deployment pipelines for CarbonSphere, streamlining containerized delivery.',
    },
    {
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      badge: 'Mobile Engineering',
      title: 'Cross-Platform Mobile with Capacitor',
      description:
        'Engineered touch-optimized web applications and packaged cross-platform mobile distributions for native environments.',
    },
    {
      icon: ShieldCheck,
      color: 'from-red-500 to-rose-500',
      badge: 'Security Foundation',
      title: 'Cybersecurity & Ethical Defense',
      description:
        'Practical expertise in penetration testing, network protocols, input sanitization, and OWASP top security best practices.',
    },
  ];

  const activeAchievements =
    achievements && achievements.length > 0
      ? achievements.map((a, idx) => ({
          icon: iconList[idx % iconList.length] || Trophy,
          color: colorList[idx % colorList.length] || 'from-amber-500 to-yellow-500',
          badge: a.badge || 'Verified Achievement',
          title: a.title,
          description: a.description,
          verificationUrl: a.verification_url,
        }))
      : defaultAchievements;

  return (
    <section id="achievements" className="relative px-4 py-20 sm:px-6 sm:py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Honors & Accolades
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Achievements & Milestones
          </h2>
          <p className="mt-3 max-w-xl text-base text-[var(--text-secondary)]">
            Recognitions across academic excellence, technical innovation hackathons, and real-world
            software delivery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeAchievements.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 sm:p-7"
            >
              <div>
                {/* Article Header: Icon & Badge */}
                <header className="mb-5 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-md`}
                    aria-hidden="true"
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    {item.badge}
                  </span>
                </header>

                {/* Article Body: Title & Summary */}
                <h3 className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>

              {/* Article Footer: Credential Status */}
              <footer className="mt-6 flex items-center gap-1.5 border-t border-[var(--border-subtle)] pt-4 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Verified Credential</span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AchievementsSection;
