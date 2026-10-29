'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, GraduationCap, Compass, ArrowRight } from 'lucide-react';
import { useVisitorStore } from '@/store';
import type { VisitorType } from '@/types';

const paths = [
  {
    id: 'developer',
    icon: Code2,
    title: 'Developer',
    subtitle: 'Technical Deep Dive',
    description: 'Explore architecture decisions, code philosophy, and engineering challenges.',
    gradient: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(0, 212, 255, 0.3)',
  },
  {
    id: 'recruiter',
    icon: Briefcase,
    title: 'Recruiter',
    subtitle: 'Executive Summary',
    description: 'Quick overview of experience, skills, and professional achievements.',
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    subtitle: 'Learning Journey',
    description: 'My path from beginner to professional, with honest advice for you.',
    gradient: 'from-orange-500 to-amber-500',
    glowColor: 'rgba(249, 115, 22, 0.3)',
  },
  {
    id: 'explorer',
    icon: Compass,
    title: 'Explorer',
    subtitle: 'Discover Freely',
    description: 'Wander through projects, thoughts, and experiments at your own pace.',
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'rgba(168, 85, 247, 0.3)',
  },
];

export function PathSelectionSection() {
  const setVisitorType = useVisitorStore((state) => state.setVisitorType);

  const handleSelectPath = (pathId: string) => {
    setVisitorType(pathId as VisitorType);
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="paths"
      className="bg-[var(--surface-elevated)]/40 relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 md:py-36"
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="mx-auto mb-16 max-w-3xl text-center"
      >
        <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Choose Your Path
        </span>
        <h2 className="mb-4 font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
          What brings you here?
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          Select a path tailored to your interest. The narrative and technical depth adjust to your
          perspective.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <motion.button
              className="group relative w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 text-left backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:p-8 md:p-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPath(path.id)}
              aria-label={`Start journey as ${path.title}`}
            >
              <motion.div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(800px circle at 50% 50%, ${path.glowColor}, transparent 40%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br p-4 ${path.gradient} mb-6 shadow-lg shadow-blue-500/20`}
                >
                  <path.icon className="h-7 w-7 text-white" />
                </div>

                <div className="mb-4">
                  <h3 className="mb-1 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                    {path.title}
                  </h3>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">{path.subtitle}</p>
                </div>

                <p className="mb-8 text-base leading-relaxed text-[var(--text-secondary)]">
                  {path.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <span>Start Journey</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
