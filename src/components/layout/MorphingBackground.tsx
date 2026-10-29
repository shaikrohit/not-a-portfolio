'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MorphingBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[var(--surface-base)] transition-colors duration-300">
      <div className="absolute inset-0 bg-[var(--surface-base)] transition-colors duration-300" />

      {/* Mobile Static Soft Gradient (Zero GPU strain) */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full opacity-15 md:hidden"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Desktop Animated Blobs */}
      <motion.div
        className="absolute right-[-10%] top-[-20%] hidden h-[1000px] w-[1000px] rounded-full opacity-30 blur-[140px] md:block"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
          willChange: 'transform',
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] left-[-10%] hidden h-[800px] w-[800px] rounded-full opacity-20 blur-[120px] md:block"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          willChange: 'transform',
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -60, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      />

      {/* SVG Noise Overlay - Active on Desktop Only */}
      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.02] md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
