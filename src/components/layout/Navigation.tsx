'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Menu,
  X,
  Search,
  ChevronRight,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Trophy,
  Layers,
  Cpu,
  Gamepad2,
  Mail,
  CornerDownLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';
import { useThemeStore } from '@/store';
import { useActiveSection } from '@/hooks/useActiveSection';

export interface SectionMeta {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  category: 'Overview' | 'Profile' | 'Experience' | 'Work' | 'Interactive' | 'Connect';
  icon: React.ComponentType<{ className?: string }>;
}

export const ALL_PAGE_SECTIONS: SectionMeta[] = [
  {
    id: 'hero',
    label: 'Home',
    shortLabel: 'Home',
    description: 'Interactive 3D particle sphere & introduction',
    category: 'Overview',
    icon: Sparkles,
  },
  {
    id: 'about',
    label: 'About',
    shortLabel: 'About',
    description: 'Bio, core philosophy & interactive bento grid',
    category: 'Profile',
    icon: User,
  },
  {
    id: 'experience',
    label: 'Experience',
    shortLabel: 'Experience',
    description: 'Career history, engineering leadership & impact',
    category: 'Experience',
    icon: Briefcase,
  },
  {
    id: 'education',
    label: 'Education',
    shortLabel: 'Education',
    description: 'Academic background, coursework & certifications',
    category: 'Experience',
    icon: GraduationCap,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    shortLabel: 'Honors',
    description: 'Hackathon victories, awards & recognitions',
    category: 'Experience',
    icon: Trophy,
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Projects',
    description: 'Production systems, full-stack apps & AI tools',
    category: 'Work',
    icon: Layers,
  },
  {
    id: 'skills',
    label: 'Skills',
    shortLabel: 'Skills',
    description: 'Interactive 3D skill sphere & technology radar',
    category: 'Work',
    icon: Cpu,
  },
  {
    id: 'trivia',
    label: 'Trivia',
    shortLabel: 'Trivia',
    description: 'Interactive developer quiz & challenge',
    category: 'Interactive',
    icon: Gamepad2,
  },
  {
    id: 'contact',
    label: 'Contact',
    shortLabel: 'Contact',
    description: 'Direct message form & social profile orbit',
    category: 'Connect',
    icon: Mail,
  },
];

export const DESKTOP_NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'trivia', label: 'Trivia' },
  { id: 'contact', label: 'Contact' },
];

