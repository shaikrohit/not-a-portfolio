'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Zap,
  Download,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useVisitorStore } from '@/store';
import { profile } from '@/content/config';
import { getGitHubStats } from '@/app/_actions/github';

export function AboutSection() {
  const { visitorType } = useVisitorStore();
  const [repoCount, setRepoCount] = useState<number>(17);

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getGitHubStats('shaikrohit');
        if (stats?.repoCount) {
          setRepoCount(stats.repoCount);
        }
      } catch {
        // Fallback to verified 17 repos
        setRepoCount(17);
      }
    }
    fetchStats();
  }, []);

  const activeIntroduction =
    visitorType && profile.introduction[visitorType]
      ? profile.introduction[visitorType]
      : profile.introduction.developer;

  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            About Me
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Passionate Developer.{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Disciplined Builder.
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Card 1: Main Introduction (Spans 2 cols on md, 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 sm:p-8 md:col-span-2 lg:col-span-2"
          >
            {/* Ambient subtle glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  {/* Avatar Badge with Animated Conic Gradient Border */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20">
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[var(--surface-base)] text-xl font-bold text-blue-600 dark:text-blue-400">
                      SR
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Shaik Rohit</h3>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Full Stack & AI Developer
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
                  {activeIntroduction.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
                </div>
              </div>

              {/* Persona Tag Indicator */}
              <div className="mt-8 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <Code2 className="h-4 w-4 text-blue-500" />
                <span>
                  Tailored for: {visitorType ? visitorType.toUpperCase() : 'DEVELOPER'} JOURNEY
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Location & Work */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl sm:p-8 md:col-span-1 lg:col-span-1"
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Location & Origin
              </h3>
              <p className="text-xl font-bold text-[var(--text-primary)]">Kuppam, India</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Andhra Pradesh, India (UTC+5:30)
              </p>
            </div>

            <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <span>Interned @ Sithafal Tech</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Education */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl sm:p-8 md:col-span-1 lg:col-span-1"
          >
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Education
              </h3>
              <p className="text-xl font-bold text-[var(--text-primary)]">Dr. Y.C. James Yen</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Govt Polytechnic (2023 - 2026)
              </p>
              <p className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                Diploma in Computer Engineering
              </p>
            </div>

            <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <Award className="h-4 w-4" />
                <span>96% Aggregate Distinction</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Stats Counter 1 - Academic Score */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 md:col-span-1 lg:col-span-1"
          >
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Academic Record
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
              <AnimatedCounter value={96} suffix="%" />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              State Board Examination Aggregate
            </p>
          </motion.div>

          {/* Card 5: Stats Counter 2 - Repos */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 md:col-span-1 lg:col-span-1"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <span>GitHub Repos</span>
              <FolderGit2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
              <AnimatedCounter value={repoCount} suffix="+" />
            </div>
            <a
              href="https://github.com/shaikrohit"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Verify on GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </motion.div>

          {/* Card 6: Stats Counter 3 - Practical Experience */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 md:col-span-1 lg:col-span-1"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <span>Engineering</span>
              <Calendar className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
              <AnimatedCounter value={2} suffix="+ Yrs" />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">Active Full-Stack & AI Dev</p>
          </motion.div>

          {/* Card 7: Stats Counter 4 - Innovation Award */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 md:col-span-1 lg:col-span-1"
          >
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <span>Innovation</span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
              <AnimatedCounter value={1} prefix="#" suffix="st" />
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">
              Regional Technical Innovation
            </p>
          </motion.div>

          {/* Card 8: Fun Facts Micro-Cards (Spans 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 sm:p-8 md:col-span-2 lg:col-span-2"
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Core Engineering Focus & Traits
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { title: '🌙 Night Owl', desc: 'Peak flow hours for deep systems focus' },
                { title: '🐳 Docker Architect', desc: 'Multi-stage containerized deployments' },
                { title: '🔐 Security First', desc: 'Zero-trust input & schema verification' },
              ].map((fact, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4 transition-transform hover:-translate-y-1"
                >
                  <p className="font-semibold text-[var(--text-primary)]">{fact.title}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{fact.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 9: Resume Download & Action Card (Spans 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 p-5 backdrop-blur-xl sm:p-8 md:col-span-3 lg:col-span-2"
          >
            <div className="w-full text-left">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Zap className="h-4 w-4" />
                <span>Verified Credentials</span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                Curriculum Vitae & Profile
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Review complete technical qualifications, coursework, and verified recommendations.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <motion.a
                href={profile.resumeUrl}
                download="Shaik_Rohit_Resume.pdf"
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Download Official Resume PDF"
              >
                <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Download Resume
              </motion.a>

              <motion.a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--surface-base)] px-6 py-3.5 font-semibold text-[var(--text-primary)] transition-all hover:border-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Connect on LinkedIn"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="h-4 w-4 text-blue-500" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
