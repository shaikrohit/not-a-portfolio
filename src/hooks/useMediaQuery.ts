'use client';

import { useSyncExternalStore } from 'react';

/**
 * SSR-safe, hydration-safe media query hook powered by React 19 useSyncExternalStore.
 *
 * @param query CSS media query string (e.g. '(pointer: coarse)', '(max-width: 768px)')
 * @param serverFallback Value returned during SSR / before client hydration (default: false)
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return () => {};
    }

    const mediaQueryList = window.matchMedia(query);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', callback);
      return () => mediaQueryList.removeEventListener('change', callback);
    } else {
      // Fallback for older WebViews / Safari
      mediaQueryList.addListener(callback);
      return () => mediaQueryList.removeListener(callback);
    }
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return serverFallback;
    }
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => serverFallback;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Helper hook to detect touchscreens or coarse pointing devices.
 */
export function useCoarsePointer(serverFallback = false): boolean {
  return useMediaQuery('(pointer: coarse)', serverFallback);
}

export default useMediaQuery;
