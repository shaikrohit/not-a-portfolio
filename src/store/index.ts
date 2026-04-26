/**
 * GLOBAL STATE STORE
 *
 * Using Zustand for lightweight, hook-based state management.
 *
 * State is organized by domain:
 * - Visitor: Who is visiting and their journey
 * - Navigation: Current section and progress
 * - Theme: Light/dark mode preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { VisitorType, VisitorSession, NavigationState } from '@/types';
import { generateSessionId, getCountryFromTimezone } from '@/lib/utils';

/**
 * Visitor Store
 *
 * Tracks the visitor's identity and session.
 * Persisted to localStorage for return visits.
 */
interface VisitorStore {
  // State
  visitorType: VisitorType | null;
  session: VisitorSession | null;
  hasCompletedEntry: boolean;

  // Actions
  setVisitorType: (type: VisitorType) => void;
  startSession: () => void;
  trackPageVisit: (page: string) => void;
  updateTimeSpent: (seconds: number) => void;
  clearSession: () => void;
}

export const useVisitorStore = create<VisitorStore>()(
  persist(
    (set, get) => ({
      visitorType: null,
      session: null,
      hasCompletedEntry: false,

      setVisitorType: (type) => {
        const currentSession = get().session;
        set({
          visitorType: type,
          hasCompletedEntry: true,
          session: currentSession ? { ...currentSession, visitorType: type } : null,
        });
      },

      startSession: () => {
        const existingSession = get().session;

        // If session exists and is less than 30 minutes old, continue it
        if (existingSession) {
          const timeSinceActive = Date.now() - new Date(existingSession.lastActiveAt).getTime();
          if (timeSinceActive < 30 * 60 * 1000) {
            set({
              session: {
                ...existingSession,
                lastActiveAt: new Date(),
              },
            });
            return;
          }
        }

        // Create new session
        const newSession: VisitorSession = {
          id: generateSessionId(),
          visitorType: get().visitorType,
          country: getCountryFromTimezone(),
          enteredAt: new Date(),
          pagesVisited: [],
          timeSpentSeconds: 0,
          lastActiveAt: new Date(),
        };

        set({ session: newSession });
      },

      trackPageVisit: (page) => {
        const session = get().session;
        if (!session) return;

        const updatedPages = session.pagesVisited.includes(page)
          ? session.pagesVisited
          : [...session.pagesVisited, page];

        set({
          session: {
            ...session,
            pagesVisited: updatedPages,
            lastActiveAt: new Date(),
          },
        });
      },

      updateTimeSpent: (seconds) => {
        const session = get().session;
        if (!session) return;

        set({
          session: {
            ...session,
            timeSpentSeconds: session.timeSpentSeconds + seconds,
            lastActiveAt: new Date(),
          },
        });
      },

      clearSession: () => {
        set({
          visitorType: null,
          session: null,
          hasCompletedEntry: false,
        });
      },
    }),
    {
      name: 'visitor-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        visitorType: state.visitorType,
        hasCompletedEntry: state.hasCompletedEntry,
        session: state.session,
      }),
    }
  )
);

/**
 * Navigation Store
 *
 * Tracks user's progress through the site.
 * Manages unlockable sections and visited areas.
 */
interface NavigationStore extends NavigationState {
  // Actions
  setCurrentSection: (section: string) => void;
  markSectionVisited: (section: string) => void;
  unlockSection: (section: string) => void;
  isUnlocked: (section: string) => boolean;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      currentSection: 'entry',
      visitedSections: [],
      unlockedSections: ['entry', 'about'],

      setCurrentSection: (section) => {
        set({ currentSection: section });
        get().markSectionVisited(section);
      },

      markSectionVisited: (section) => {
        const { visitedSections } = get();
        if (!visitedSections.includes(section)) {
          set({ visitedSections: [...visitedSections, section] });
        }
      },

      unlockSection: (section) => {
        const { unlockedSections } = get();
        if (!unlockedSections.includes(section)) {
          set({ unlockedSections: [...unlockedSections, section] });
        }
      },

      isUnlocked: (section) => {
        return get().unlockedSections.includes(section);
      },

      resetNavigation: () => {
        set({
          currentSection: 'entry',
          visitedSections: [],
          unlockedSections: ['entry', 'about'],
        });
      },
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Theme Store
 *
 * Manages light/dark mode.
 * Respects system preference by default.
 */
interface ThemeStore {
  mode: 'light' | 'dark' | 'system';
  resolvedMode: 'light' | 'dark';

  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleMode: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolvedMode: 'light',

      setMode: (mode) => {
        let resolved: 'light' | 'dark' = 'light';

        if (mode === 'system') {
          if (typeof window !== 'undefined') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
        } else {
          resolved = mode;
        }

        set({ mode, resolvedMode: resolved });

        // Apply to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(resolved);
        }
      },

      toggleMode: () => {
        const current = get().resolvedMode;
        const next = current === 'light' ? 'dark' : 'light';
        get().setMode(next);
      },

      initializeTheme: () => {
        const { mode, setMode } = get();
        setMode(mode);

        // Listen for system preference changes
        if (typeof window !== 'undefined' && mode === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handler = (e: MediaQueryListEvent) => {
            if (get().mode === 'system') {
              set({ resolvedMode: e.matches ? 'dark' : 'light' });
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(e.matches ? 'dark' : 'light');
            }
          };
          mediaQuery.addEventListener('change', handler);
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

/**
 * UI Store
 *
 * Ephemeral UI state that doesn't need persistence.
 */
interface UIStore {
  isMenuOpen: boolean;
  isContactOpen: boolean;
  activePromptId: string | null;

  setMenuOpen: (open: boolean) => void;
  setContactOpen: (open: boolean) => void;
  setActivePrompt: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  isContactOpen: false,
  activePromptId: null,

  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setContactOpen: (open) => set({ isContactOpen: open }),
  setActivePrompt: (id) => set({ activePromptId: id }),
}));
