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
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Status Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-10 inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-5 py-2.5"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
          </span>
          <span className="text-sm font-medium text-blue-300/90">Open to new opportunities</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="mb-6 overflow-hidden">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-6xl font-bold tracking-tight md:text-8xl"
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
          className="mb-8 text-2xl font-light text-neutral-500 md:text-3xl"
        >
          Full Stack Developer
        </motion.p>

        {/* Description */}
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-neutral-500 md:text-xl"
        >
          Specializing in <b>Cybersecurity, Penetration Testing, and Full Stack Development</b>.
          Currently crafting secure and high-performance digital experiences while pursuing my
          Computer Engineering degree.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-medium text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View My Projects"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group rounded-xl border border-gray-200 bg-white px-8 py-4 font-medium text-neutral-900 shadow ring-1 ring-black/5 transition-all hover:border-gray-300 hover:bg-gray-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Contact Me"
          >
            <span className="flex items-center gap-2">
              Get in Touch
              <Mail className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </span>
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-16 flex items-center justify-center gap-6"
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
              className="group relative rounded-full border border-gray-200 bg-white p-3 shadow ring-1 ring-black/5 transition-all hover:border-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5 text-neutral-500 transition-colors group-hover:text-neutral-700" />
              <motion.span
                className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
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
          <span className="text-xs uppercase tracking-widest text-neutral-500">Scroll</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-blue-500/30 to-transparent" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
