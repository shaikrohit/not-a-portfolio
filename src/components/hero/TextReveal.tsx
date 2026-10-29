'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  highlightText?: string;
  highlightClassName?: string;
}

export function TextReveal({
  text,
  className = '',
  delay = 0,
  highlightText,
  highlightClassName = 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent',
}: TextRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.04,
        delayChildren: delay,
      },
    },
  };

  const charVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.2 },
        },
      }
    : {
        hidden: { opacity: 0, y: 35, rotateX: -40 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      };

  return (
    <motion.span
      className={`inline-flex flex-wrap items-center justify-center gap-x-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => {
        const isHighlight = highlightText && word.toLowerCase() === highlightText.toLowerCase();

        return (
          <span
            key={wordIndex}
            className={`inline-flex overflow-hidden py-1 ${isHighlight ? highlightClassName : ''}`}
          >
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={charVariants}
                className="inline-block transform-gpu will-change-transform"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </motion.span>
  );
}

export default TextReveal;
