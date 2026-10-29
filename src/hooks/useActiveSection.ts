'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseActiveSectionOptions {
  /**
   * Root margin for the IntersectionObserver.
   * Default: '-20% 0px -70% 0px'
   * Focuses the trigger band to 20%-30% from the top of the viewport.
   */
  rootMargin?: string;
  /**
   * Intersection threshold(s).
   * Default: 0
   */
  threshold?: number | number[];
  /**
   * Default active section.
   * Default: first item in sectionIds
   */
  defaultSection?: string;
  /**
   * Scroll threshold in px to mark navbar as scrolled.
   * Default: 40
   */
  scrolledThreshold?: number;
}

export interface UseActiveSectionReturn {
  activeSection: string;
  setActiveSection: (id: string) => void;
  isScrolled: boolean;
  scrollToSection: (id: string, customOptions?: ScrollIntoViewOptions) => void;
}

export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): UseActiveSectionReturn {
  const {
    rootMargin = '-20% 0px -70% 0px',
    threshold = 0,
    defaultSection = sectionIds[0] ?? '',
    scrolledThreshold = 40,
  } = options;

  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const isClickScrollingRef = useRef<boolean>(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll threshold & boundary handling (top and bottom of page)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        setIsScrolled(scrollY > scrolledThreshold);

        if (isClickScrollingRef.current) return;

        // Top boundary: enforce first section (hero)
        if (scrollY <= 50 && sectionIds.length > 0) {
          setActiveSection(sectionIds[0] ?? '');
          return;
        }

        // Bottom boundary: enforce last section (contact)
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollY + windowHeight >= docHeight - 50 && sectionIds.length > 0) {
          setActiveSection(sectionIds[sectionIds.length - 1] ?? '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setIsScrolled(window.scrollY > scrolledThreshold);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, scrolledThreshold]);

  // Deterministic IntersectionObserver section tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const visibleSections = new Map<string, boolean>();
    const observedElements = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;

        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });

        // Activate the first intersecting section in page sequence
        for (const id of sectionIds) {
          if (visibleSections.get(id)) {
            setActiveSection(id);
            break;
          }
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    const observeElements = () => {
      sectionIds.forEach((id) => {
        if (observedElements.has(id)) return;
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          observedElements.add(id);
        }
      });
    };

    observeElements();

    // Observe asynchronously mounted sections from dynamic() imports
    const mutationObserver = new MutationObserver(() => {
      observeElements();
      if (observedElements.size >= sectionIds.length) {
        mutationObserver.disconnect();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [sectionIds, rootMargin, threshold]);

  const scrollToSection = useCallback((id: string, customOptions?: ScrollIntoViewOptions) => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      isClickScrollingRef.current = true;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Suppress observer overrides for 800ms during smooth scroll
      clickTimeoutRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
      }, 800);

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        ...customOptions,
      });
    } else if (id === 'hero' || id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
    }
  }, []);

  return {
    activeSection,
    setActiveSection,
    isScrolled,
    scrollToSection,
  };
}

export default useActiveSection;
