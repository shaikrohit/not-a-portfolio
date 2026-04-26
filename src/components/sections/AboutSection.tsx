'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Zap, Download } from 'lucide-react';
import { getGitHubStats } from '@/app/_actions/github';

export function AboutSection() {
  const [repoCount, setRepoCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const stats = await getGitHubStats('shaikrohit');
      setRepoCount(stats.repoCount);
    }
    fetchStats();
  }, []);
  return (
    <section id="about" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-blue-400">
            About
          </span>

          <div className="grid items-start gap-16 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="mb-8 text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
                I build digital experiences that make a{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  difference
                </span>
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-neutral-600">
                <p>
                  I am a highly motivated Computer Engineering student at Dr. Y.C. James Yen
                  Government Polytechnic, with a stellar academic record (91%). My journey in tech
                  is driven by a deep curiosity for how things work, leading me to specialize in
                  Cybersecurity and Network Security.
                </p>
                <p>
                  As an AI Developer at Sithafal Technologies, I bridge the gap between complex
                  technical requirements and user-friendly interfaces. I believe in writing code
                  that is not just functional, but secure by design.
                </p>
                <p>
                  From mastering penetration testing to building AI-driven systems, I am constantly
                  pushing the boundaries of what I can build and protect.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                {[
                  { value: '91%', label: 'Academic Score' },
                  {
                    value: repoCount !== null ? `${repoCount}+` : '...',
                    label: 'GitHub Repositories',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className="mb-2 text-3xl font-bold text-neutral-900 md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-2">
              {[
                { icon: MapPin, label: 'Location', value: 'Kuppam, India' },
                { icon: Calendar, label: 'Experience', value: '2+ Years' },
                { icon: Zap, label: 'Focus', value: 'Cybersecurity & Web' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <item.icon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-neutral-500">{item.label}</p>
                      <p className="font-medium text-neutral-900">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.a
                href="/resume.pdf"
                download
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-500 bg-blue-600 p-6 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Download Resume"
              >
                <Download className="h-5 w-5 group-hover:animate-bounce" />
                <span className="font-medium">Download Resume</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
