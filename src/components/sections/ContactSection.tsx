'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare } from 'lucide-react';
import { ContactForm, SocialOrbit, ContactInfoCards } from '@/components/contact';

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-4 py-20 transition-colors duration-300 sm:px-6 sm:py-28 md:py-32 lg:py-36"
    >
      {/* Background Decorative Ambient Glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[100px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 sm:px-4 sm:py-1.5 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Contact & Collaboration
          </span>

          <h2
            id="contact-heading"
            className="mb-5 font-serif text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Let's build something{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              exceptional
            </span>
          </h2>

          <p className="text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Open for software engineering opportunities, AI integrations, and technical
            collaborations. Send a direct message below or connect across verified channels.
          </p>
        </motion.div>

        {/* Modern 2-Column Responsive Layout */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 sm:mt-16 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Left Column: Interactive Contact Form (lg: 7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:col-span-7"
          >
            <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xl backdrop-blur-xl sm:p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                    Send a Direct Message
                  </h3>
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  Response within 24h
                </span>
              </div>

              <ContactForm />
            </div>
          </motion.div>

          {/* Right Column: Social Orbit + Quick Info Cards (lg: 5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex w-full flex-col gap-6 sm:gap-8 lg:col-span-5"
          >
            {/* Top: Interactive Social Orbit */}
            <SocialOrbit />

            {/* Bottom: Quick Contact Cards */}
            <ContactInfoCards />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
