'use client';

import { useMediaQuery } from './useMediaQuery';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Hook to detect whether the user has enabled reduced motion in their OS / browser settings.
 * SSR-safe and dynamically reactive to runtime changes.
 *
 * @param serverFallback Value returned during SSR (default: false)
 * @returns boolean indicating prefers-reduced-motion
 */
export function usePrefersReducedMotion(serverFallback = false): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY, serverFallback);
}

export default usePrefersReducedMotion;
