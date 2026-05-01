'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MorphingBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-white" />

      {/* Blobs - Reduced for mobile performance */}
      <motion.div
        className="absolute right-[-10%] top-[-20%] h-[600px] w-[600px] md:h-[1000px] md:w-[1000px] rounded-full opacity-20 md:opacity-30 blur-[80px] md:blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
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
        className="hidden md:block absolute bottom-[-10%] left-[-10%] h-[800px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
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


      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
