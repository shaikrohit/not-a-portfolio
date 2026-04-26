/**
 * ANIMATION VARIANTS
 * 
 * Centralized animation definitions for Framer Motion.
 * 
 * Design Philosophy:
 * - Animations should feel like breathing: natural, calm, inevitable
 * - Never jarring or attention-seeking
 * - Ease-out for entrances (things arriving)
 * - Ease-in for exits (things leaving)
 * - Duration: 200-400ms for micro-interactions, 500-800ms for page transitions
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Default transition settings
 */
export const defaultTransition: Transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1], // Smooth ease-out
};

export const quickTransition: Transition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const slowTransition: Transition = {
  duration: 0.7,
  ease: [0.4, 0, 0.2, 1],
};

/**
 * Fade In
 * Simple opacity transition
 */
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: quickTransition,
  },
};

/**
 * Fade Up
 * Content fading in while rising slightly
 */
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: quickTransition,
  },
};

/**
 * Fade Down
 * Content fading in while descending slightly
 */
export const fadeDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: quickTransition,
  },
};

/**
 * Scale In
 * Subtle scale animation for emphasis
 */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: quickTransition,
  },
};

/**
 * Stagger Container
 * Parent container that staggers children animations
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger Item
 * Child item for stagger container
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: quickTransition,
  },
};

/**
 * Slide In From Left
 */
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: 24,
    transition: quickTransition,
  },
};

/**
 * Slide In From Right
 */
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 24,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: quickTransition,
  },
};

/**
 * Page Transition
 * For full page changes
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/**
 * Reveal
 * For unlocking/revealing content
 */
export const reveal: Variants = {
  initial: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  animate: {
    opacity: 1,
    height: 'auto',
    overflow: 'visible',
    transition: {
      height: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
      opacity: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: {
      height: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

/**
 * Button Press
 * Subtle scale on click
 */
export const buttonPress = {
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Hover Lift
 * Subtle lift effect on hover
 */
export const hoverLift = {
  hover: {
    y: -2,
    transition: { duration: 0.2 },
  },
};

/**
 * Typing Cursor
 * Blinking cursor animation
 */
export const typingCursor: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Pulse
 * Subtle attention-drawing pulse
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Create stagger delay
 * Utility to create delay based on index
 */
export function createStaggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}
