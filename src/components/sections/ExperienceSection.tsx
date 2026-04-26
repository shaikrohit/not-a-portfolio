'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'AI Developer',
    company: 'Sithafal Technologies',
    period: '2024 - Present',
    description: 'Working on cutting-edge AI solutions and full-stack applications. Focused on integrating LLMs and building responsive user interfaces.',
    highlights: ['AI-powered assistant development', 'Full-stack system architecture', 'Security first approach'],
    current: true,
  },
  {
    role: 'Computer Engineering Student',
    company: 'Dr. Y.C. James Yen Govt Polytechnic',
    period: '2023 - 2026',
    description: 'Pursuing Diploma in Computer Engineering with focus on core fundamentals and security.',
    highlights: ['96% aggregate score', '1st Prize in Regional Technical Innovation', 'Leader in technical workshops'],
    current: false,
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-16">
            Where I've worked
          </h2>
          
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-purple-500/50 to-transparent" />
            
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
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-colors ${
                      exp.current 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <Briefcase className={`w-5 h-5 ${exp.current ? 'text-blue-600' : 'text-neutral-400'}`} />
                    </div>
                    {exp.current && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                      </span>
                    )}
                  </div>

                  <motion.div 
                    className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">{exp.role}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-neutral-500 font-mono bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{exp.period}</span>
                    </div>
                    
                    <p className="text-neutral-600 mb-6 leading-relaxed">{exp.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((h, i) => (
                        <span 
                          key={i} 
                          className="px-3 py-1.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-100"
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
