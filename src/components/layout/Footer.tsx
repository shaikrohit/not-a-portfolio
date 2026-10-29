'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-16 transition-colors duration-300 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Shaik Rohit
              </span>
            </div>
            <p className="max-w-xs text-center text-sm leading-relaxed text-[var(--text-secondary)] md:text-left">
              Building secure, high-performance digital experiences with passion, clarity, and
              precision.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 md:items-end">
            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: 'https://github.com/shaikrohit', label: 'GitHub' },
                {
                  icon: Linkedin,
                  href: 'https://www.linkedin.com/in/rohitshaik',
                  label: 'LinkedIn',
                },
                { icon: Mail, href: 'mailto:shaik.rohit.official@gmail.com', label: 'Email' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-card)] text-[var(--text-secondary)] shadow-sm transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-400"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm font-medium text-[var(--text-muted)]">
              Crafted with Next.js 16, React 19, and Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--border-subtle)] pt-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Kuppam, Andhra Pradesh, India • © {new Date().getFullYear()} Shaik Rohit
          </p>
        </div>
      </div>
    </footer>
  );
}
