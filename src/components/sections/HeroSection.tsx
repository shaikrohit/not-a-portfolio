'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Github, Linkedin, Sparkles, Terminal } from 'lucide-react';
import { HeroScene } from '@/components/hero/HeroScene';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { TextReveal } from '@/components/hero/TextReveal';
import { profile as defaultProfile } from '@/content/config';
import type { CMSProfile } from '@/types/cms';

interface HeroSectionProps {
  profile?: CMSProfile;
}

export function HeroSection({ profile }: HeroSectionProps = {}) {
  const activeProfile = profile || {
    full_name: defaultProfile.name,
    professional_title: defaultProfile.title,
    headline: defaultProfile.tagline,
    location: defaultProfile.location,
    bio: '',
    email: defaultProfile.email,
    github_url: defaultProfile.github,
    linkedin_url: defaultProfile.linkedin,
    resume_url: defaultProfile.resumeUrl,
  };
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);
  const y = useTransform(scrollY, [0, 450], [0, 100]);
  const scale = useTransform(scrollY, [0, 450], [1, 0.95]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      style={{ opacity, y, scale }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pt-24"
      id="hero"
    >
      {/* 3D Canvas Background */}
      <HeroScene />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Status Badge (320px Overflow Safe) */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex max-w-[94vw] items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 shadow-[0_0_25px_rgba(59,130,246,0.2)] backdrop-blur-md sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 sm:overflow-visible sm:text-xs sm:tracking-wider">
            Open for Engineering Opportunities
          </span>
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-blue-500" />
        </motion.div>

        {/* H1 Heading with Fluid Typography clamp() */}
        <div className="mb-6">
          <h1 className="font-serif text-[clamp(2.5rem,7vw+0.75rem,5.75rem)] font-bold leading-[1.08] tracking-tight text-[var(--text-primary)]">
            <TextReveal text="Shaik Rohit" highlightText="Rohit" delay={0.2} />
          </h1>
        </div>

        {/* Responsive Fluid Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-[clamp(0.875rem,1.8vw+0.5rem,1.375rem)] font-medium text-blue-600 dark:text-blue-400 sm:gap-2"
        >
          <Terminal className="h-4 w-4 shrink-0 text-blue-500 sm:h-5 sm:w-5" />
          <span>Frontend Developer</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span>React</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span>Docker</span>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span>Modern Web Applications</span>
        </motion.div>

        {/* Responsive Fluid Bio Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mx-auto mb-10 max-w-2xl px-2 text-[clamp(0.9375rem,1vw+0.5rem,1.125rem)] leading-relaxed text-[var(--text-secondary)] sm:mb-12 sm:px-0"
        >
          Computer Engineering student at{' '}
          <strong className="font-semibold text-[var(--text-primary)]">
            Dr. Y.C. James Yen Govt Polytechnic (96% Distinction)
          </strong>{' '}
          and AI Developer / Intern at{' '}
          <strong className="font-semibold text-[var(--text-primary)]">
            Sithafal Technologies, Tirupati
          </strong>
          . Building scalable, containerized web applications and intelligent interfaces.
        </motion.p>

        {/* Responsive Touch-Safe Magnetic CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4"
        >
          <MagneticButton
            onClick={() => scrollTo('projects')}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 sm:w-auto sm:px-8 sm:py-4"
            aria-label="View verified projects"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollTo('about')}
            className="group w-full rounded-xl border border-[var(--border-light)] bg-[var(--surface-card)] px-6 py-3.5 font-semibold text-[var(--text-primary)] backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-[var(--surface-elevated)] sm:w-auto sm:px-8 sm:py-4"
            aria-label="About Shaik Rohit"
          >
            <span className="flex items-center justify-center gap-2">
              About Journey
              <Sparkles className="h-4 w-4 text-blue-500 transition-transform duration-300 group-hover:rotate-12" />
            </span>
          </MagneticButton>

          <MagneticButton
            onClick={() => scrollTo('contact')}
            className="group w-full rounded-xl border border-transparent px-5 py-3 font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] sm:w-auto sm:px-6 sm:py-4"
            aria-label="Contact Shaik Rohit"
          >
            <span className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              Contact
            </span>
          </MagneticButton>
        </motion.div>

        {/* Verified Social Channels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex items-center justify-center gap-3 sm:mt-14 sm:gap-4"
        >
          {[
            {
              icon: Github,
              href: activeProfile.github_url || defaultProfile.github,
              label: 'GitHub Profile (17+ Repos)',
            },
            {
              icon: Linkedin,
              href: activeProfile.linkedin_url || defaultProfile.linkedin,
              label: 'LinkedIn Profile',
            },
            {
              icon: Mail,
              href: `mailto:${activeProfile.email || defaultProfile.email}`,
              label: 'Direct Email',
            },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 text-[var(--text-secondary)] shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/40 hover:text-blue-500"
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Modern SVG Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8"
      >
        <button
          onClick={() => scrollTo('about')}
          className="group flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] transition-colors hover:text-blue-500"
          aria-label="Scroll to explore"
        >
          <span>Scroll</span>
          <div className="relative h-10 w-5 rounded-full border border-[var(--border-light)] p-1">
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-blue-500 motion-reduce:hidden"
            />
          </div>
        </button>
      </motion.div>
    </motion.section>
  );
}

export default HeroSection;
