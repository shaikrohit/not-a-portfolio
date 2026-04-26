'use client';

/**
 * THEME PROVIDER
 * 
 * Initializes and manages theme state.
 * Must wrap the application to enable dark mode.
 */

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return <>{children}</>;
}

/**
 * THEME TOGGLE
 * 
 * Button to switch between light and dark modes.
 */

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedMode, toggleMode } = useThemeStore();

  return (
    <button
      onClick={toggleMode}
      className={cn(
        'relative p-2 rounded-lg',
        'text-neutral-600 dark:text-neutral-400',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
        className
      )}
      aria-label={`Switch to ${resolvedMode === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedMode}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedMode === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default ThemeProvider;
