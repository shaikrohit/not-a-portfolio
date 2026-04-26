'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, GraduationCap, Compass, ArrowRight } from 'lucide-react';

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
  return (
    <section className="relative overflow-hidden bg-gray-50/50 px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="mx-auto mb-20 max-w-3xl text-center"
      >
        <motion.span className="mb-6 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-600">
          Choose Your Path
        </motion.span>
        <h2 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
          What brings you here?
        </h2>
        <p className="text-lg leading-relaxed text-neutral-500">
          Select a path that matches your interest. Each journey is tailored to provide the most
          relevant experience.
        </p>
      </motion.div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <motion.button
              className="group relative w-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 text-left transition-all duration-500 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
              }
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
                  className={`inline-flex rounded-2xl bg-gradient-to-br p-4 ${path.gradient} mb-8 shadow-lg shadow-blue-500/20`}
                >
                  <path.icon className="h-8 w-8 text-white" />
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 text-3xl font-bold text-neutral-900">{path.title}</h3>
                  <p className="font-medium text-blue-500">{path.subtitle}</p>
                </div>

                <p className="mb-8 text-lg leading-relaxed text-neutral-500">{path.description}</p>

                <div className="flex items-center gap-3 text-neutral-400 transition-colors group-hover:text-blue-600">
                  <span className="text-sm font-bold uppercase tracking-widest">Start Journey</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
