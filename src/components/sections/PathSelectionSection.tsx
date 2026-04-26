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
    <section className="relative py-32 px-6 overflow-hidden bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <motion.span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-6">
          Choose Your Path
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
          What brings you here?
        </h2>
        <p className="text-lg text-neutral-500 leading-relaxed">
          Select a path that matches your interest. Each journey is tailored to provide the most relevant experience.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <motion.button
              className="w-full text-left group relative p-10 rounded-3xl bg-white border border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label={`Start journey as ${path.title}`}
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(800px circle at 50% 50%, ${path.glowColor}, transparent 40%)`,
                }}
              />

              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${path.gradient} mb-8 shadow-lg shadow-blue-500/20`}>
                  <path.icon className="w-8 h-8 text-white" />
                </div>

                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-neutral-900 mb-2">{path.title}</h3>
                  <p className="text-blue-500 font-medium">{path.subtitle}</p>
                </div>

                <p className="text-neutral-500 mb-8 text-lg leading-relaxed">{path.description}</p>

                <div className="flex items-center gap-3 text-neutral-400 group-hover:text-blue-600 transition-colors">
                  <span className="text-sm font-bold uppercase tracking-widest">Start Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
