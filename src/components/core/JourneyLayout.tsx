'use client';

/**
 * ============================================================================
 * JOURNEY LAYOUT
 * ============================================================================
 *
 * Main layout wrapper for the journey experience.
 * Includes header with progress, navigation guard, and content area.
 */

import React, { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourneyStore, useProgress, useCurrentStep } from '@/store/journey';
import { MiniProgress } from './ProgressTracker';
import type { PathType } from '@/store/journey';

// ============================================================================
// TYPES
// ============================================================================

interface JourneyLayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// PATH THEME CONFIG
// ============================================================================

const pathThemes: Record<PathType, { label: string; gradient: string }> = {
  developer: {
    label: 'Developer Path',
    gradient: 'from-blue-600 to-cyan-500',
  },
  recruiter: {
    label: 'Recruiter Path',
    gradient: 'from-blue-700 to-blue-500',
  },
  student: {
    label: 'Student Path',
    gradient: 'from-blue-500 to-sky-400',
  },
  explorer: {
    label: 'Explorer Path',
    gradient: 'from-indigo-600 to-blue-400',
  },
};

// ============================================================================
// HEADER COMPONENT
// ============================================================================

const JourneyHeader = memo(function JourneyHeader() {
  const { selectedPath, steps, currentStepIndex } = useJourneyStore();
  const progress = useProgress();
  const currentStep = useCurrentStep();

  if (!selectedPath) return null;

  const theme = pathThemes[selectedPath];

  return (
    <header className="glass-strong fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Path Label */}
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${theme.gradient} `} />
            <span className="text-sm font-medium text-white/70">{theme.label}</span>
            {currentStep && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-sm text-blue-400">{currentStep.label}</span>
              </>
            )}
          </div>

          {/* Progress */}
          <MiniProgress current={progress.current} total={progress.total} label="Progress" />
        </div>

        {/* Step indicators */}
        <div className="mt-3 flex gap-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                index < currentStepIndex
                  ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                  : index === currentStepIndex
                    ? 'bg-blue-500/50'
                    : 'bg-white/10'
              } `}
            />
          ))}
        </div>
      </div>
    </header>
  );
});

// ============================================================================
// NAVIGATION GUARD
// ============================================================================

function useNavigationGuard() {
  useEffect(() => {
    // Prevent browser back navigation
    const handlePopState = (_e: PopStateEvent) => {
      // Push a new entry to prevent going back
      window.history.pushState(null, '', window.location.href);
    };

    // Initial push to create history entry
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Prevent page refresh/close during journey
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

// ============================================================================
// MAIN LAYOUT
// ============================================================================

export function JourneyLayout({ children }: JourneyLayoutProps) {
  const { selectedPath, isPathConfirmed } = useJourneyStore();

  // Enable navigation guard when path is confirmed
  if (isPathConfirmed) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useNavigationGuard();
  }

  return (
    <div className="min-h-screen bg-[var(--surface-base)]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        {/* Path-specific background gradient */}
        {selectedPath && <div className={`absolute inset-0 bg-path-${selectedPath}`} />}

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <AnimatePresence>{isPathConfirmed && <JourneyHeader />}</AnimatePresence>

      {/* Main Content */}
      <main className={`relative z-10 ${isPathConfirmed ? 'pt-20' : ''} `}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isPathConfirmed ? 'journey' : 'selection'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// STEP WRAPPER
// ============================================================================

interface StepWrapperProps {
  children: React.ReactNode;
  onComplete: () => void;
  canProceed?: boolean;
  nextLabel?: string;
  showNext?: boolean;
}

export function StepWrapper({
  children,
  onComplete,
  canProceed = true,
  nextLabel = 'Continue',
  showNext = true,
}: StepWrapperProps) {
  const handleNext = useCallback(() => {
    if (!canProceed) return;
    onComplete();
  }, [canProceed, onComplete]);

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col">
      {/* Content */}
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>

      {/* Bottom Navigation */}
      {showNext && (
        <div className="glass-strong sticky bottom-0 border-t border-white/5">
          <div className="mx-auto flex max-w-4xl justify-end px-4 py-4">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`group inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all duration-300 ${
                canProceed
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-blue-400'
                  : 'cursor-not-allowed bg-white/10 text-white/30'
              } `}
            >
              <span>{nextLabel}</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JourneyLayout;
