'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'AI Developer',
    company: 'Sithafal Technologies',
    period: '2024 - Present',
    description:
      'Working on cutting-edge AI solutions and full-stack applications. Focused on integrating LLMs and building responsive user interfaces.',
    highlights: [
      'AI-powered assistant development',
      'Full-stack system architecture',
      'Security first approach',
    ],
    current: true,
  },
  {
    role: 'Computer Engineering Student',
    company: 'Dr. Y.C. James Yen Govt Polytechnic',
    period: '2023 - 2026',
    description:
      'Pursuing Diploma in Computer Engineering with focus on core fundamentals and security.',
    highlights: [
      '96% aggregate score',
      '1st Prize in Regional Technical Innovation',
      'Leader in technical workshops',
    ],
    current: false,
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="relative px-6 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-blue-400">
            Experience
          </span>
          <h2 className="mb-16 text-4xl font-bold text-neutral-900 md:text-5xl">
            Where I've worked
          </h2>

          <div className="relative">
            <div className="absolute bottom-0 left-[27px] top-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500/50 to-transparent" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-0 top-0">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
                        exp.current ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <Briefcase
                        className={`h-5 w-5 ${exp.current ? 'text-blue-600' : 'text-neutral-400'}`}
                      />
                    </div>
                    {exp.current && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500" />
                      </span>
                    )}
                  </div>

                  <motion.div
                    className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
                    whileHover={{ x: 10 }}
                  >
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">{exp.role}</h3>
                        <p className="font-medium text-blue-600">{exp.company}</p>
                      </div>
                      <span className="rounded-full border border-gray-100 bg-gray-50 px-3 py-1 font-mono text-sm text-neutral-500">
                        {exp.period}
                      </span>
                    </div>

                    <p className="mb-6 leading-relaxed text-neutral-600">{exp.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-blue-600"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
