'use client';

/**
 * ANIMATED PRESENCE WRAPPER
 *
 * Wraps content in Framer Motion's AnimatePresence
 * with our design system animations.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, slideInLeft, slideInRight } from '@/lib/animations';
import { cn } from '@/lib/utils';

type AnimationType = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight';

interface FadeInProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  show?: boolean;
}

const animations: Record<AnimationType, Variants> = {
  fadeUp,
  fadeIn,
  scaleIn,
  slideLeft: slideInLeft,
  slideRight: slideInRight,
};

export function FadeIn({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration,
  className,
  show = true,
}: FadeInProps) {
  const variants = animations[animation];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            delay,
            duration: duration || 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Stagger Children
 * Animates children with staggered delays
 */
interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerChildren({ children, staggerDelay = 0.1, className }: StaggerChildrenProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
        exit: {
          transition: {
            staggerChildren: staggerDelay / 2,
            staggerDirection: -1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item
 * Individual item within StaggerChildren
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 16 },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: { duration: 0.2 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveal
 * Content that expands/collapses
 */
interface RevealProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export function Reveal({ children, show, className }: RevealProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.3, delay: 0.1 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
              opacity: { duration: 0.2 },
            },
          }}
          className={cn('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Page Transition Wrapper
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Typing Effect
 * Simulates typing text character by character
 */
interface TypingEffectProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingEffect({ text, className, speed = 50, onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-0.5"
      >
        |
      </motion.span>
    </span>
  );
}

export default FadeIn;