const ALL_SECTION_IDS = ALL_PAGE_SECTIONS.map((s) => s.id);

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { resolvedMode, toggleMode } = useThemeStore();

  const { activeSection, isScrolled, scrollToSection } = useActiveSection(ALL_SECTION_IDS, {
    rootMargin: '-20% 0px -70% 0px',
    defaultSection: 'hero',
    scrolledThreshold: 40,
  });

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        if (commandOpen) {
          setCommandOpen(false);
        } else if (mobileOpen) {
          setMobileOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandOpen, mobileOpen]);

  // Body Scroll Lock for Dialog / Mobile Drawer with layout shift prevention
  useEffect(() => {
    if (mobileOpen || commandOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [mobileOpen, commandOpen]);

  // Focus input when Command Palette opens
  useEffect(() => {
    if (commandOpen) {
      setSearchQuery('');
      setSelectedSearchIndex(0);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [commandOpen]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return ALL_PAGE_SECTIONS;
    const q = searchQuery.toLowerCase().trim();
    return ALL_PAGE_SECTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSections.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex((prev) => (prev + 1) % filteredSections.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(
        (prev) => (prev - 1 + filteredSections.length) % filteredSections.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredSections[selectedSearchIndex];
      if (target) {
        scrollToSection(target.id);
        setCommandOpen(false);
      }
    }
  };

  const handleSelectSection = (id: string) => {
    scrollToSection(id);
    setMobileOpen(false);
    setCommandOpen(false);
  };

  return (
    <>
      {/* 1. GLASSMORPHIC FLOATING COMMAND-BAR CONTAINER */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'border-b border-[var(--border-subtle)] bg-[var(--surface-glass)] py-3 shadow-lg shadow-black/5 backdrop-blur-xl'
            : 'py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Brand Logo & Back-to-Top Trigger */}
          <motion.button
            onClick={() => handleSelectSection('hero')}
            className="group relative flex items-center gap-2.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Shaik Rohit - Back to top"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/25 transition-transform group-hover:rotate-6">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-lg font-bold tracking-tight text-[var(--text-primary)]">
                Shaik Rohit
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-blue-500">
                {activeSection === 'hero' ? '• Home' : 'Full Stack Engineer'}
              </span>
            </div>
          </motion.button>

          {/* Desktop Glassmorphic Command-Bar Navigation Pill */}
          <div className="bg-[var(--surface-card)]/90 hidden items-center gap-1 rounded-full border border-[var(--border-subtle)] p-1.5 shadow-sm backdrop-blur-xl lg:flex">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-blue-600 shadow-md shadow-blue-500/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            {/* Quick Command Palette Button */}
            <motion.button
              onClick={() => setCommandOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[var(--surface-card)]/80 hidden items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)] shadow-sm backdrop-blur-xl transition-all hover:border-[var(--border-light)] hover:text-[var(--text-primary)] sm:flex"
              aria-label="Open command palette (Press Ctrl+K or Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-blue-500" />
              <span className="hidden md:inline">Quick Jump</span>
              <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </motion.button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]" />

            {/* Mobile Navigation Drawer Trigger */}
            <motion.button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={mobileOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* 2. MOBILE DRAWER NAVIGATION (Slide-out Off-Canvas Panel) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Scrim Overlay */}
            <motion.div
              key="drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-out Off-Canvas Drawer Panel */}
            <motion.aside
              key="drawer-panel"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site Navigation Menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="bg-[var(--surface-card)]/95 fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col justify-between border-l border-[var(--border-subtle)] p-6 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/25">
                      <Code2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-serif text-base font-bold text-[var(--text-primary)]">
                        Shaik Rohit
                      </h2>
                      <p className="font-mono text-[11px] text-[var(--text-muted)]">
                        Portfolio Navigation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-[var(--border-subtle)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Close navigation drawer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Command Palette Trigger Button */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setCommandOpen(true);
                    }}
                    className="bg-[var(--surface-elevated)]/70 flex w-full items-center justify-between rounded-xl border border-[var(--border-subtle)] px-3.5 py-2.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-light)] hover:text-[var(--text-primary)]"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-500" />
                      <span>Search all 10 sections...</span>
                    </div>
                    <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-1.5 py-0.5 font-mono text-[10px]">
                      ⌘K
                    </kbd>
                  </button>
                </div>

                {/* Section Navigation Items (All 10 Sections) */}
                <div className="mt-4 max-h-[calc(100vh-250px)] space-y-1.5 overflow-y-auto pr-1">
                  {ALL_PAGE_SECTIONS.map((item, index) => {
                    const isActive = activeSection === item.id;
                    const IconComponent = item.icon;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleSelectSection(item.id)}
                        className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[var(--surface-elevated)] text-blue-500'
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{item.label}</p>
                            <p
                              className={`line-clamp-1 text-[11px] ${
                                isActive ? 'text-blue-100' : 'text-[var(--text-muted)]'
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {isActive ? (
                          <ChevronRight className="h-4 w-4 text-white" />
                        ) : (
                          <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-blue-500">
                            0{index + 1}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom: Theme Switch */}
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <div className="bg-[var(--surface-elevated)]/60 flex items-center justify-between rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--text-primary)]">
                      Theme Mode
                    </span>
                    <span className="font-mono text-[10px] uppercase text-blue-500">
                      {resolvedMode}
                    </span>
                  </div>
                  <ThemeToggle className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)]" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. COMMAND PALETTE MODAL (Ctrl+K / Cmd+K Quick Section Jumping) */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
            {/* Backdrop Scrim */}
            <motion.div
              key="command-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setCommandOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Command Palette Dialog Box */}
            <motion.div
              key="command-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette"
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--surface-card)]/95 relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-subtle)] shadow-2xl backdrop-blur-2xl"
            >
              {/* Search Input Bar */}
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3.5">
                <Search className="h-5 w-5 text-blue-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedSearchIndex(0);
                  }}
                  onKeyDown={handleCommandKeyDown}
                  placeholder="Jump to section or search (e.g. Projects, Skills, Contact)..."
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                  aria-label="Search sections and commands"
                />
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="rounded-md p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    aria-label="Clear query"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                    ESC
                  </kbd>
                )}
              </div>

              {/* Quick Actions & Section Results */}
              <div className="max-h-[380px] overflow-y-auto p-2">
                {filteredSections.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Page Sections ({filteredSections.length})
                    </div>
                    {filteredSections.map((item, idx) => {
                      const isSelected = idx === selectedSearchIndex;
                      const IconComponent = item.icon;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectSection(item.id)}
                          onMouseEnter={() => setSelectedSearchIndex(idx)}
                          className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[var(--surface-elevated)] text-blue-500'
                              }`}
                            >
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{item.label}</span>
                                <span
                                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                                    isSelected
                                      ? 'bg-white/20 text-blue-100'
                                      : 'bg-[var(--surface-elevated)] text-[var(--text-muted)]'
                                  }`}
                                >
                                  {item.category}
                                </span>
                              </div>
                              <p
                                className={`text-xs ${
                                  isSelected ? 'text-blue-100' : 'text-[var(--text-muted)]'
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-white/80" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      No matching sections found for &quot;{searchQuery}&quot;
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Try searching for &apos;projects&apos;, &apos;experience&apos;, or
                      &apos;contact&apos;.
                    </p>
                  </div>
                )}

                {/* Additional Quick Action: Theme Toggle */}
                <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">
                  <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    Quick Commands
                  </div>
                  <button
                    onClick={() => {
                      toggleMode();
                      setCommandOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--surface-elevated)] text-blue-500">
                        {resolvedMode === 'dark' ? (
                          <Sun className="h-3.5 w-3.5" />
                        ) : (
                          <Moon className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <span>Switch to {resolvedMode === 'dark' ? 'Light' : 'Dark'} Mode</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">Theme</span>
                  </button>
                </div>
              </div>

              {/* Command Palette Keyboard Hints Footer */}
              <div className="bg-[var(--surface-elevated)]/40 flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-2 text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-1 py-0.5 font-mono text-[10px]">
                      ↑
                    </kbd>
                    <kbd className="ml-0.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-1 py-0.5 font-mono text-[10px]">
                      ↓
                    </kbd>{' '}
                    Navigate
                  </span>
                  <span>
                    <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-1.5 py-0.5 font-mono text-[10px]">
                      ↵
                    </kbd>{' '}
                    Select
                  </span>
                  <span>
                    <kbd className="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] px-1.5 py-0.5 font-mono text-[10px]">
                      esc
                    </kbd>{' '}
                    Close
                  </span>
                </div>
                <span className="font-mono text-[10px]">10 Sections</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
