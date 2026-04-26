'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin } from 'lucide-react';

export function HeroSection() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.9]);

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <motion.section 
      style={{ opacity, y, scale }}
      className="min-h-screen flex items-center justify-center relative px-6 pt-20"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Status Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-10"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
          </span>
          <span className="text-sm text-blue-300/90 font-medium">Open to new opportunities</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="overflow-hidden mb-6">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-6xl md:text-8xl font-bold tracking-tight"
          >
            <span className="text-neutral-900">Shaik </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rohit
            </span>
          </motion.h1>
        </motion.div>

        {/* Role */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-2xl md:text-3xl text-neutral-500 font-light mb-8"
        >
          Full Stack Developer
        </motion.p>

        {/* Description */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          Specializing in <b>Cybersecurity, Penetration Testing, and Full Stack Development</b>.
          Currently crafting secure and high-performance digital experiences while pursuing 
          my Computer Engineering degree.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View My Projects"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 rounded-xl bg-white shadow ring-1 ring-black/5 hover:bg-gray-100 text-neutral-900 font-medium border border-gray-200 hover:border-gray-300 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Contact Me"
          >
            <span className="flex items-center gap-2">
              Get in Touch
              <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </span>
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex items-center justify-center gap-6 mt-16"
        >
          {[
            { icon: Github, href: 'https://github.com/shaikrohit', label: 'GitHub' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/rohitshaik', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:shaik.rohit.official@gmail.com', label: 'Email' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative p-3 rounded-full bg-white shadow ring-1 ring-black/5 border border-gray-200 hover:border-gray-300 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <motion.span 
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-neutral-500 uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500/30 to-transparent" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
