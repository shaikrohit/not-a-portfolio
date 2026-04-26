'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Sparkles } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
            Contact
          </span>
          
          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Let's build something{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              amazing
            </span>
          </h2>
          
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            I'm always excited to work on interesting projects and connect with 
            passionate people. Let's create something remarkable together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="mailto:shaik.rohit.official@gmail.com"
              className="group relative px-10 py-5 rounded-xl bg-blue-600 text-white font-medium text-lg overflow-hidden shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Send me an email"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Mail className="w-5 h-5" />
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
              className="group px-10 py-5 rounded-xl bg-white shadow ring-1 ring-black/5 hover:bg-gray-50 text-neutral-900 font-medium text-lg border border-gray-200 hover:border-blue-200 transition-all flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-blue-600" />
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
            <Sparkles className="w-5 h-5 text-neutral-300" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-neutral-200" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
