'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skillCategories = [
  {
    name: 'Development',
    icon: '⚙️',
    skills: [
      { name: 'JavaScript/React', level: 85 },
      { name: 'Kotlin/Android', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'C/Java', level: 75 },
    ],
  },
  {
    name: 'Security',
    icon: '🛡️',
    skills: [
      { name: 'Penetration Testing', level: 78 },
      { name: 'Network Security', level: 75 },
      { name: 'Cybersecurity', level: 80 },
      { name: 'Ethical Hacking', level: 72 },
    ],
  },
  {
    name: 'Tools & Platforms',
    icon: '🛠️',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'Azure DevOps', level: 70 },
      { name: 'Docker', level: 75 },
      { name: 'Linux', level: 80 },
    ],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
            Skills
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-16">
            Technologies I work with
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {skillCategories.map((category, catIndex) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl" role="img" aria-label={category.name}>{category.icon}</span>
                  <h3 className="text-xl font-bold text-neutral-900">{category.name}</h3>
                </div>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-700 font-medium">{skill.name}</span>
                        <span className="text-sm text-neutral-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: catIndex * 0.1 + skillIndex * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
