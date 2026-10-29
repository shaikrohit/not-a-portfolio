'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { techStack } from '@/content/config';
import type { Skill } from '@/types';
import type { CMSSkill } from '@/types/cms';
import { SkillDetailPanel } from '@/components/skills/SkillDetailPanel';
import { SkillOrbit } from '@/components/skills/SkillOrbit';

interface SkillsSectionProps {
  skills?: CMSSkill[];
}

export function SkillsSection({ skills }: SkillsSectionProps = {}) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'orbit'>('grid');

  const activeSkills: Skill[] =
    skills && skills.length > 0
      ? skills.map((cs) => ({
          name: cs.name,
          category: cs.category,
          proficiency: cs.proficiency,
          yearsUsed: cs.years_experience,
          reasoning: cs.reasoning || '',
          businessOutcome: cs.business_outcome || '',
        }))
      : techStack;

  const categories = [
    { id: 'all', label: 'All Technologies' },
    { id: 'frontend', label: 'Frontend & UI' },
    { id: 'backend', label: 'Backend & AI' },
    { id: 'devops', label: 'DevOps & Systems' },
  ];

  const filteredSkills = activeSkills.filter((skill) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'frontend') {
      return (
        skill.category === 'framework' ||
        skill.name.includes('React') ||
        skill.name.includes('Script') ||
        skill.name.includes('Tailwind')
      );
    }
    if (activeCategory === 'backend') {
      return (
        skill.category === 'language' ||
        skill.name.includes('Python') ||
        skill.name.includes('Supabase') ||
        skill.name.includes('GenAI')
      );
    }
    if (activeCategory === 'devops') {
      return (
        skill.category === 'tool' ||
        skill.name.includes('Docker') ||
        skill.name.includes('Git') ||
        skill.name.includes('Linux') ||
        skill.name.includes('Capacitor')
      );
    }
    return true;
  });

  return (
    <section id="skills" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-3 inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Technical Stack
            </span>
            <h2 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
              Proven Technologies & Systems
            </h2>
            <p className="mt-3 max-w-xl text-base text-[var(--text-secondary)]">
              Verified stack used in real production apps, Dockerized deployments, and AI hackathon
              projects. Click any skill to inspect the architectural reasoning.
            </p>
          </motion.div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Interactive Grid
            </button>
            <button
              onClick={() => setViewMode('orbit')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                viewMode === 'orbit'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Orbital Radar
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'border border-blue-500/40 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-blue-500/20 hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content View */}
        {viewMode === 'orbit' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SkillOrbit skills={filteredSkills} onSelectSkill={(s) => setSelectedSkill(s)} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div
                  onClick={() => setSelectedSkill(skill)}
                  className="group relative flex h-full cursor-pointer flex-col justify-between rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:p-6"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedSkill(skill);
                    }
                  }}
                  aria-label={`View details for ${skill.name}`}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400">
                        {skill.name.includes('Docker')
                          ? '🐳'
                          : skill.name.includes('React')
                            ? '⚛️'
                            : skill.name.includes('Python')
                              ? '🐍'
                              : skill.name.includes('AI')
                                ? '🤖'
                                : skill.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-2.5 py-1 text-xs font-semibold capitalize text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {skill.proficiency}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-primary)] transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {skill.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {skill.reasoning}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-xs font-medium text-[var(--text-muted)]">
                    <span>
                      {skill.yearsUsed} {skill.yearsUsed === 1 ? 'Year' : 'Years'} Practical
                    </span>
                    <span className="inline-flex items-center gap-1 text-blue-600 group-hover:underline dark:text-blue-400">
                      Inspect <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Skill Details Modal */}
        <SkillDetailPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      </div>
    </section>
  );
}

export default SkillsSection;
