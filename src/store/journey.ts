'use client';

/**
 * ============================================================================
 * JOURNEY CONTROLLER
 * ============================================================================
 *
 * Central state management for the user journey.
 * Handles path selection, step progression, and navigation restrictions.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type PathType = 'developer' | 'recruiter' | 'student' | 'explorer';

export interface JourneyStep {
  id: string;
  label: string;
  component: string;
  isCompleted: boolean;
  data?: Record<string, unknown>;
}

export interface JourneyState {
  // Path info
  selectedPath: PathType | null;
  isPathConfirmed: boolean;

  // Navigation
  currentStepIndex: number;
  steps: JourneyStep[];

  // Session
  startedAt: Date | null;
  lastActiveAt: Date | null;

  // Validation
  validationErrors: Record<string, string>;
}

export interface JourneyActions {
  // Path selection
  selectPath: (path: PathType) => void;
  confirmPath: () => void;

  // Navigation
  nextStep: () => boolean;
  completeCurrentStep: (data?: Record<string, unknown>) => void;

  // Validation
  setValidationError: (field: string, error: string) => void;
  clearValidationError: (field: string) => void;
  clearAllErrors: () => void;

  // Utils
  canProceed: () => boolean;
  reset: () => void;
}

// ============================================================================
// STEP DEFINITIONS BY PATH
// ============================================================================

const pathSteps: Record<PathType, Omit<JourneyStep, 'isCompleted'>[]> = {
  developer: [
    { id: 'intro', label: 'Introduction', component: 'DeveloperIntro' },
    { id: 'philosophy', label: 'Philosophy', component: 'DeveloperPhilosophy' },
    { id: 'stack', label: 'Tech Stack', component: 'DeveloperStack' },
    { id: 'projects', label: 'Projects', component: 'DeveloperProjects' },
    { id: 'connect', label: 'Connect', component: 'DeveloperConnect' },
  ],
  recruiter: [
    { id: 'intro', label: 'Overview', component: 'RecruiterIntro' },
    { id: 'experience', label: 'Experience', component: 'RecruiterExperience' },
    { id: 'skills', label: 'Skills', component: 'RecruiterSkills' },
    { id: 'achievements', label: 'Achievements', component: 'RecruiterAchievements' },
    { id: 'contact', label: 'Contact', component: 'RecruiterContact' },
  ],
  student: [
    { id: 'welcome', label: 'Welcome', component: 'StudentWelcome' },
    { id: 'journey', label: 'My Journey', component: 'StudentJourney' },
    { id: 'resources', label: 'Resources', component: 'StudentResources' },
    { id: 'advice', label: 'Advice', component: 'StudentAdvice' },
    { id: 'qa', label: 'Q&A', component: 'StudentQA' },
  ],
  explorer: [
    { id: 'discover', label: 'Discover', component: 'ExplorerDiscover' },
    { id: 'highlights', label: 'Highlights', component: 'ExplorerHighlights' },
    { id: 'deep-dive', label: 'Deep Dive', component: 'ExplorerDeepDive' },
    { id: 'connect', label: 'Connect', component: 'ExplorerConnect' },
  ],
};

// ============================================================================
// STORE
// ============================================================================

const initialState: JourneyState = {
  selectedPath: null,
  isPathConfirmed: false,
  currentStepIndex: 0,
  steps: [],
  startedAt: null,
  lastActiveAt: null,
  validationErrors: {},
};

export const useJourneyStore = create<JourneyState & JourneyActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectPath: (path) => {
        const steps = pathSteps[path].map((step) => ({
          ...step,
          isCompleted: false,
        }));

        set({
          selectedPath: path,
          steps,
          currentStepIndex: 0,
          startedAt: new Date(),
          lastActiveAt: new Date(),
        });
      },

      confirmPath: () => {
        const { selectedPath } = get();
        if (!selectedPath) return;

        set({
          isPathConfirmed: true,
          lastActiveAt: new Date(),
        });
      },

      nextStep: () => {
        const { currentStepIndex, steps, canProceed } = get();

        if (!canProceed()) {
          return false;
        }

        const nextIndex = currentStepIndex + 1;

        if (nextIndex >= steps.length) {
          // Journey complete
          return false;
        }

        set({
          currentStepIndex: nextIndex,
          lastActiveAt: new Date(),
        });

        return true;
      },

      completeCurrentStep: (data) => {
        const { currentStepIndex, steps } = get();

        const updatedSteps = steps.map((step, index) => {
          if (index === currentStepIndex) {
            return {
              ...step,
              isCompleted: true,
              data: data || step.data,
            };
          }
          return step;
        });

        set({
          steps: updatedSteps,
          lastActiveAt: new Date(),
        });
      },

      setValidationError: (field, error) => {
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [field]: error,
          },
        }));
      },

      clearValidationError: (field) => {
        set((state) => {
          const errors = { ...state.validationErrors };
          delete errors[field];
          return { validationErrors: errors };
        });
      },

      clearAllErrors: () => {
        set({ validationErrors: {} });
      },

      canProceed: () => {
        const { validationErrors, steps, currentStepIndex } = get();

        // Check for validation errors
        if (Object.keys(validationErrors).length > 0) {
          return false;
        }

        // Check if current step is completed
        const currentStep = steps[currentStepIndex];
        if (currentStep && !currentStep.isCompleted) {
          return false;
        }

        return true;
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'journey-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedPath: state.selectedPath,
        isPathConfirmed: state.isPathConfirmed,
        currentStepIndex: state.currentStepIndex,
        steps: state.steps,
        startedAt: state.startedAt,
      }),
    }
  )
);

// ============================================================================
// HOOKS
// ============================================================================

export function useCurrentStep() {
  const { steps, currentStepIndex } = useJourneyStore();
  return steps[currentStepIndex] || null;
}

export function useProgress() {
  const { steps, currentStepIndex } = useJourneyStore();
  const completedSteps = steps.filter((s) => s.isCompleted).length;

  return {
    current: currentStepIndex + 1,
    total: steps.length,
    completed: completedSteps,
    percentage: steps.length > 0 ? (completedSteps / steps.length) * 100 : 0,
    isComplete: completedSteps === steps.length,
  };
}

export function useCanProceed() {
  const store = useJourneyStore();
  return store.canProceed();
}
