'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Sparkles } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-widest text-blue-400">
            Contact
          </span>

          <h2 className="mb-6 text-5xl font-bold text-neutral-900 md:text-6xl">
            Let's build something{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              amazing
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-neutral-500">
            I'm always excited to work on interesting projects and connect with passionate people.
            Let's create something remarkable together.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href="mailto:shaik.rohit.official@gmail.com"
              className="group relative overflow-hidden rounded-xl bg-blue-600 px-10 py-5 text-lg font-medium text-white shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Send me an email"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Mail className="h-5 w-5" />
                Send me an email
              </span>
              <motion.div
                className="absolute inset-0 bg-blue-700"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/rohitshaik"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-10 py-5 text-lg font-medium text-neutral-900 shadow ring-1 ring-black/5 transition-all hover:border-blue-200 hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-blue-600" />
              Connect on LinkedIn
            </motion.a>
          </div>

          <motion.div
            className="mt-20 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-neutral-200" />
            <Sparkles className="h-5 w-5 text-neutral-300" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-neutral-200" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
