'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Star, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--border-light)] bg-[var(--surface-elevated)] p-6 shadow-2xl sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-overlay)] hover:text-[var(--text-primary)]"
              aria-label="Close project modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {project.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    <Sparkles className="h-3 w-3" /> Featured Project
                  </span>
                )}
                {project.metrics?.stars ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Star className="h-3 w-3" /> {project.metrics.stars} Stars
                  </span>
                ) : null}
              </div>

              <h3
                id="modal-project-title"
                className="text-3xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                {project.title}
              </h3>
              <p className="mt-1 text-base text-[var(--text-secondary)]">{project.description}</p>
            </div>

            {/* Deep Content */}
            <div className="space-y-6">
              {/* Overview / Story */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Project Overview & Context
                </h4>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.longDescription}
                </p>
              </div>

              {/* Problem Solved */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Problem Solved & Value Delivered</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.problemSolved}
                </p>
              </div>

              {/* Architecture Notes */}
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  <Cpu className="h-4 w-4" />
                  <span>Architecture & Engineering Notes</span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.architectureNotes}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Technologies & Tools Applied
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
              <div className="flex items-center gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500"
                >
                  <Github className="h-4 w-4" />
                  <span>View Source Code</span>
                </a>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--surface-base)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-blue-500/40"
                  >
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    <span>Live Application</span>
                  </a>
                )}
              </div>

              <button
                onClick={onClose}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ProjectModal;
