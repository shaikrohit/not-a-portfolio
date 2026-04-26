'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/10">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-2xl font-bold text-transparent">
                Shaik Rohit
              </span>
            </div>
            <p className="max-w-xs text-center leading-relaxed text-neutral-500 md:text-left">
              Building secure, high-performance digital experiences with passion and precision.
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
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-neutral-500 transition-all hover:bg-blue-50 hover:text-blue-600"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm font-medium text-neutral-400">
              &copy; {new Date().getFullYear()} Shaik Rohit. Built with Next.js & Framer Motion.
            </p>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-50 pt-8 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-300">
            Kuppam, Andhra Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
