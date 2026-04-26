'use client';

/**
 * TEXT COMPONENT
 *
 * Semantic text elements with consistent styling.
 * Uses our typography scale and respects the design system.
 */

import React, { type ElementType } from 'react';
import { cn } from '@/lib/utils';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'body-large'
  | 'body-small'
  | 'caption'
  | 'overline';

interface TextProps<T extends ElementType = 'p'> {
  variant?: TextVariant;
  as?: T;
  className?: string;
  children: React.ReactNode;
  muted?: boolean;
  balance?: boolean;
}

const variantStyles: Record<TextVariant, { element: string; styles: string }> = {
  h1: {
    element: 'h1',
    styles: cn(
      'font-serif text-4xl md:text-5xl lg:text-6xl',
      'tracking-tight',
      'text-neutral-900 dark:text-neutral-50'
    ),
  },
  h2: {
    element: 'h2',
    styles: cn(
      'font-serif text-3xl md:text-4xl',
      'tracking-tight',
      'text-neutral-900 dark:text-neutral-50'
    ),
  },
  h3: {
    element: 'h3',
    styles: cn(
      'font-serif text-2xl md:text-3xl',
      'tracking-tight',
      'text-neutral-900 dark:text-neutral-50'
    ),
  },
  h4: {
    element: 'h4',
    styles: cn(
      'font-sans text-xl font-medium md:text-2xl',
      'tracking-tight',
      'text-neutral-900 dark:text-neutral-50'
    ),
  },
  body: {
    element: 'p',
    styles: cn('font-sans text-base', 'leading-relaxed', 'text-neutral-700 dark:text-neutral-300'),
  },
  'body-large': {
    element: 'p',
    styles: cn(
      'font-sans text-lg md:text-xl',
      'leading-relaxed',
      'text-neutral-700 dark:text-neutral-300'
    ),
  },
  'body-small': {
    element: 'p',
    styles: cn('font-sans text-sm', 'leading-relaxed', 'text-neutral-600 dark:text-neutral-400'),
  },
  caption: {
    element: 'span',
    styles: cn('font-sans text-xs', 'text-neutral-500 dark:text-neutral-500'),
  },
  overline: {
    element: 'span',
    styles: cn(
      'font-sans text-xs font-medium uppercase tracking-wider',
      'text-neutral-500 dark:text-neutral-500'
    ),
  },
};

export function Text<T extends ElementType = 'p'>({
  variant = 'body',
  as,
  className,
  children,
  muted = false,
  balance = false,
}: TextProps<T>) {
  const { element, styles } = variantStyles[variant];
  const Component = (as || element) as ElementType;

  return (
    <Component
      className={cn(
        styles,
        muted && 'text-neutral-500 dark:text-neutral-500',
        balance && 'text-balance',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Gradient Text
 * Accent color gradient for emphasis
 */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-neutral-900 to-neutral-600',
        'dark:from-neutral-100 dark:to-neutral-400',
        'bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Highlighted Text
 * Subtle background highlight
 */
export function HighlightedText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-accent/10 text-accent-dark dark:text-accent-light',
        'rounded px-1 py-0.5',
        className
      )}
    >
      {children}
    </span>
  );
}

export default Text;
