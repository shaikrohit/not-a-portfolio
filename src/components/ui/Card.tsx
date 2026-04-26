'use client';

/**
 * CARD COMPONENT
 *
 * Clean, minimal card with optional interactivity.
 * Used for projects, skills, and content blocks.
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverLift } from '@/lib/animations';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'interactive' | 'bordered' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  default: cn('bg-white dark:bg-neutral-900', 'border border-neutral-200 dark:border-neutral-800'),
  interactive: cn(
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    'hover:border-neutral-300 dark:hover:border-neutral-700',
    'cursor-pointer'
  ),
  bordered: cn('bg-transparent', 'border border-neutral-300 dark:border-neutral-700'),
  ghost: cn('bg-neutral-50 dark:bg-neutral-900/50', 'border border-transparent'),
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const isInteractive = variant === 'interactive';

    return (
      <motion.div
        ref={ref}
        whileHover={isInteractive ? hoverLift.hover : undefined}
        className={cn(
          'rounded-lg',
          'transition-colors duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header
 */
export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

/**
 * Card Content
 */
export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('', className)}>{children}</div>;
}

/**
 * Card Footer
 */
export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800', className)}>
      {children}
    </div>
  );
}

export default Card;
