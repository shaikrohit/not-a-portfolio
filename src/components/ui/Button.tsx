'use client';

/**
 * BUTTON COMPONENT
 *
 * A purposeful, minimal button system.
 * Every variant has a clear use case.
 *
 * Variants:
 * - primary: Main actions, calls to action
 * - secondary: Alternative actions, less emphasis
 * - ghost: Subtle actions, navigation
 * - link: Inline text actions
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonPress } from '@/lib/animations';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-neutral-900 dark:bg-neutral-100',
    'text-white dark:text-neutral-900',
    'hover:bg-neutral-800 dark:hover:bg-neutral-200',
    'border border-transparent'
  ),
  secondary: cn(
    'bg-transparent',
    'text-neutral-700 dark:text-neutral-300',
    'border border-neutral-300 dark:border-neutral-700',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    'hover:border-neutral-400 dark:hover:border-neutral-600'
  ),
  ghost: cn(
    'bg-transparent',
    'text-neutral-600 dark:text-neutral-400',
    'border border-transparent',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    'hover:text-neutral-900 dark:hover:text-neutral-100'
  ),
  link: cn(
    'bg-transparent',
    'text-neutral-700 dark:text-neutral-300',
    'border-none',
    'hover:text-neutral-900 dark:hover:text-neutral-100',
    'underline-offset-4 hover:underline',
    'p-0'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : buttonPress.tap}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Variant styles
          variantStyles[variant],
          // Size styles (skip for link variant)
          variant !== 'link' && sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Loading Spinner
 * Minimal, elegant loading indicator
 */
function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
