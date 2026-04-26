'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                Shaik Rohit
              </span>
            </div>
            <p className="text-neutral-500 max-w-xs text-center md:text-left leading-relaxed">
              Building secure, high-performance digital experiences with passion and precision.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: 'https://github.com/shaikrohit', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/rohitshaik', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:shaik.rohit.official@gmail.com', label: 'Email' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-neutral-500 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-100"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-neutral-400 font-medium">
              &copy; {new Date().getFullYear()} Shaik Rohit. Built with Next.js & Framer Motion.
            </p>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-neutral-300 uppercase tracking-widest">
            Kuppam, Andhra Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
