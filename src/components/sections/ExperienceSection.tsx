'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { experience as verifiedExperience } from '@/content/config';
import type { CMSExperience } from '@/types/cms';

interface ExperienceSectionProps {
  experience?: CMSExperience[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps = {}) {
  const activeExperience =
    experience && experience.length > 0
      ? experience.map((e) => ({
          id: e.id,
          role: e.role,
          company: e.company,
          period: e.period,
          description: e.description,
          achievements: e.achievements || [],
          techUsed: e.tech_used || [],
        }))
      : verifiedExperience;
  return (
    <section id="experience" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Professional Track
          </span>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Experience & Milestones
          </h2>
          <p className="mt-3 max-w-xl text-base text-[var(--text-secondary)]">
            Practical engineering experience from building production generative AI workflows to
            academic leadership.
          </p>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Progressive Timeline Spine */}
          <div
            className="absolute bottom-0 left-[19px] top-4 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500/20 sm:left-[23px] md:left-[31px]"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {activeExperience.map((exp, index) => {
              const isCurrent = exp.period.toLowerCase().includes('present');

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative pl-12 sm:pl-14 md:pl-20"
                >
                  {/* Timeline Node Icon & Beacon */}
                  <div className="absolute left-0 top-1" aria-hidden="true">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all sm:h-12 sm:w-12 md:h-16 md:w-16 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-[var(--border-light)] bg-[var(--surface-elevated)]'
                      }`}
                    >
                      <Briefcase
                        className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-[var(--text-muted)]'
                        }`}
                      />
                    </div>

                    {/* Active Ping Beacon */}
                    {isCurrent && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  {/* Semantic Experience Article Card */}
                  <article className="group rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 sm:p-7 md:p-8">
                    {/* Article Header: Role, Company, Period */}
                    <header className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                            {exp.role}
                          </h3>
                          {isCurrent && (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              Active
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
                          {exp.company}
                        </h4>
                      </div>

                      <time
                        dateTime={isCurrent ? '2024-01-01' : '2023-08-01'}
                        className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3.5 py-1 text-xs font-semibold text-[var(--text-muted)]"
                      >
                        <Calendar className="h-3.5 w-3.5 text-blue-500" aria-hidden="true" />
                        <span>{exp.period}</span>
                      </time>
                    </header>

                    {/* Article Body: Role Description */}
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      {exp.description}
                    </p>

                    {/* Bullet Achievements List */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul
                        className="mt-6 space-y-2.5 border-t border-[var(--border-subtle)] pt-5"
                        aria-label={`Key milestones and achievements at ${exp.company}`}
                      >
                        {exp.achievements.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]"
                          >
                            <CheckCircle2
                              className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Article Footer: Technologies Used */}
                    {exp.techUsed && exp.techUsed.length > 0 && (
                      <footer className="mt-6">
                        <ul
                          className="flex flex-wrap gap-2"
                          aria-label={`Technologies leveraged at ${exp.company}`}
                        >
                          {exp.techUsed.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-2.5 py-1 text-xs font-medium text-[var(--text-primary)]"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </footer>
                    )}
                  </article>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
