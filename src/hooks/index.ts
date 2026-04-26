/**
 * CUSTOM HOOKS
 *
 * Reusable hooks for common functionality.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useVisitorStore } from '@/store';
import { updateSessionTime, updateSessionPages } from '@/lib/supabase';
import { debounce } from '@/lib/utils';

/**
 * useTimeTracking
 *
 * Tracks time spent on the site.
 * Updates every 30 seconds while the tab is active.
 */
export function useTimeTracking() {
  const session = useVisitorStore((state) => state.session);
  const updateTimeSpent = useVisitorStore((state) => state.updateTimeSpent);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!session) return;

    // Update every 30 seconds
    const tick = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
      lastUpdateRef.current = now;

      updateTimeSpent(elapsed);

      // Sync to database (debounced)
      updateSessionTime(session.id, session.timeSpentSeconds + elapsed);
    };

    intervalRef.current = setInterval(tick, 30000);

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden - pause tracking
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Tab visible - resume tracking
        lastUpdateRef.current = Date.now();
        intervalRef.current = setInterval(tick, 30000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session, updateTimeSpent]);
}

/**
 * usePageTracking
 *
 * Tracks which pages/sections the visitor has viewed.
 */
export function usePageTracking(currentPage: string) {
  const session = useVisitorStore((state) => state.session);
  const trackPageVisit = useVisitorStore((state) => state.trackPageVisit);
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!session || !currentPage) return;

    // Prevent duplicate tracking
    if (trackedRef.current.has(currentPage)) return;
    trackedRef.current.add(currentPage);

    trackPageVisit(currentPage);

    // Sync to database
    const updatedPages = session.pagesVisited.includes(currentPage)
      ? session.pagesVisited
      : [...session.pagesVisited, currentPage];

    updateSessionPages(session.id, updatedPages);
  }, [currentPage, session, trackPageVisit]);
}

/**
 * useKeyboardNavigation
 *
 * Enables keyboard shortcuts for navigation.
 */
export function useKeyboardNavigation(
  onNext: () => void,
  onPrevious: () => void,
  options?: { enabled?: boolean }
) {
  const { enabled = true } = options || {};

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'j') {
        onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        onPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onNext, onPrevious]);
}

/**
 * useMediaQuery
 *
 * React hook for media queries.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

import React from 'react';

/**
 * useIntersectionObserver
 *
 * Detects when an element enters the viewport.
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [options]);

  return [ref, isIntersecting];
}

/**
 * useLocalStorage
 *
 * Syncs state with localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * useDebouncedCallback
 *
 * Returns a debounced version of a callback.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, delay),
    [delay]
  );
}
