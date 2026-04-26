/**
 * Animation Variants for Framer Motion
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
 * Transition Presets
 */
export const transitions = {
  default: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1], // Material Design ease-out
  },
  quick: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
  slow: {
    duration: 0.7,
    ease: [0.4, 0, 0.2, 1],
  },
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
} as const satisfies Record<string, Transition>;

/**
 * Fade In - Simple opacity transition
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.quick,
  },
};

/**
 * Fade Up - Content rising while fading in
 */
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.quick,
  },
};

/**
 * Fade Down - Content descending while fading in
 */
export const fadeDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: transitions.quick,
  },
};

/**
 * Fade Left - Content sliding from right
 */
export const fadeLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: transitions.quick,
  },
};

/**
 * Fade Right - Content sliding from left
 */
export const fadeRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.quick,
  },
};

/**
 * Scale In - Subtle scale animation for emphasis
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: transitions.quick,
  },
};

/**
 * Stagger Container - For staggering child animations
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
 * Stagger Item - Individual item in staggered list
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.quick,
  },
};

/**
 * Card Hover - Subtle lift effect for cards
 */
export const cardHover: Variants = {
  initial: { y: 0 },
  hover: {
    y: -4,
    transition: transitions.quick,
  },
};

/**
 * Button Press - Subtle press effect
 */
export const buttonPress: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.98 },
};

/**
 * Page Transition - Full page transitions
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Reveal - For intersection observer reveals
 */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Text Reveal - Character-by-character reveal
 */
export const textReveal = {
  container: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  } satisfies Variants,
  character: {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: transitions.quick,
    },
  } satisfies Variants,
};

/**
 * Skeleton Pulse - For loading states
 */
export const skeletonPulse: Variants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
