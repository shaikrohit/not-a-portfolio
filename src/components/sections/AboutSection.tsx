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
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
            About
          </span>

          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-8">
                I build digital experiences that make a{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  difference
                </span>
              </h2>
              
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                <p>
                  I am a highly motivated Computer Engineering student at Dr. Y.C. James Yen Government Polytechnic, 
                  with a stellar academic record (91%). My journey in tech is driven by a deep curiosity for how 
                  things work, leading me to specialize in Cybersecurity and Network Security.
                </p>
                <p>
                  As an AI Developer at Sithafal Technologies, I bridge the gap between complex technical 
                  requirements and user-friendly interfaces. I believe in writing code that is not just 
                  functional, but secure by design.
                </p>
                <p>
                  From mastering penetration testing to building AI-driven systems, 
                  I am constantly pushing the boundaries of what I can build and protect.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                {[
                  { value: '91%', label: 'Academic Score' },
                  { value: repoCount !== null ? `${repoCount}+` : '...', label: 'GitHub Repositories' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
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
                  className="group p-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 border border-gray-200 hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50">
                      <item.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
                      <p className="text-neutral-900 font-medium">{item.value}</p>
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
                className="group flex items-center justify-center gap-3 w-full p-6 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-500 hover:bg-blue-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Download Resume"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span className="font-medium">Download Resume</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
