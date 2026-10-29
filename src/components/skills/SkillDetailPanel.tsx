'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Lightbulb, TrendingUp, Calendar } from 'lucide-react';
import type { Skill } from '@/types';

interface SkillDetailPanelProps {
  skill: Skill | null;
  onClose: () => void;
}

export function SkillDetailPanel({ skill, onClose }: SkillDetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {skill && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="skill-detail-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--border-light)] bg-[var(--surface-elevated)] p-6 shadow-2xl md:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
              aria-label="Close skill details"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-xl font-bold text-blue-600 dark:text-blue-400">
                {skill.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {skill.category}
                </span>
                <h3
                  id="skill-detail-title"
                  className="mt-1 text-2xl font-bold text-[var(--text-primary)]"
                >
                  {skill.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* Proficiency and Experience Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Proficiency</span>
                  </div>
                  <p className="mt-1 font-bold capitalize text-[var(--text-primary)]">
                    {skill.proficiency}
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Experience</span>
                  </div>
                  <p className="mt-1 font-bold text-[var(--text-primary)]">
                    {skill.yearsUsed} {skill.yearsUsed === 1 ? 'Year' : 'Years'}
                  </p>
                </div>
              </div>

              {/* Engineering Reasoning */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>Why I Chose This Technology</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {skill.reasoning}
                </p>
              </div>

              {/* Business Outcome */}
              {skill.businessOutcome && (
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Business & Practical Outcome</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {skill.businessOutcome}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SkillDetailPanel;
