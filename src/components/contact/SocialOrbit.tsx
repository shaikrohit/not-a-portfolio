'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Globe, Play, Pause, ArrowUpRight } from 'lucide-react';
import { profile } from '@/content/config';

interface OrbitItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeText: string;
  angleDeg: number;
}

const ORBIT_ITEMS: OrbitItem[] = [
  {
    id: 'github',
    name: 'GitHub',
    handle: '@shaikrohit',
    url: profile.github,
    icon: Github,
    accentColor: '#3b82f6',
    badgeText: 'Code & Repos',
    angleDeg: 270, // Top / 12 o'clock
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'in/rohitshaik',
    url: profile.linkedin,
    icon: Linkedin,
    accentColor: '#0a66c2',
    badgeText: 'Network',
    angleDeg: 0, // Right / 3 o'clock
  },
  {
    id: 'email',
    name: 'Email',
    handle: 'shaik.rohit.official',
    url: `mailto:${profile.email}`,
    icon: Mail,
    accentColor: '#ea4335',
    badgeText: 'Direct Mail',
    angleDeg: 90, // Bottom / 6 o'clock
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    handle: 'shaikrohit.tech',
    url: 'https://shaikrohit.tech',
    icon: Globe,
    accentColor: '#8b5cf6',
    badgeText: 'Live System',
    angleDeg: 180, // Left / 9 o'clock
  },
];

export function SocialOrbit() {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-xl backdrop-blur-xl transition-all duration-300 sm:p-6 sm:p-8">
      {/* Background radial decorative glows */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header Badge & Pause Control */}
      <div className="z-10 flex w-full items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Verified Digital Orbit
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-blue-500/40 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={isPaused ? 'Resume orbit rotation' : 'Pause orbit rotation'}
          title={isPaused ? 'Resume orbit rotation' : 'Pause orbit rotation'}
        >
          {isPaused || reducedMotion ? (
            <>
              <Play className="h-3 w-3 text-emerald-500" />
              <span className="hidden sm:inline">Resume</span>
            </>
          ) : (
            <>
              <Pause className="h-3 w-3" />
              <span className="hidden sm:inline">Pause</span>
            </>
          )}
        </button>
      </div>

      {/* Orbit Visualization Stage */}
      <div
        className="social-orbit-container group relative my-4 flex aspect-square w-full max-w-[280px] items-center justify-center min-[360px]:max-w-[340px] sm:max-w-[420px]"
        data-paused={isPaused || reducedMotion}
      >
        {/* Outer Orbit Track Border - dynamically sized to exact orbit diameter */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-500/25 dark:border-blue-400/20"
          style={{
            width: 'calc(var(--orbit-distance) * -2)',
            height: 'calc(var(--orbit-distance) * -2)',
          }}
          aria-hidden="true"
        />

        {/* Inner Decorative Harmonic Track */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10 dark:border-white/5 sm:h-32 sm:w-32"
          aria-hidden="true"
        />

        {/* Center Core Node (Avatar / Identity Hub) */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500/40 bg-[var(--surface-elevated)] p-1.5 shadow-lg shadow-blue-500/15 backdrop-blur-xl transition-transform duration-300 hover:scale-105 sm:h-20 sm:w-20 md:h-24 md:w-24">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 text-center">
              <span className="font-serif text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg md:text-xl">
                SR
              </span>
              <span className="text-[8px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 sm:text-[9px]">
                Core
              </span>
            </div>

            {/* Pulsing beacon ping ring */}
            <span
              className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-blue-500/20 [animation-duration:3s] motion-reduce:hidden"
              aria-hidden="true"
            />
          </div>

          <div className="mt-1 text-center sm:mt-2">
            <p className="text-[11px] font-semibold leading-tight text-[var(--text-primary)] sm:text-xs">
              Shaik Rohit
            </p>
            <p className="text-[9px] leading-tight text-[var(--text-muted)] sm:text-[10px]">
              Full Stack & AI
            </p>
          </div>
        </div>

        {/* Rotating Track Wrapper */}
        <div
          className="social-orbit-track absolute inset-0 flex items-center justify-center"
          data-paused={isPaused || reducedMotion}
        >
          {ORBIT_ITEMS.map((item) => {
            const Icon = item.icon;
            const isHovered = activeItem === item.id;

            return (
              <div
                key={item.id}
                className="social-orbit-node absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${item.angleDeg}deg) translateY(var(--orbit-distance)) rotate(-${item.angleDeg}deg)`,
                }}
              >
                {/* Counter-rotating child wrapper to keep content upright */}
                <div
                  className="social-orbit-node-inner flex items-center justify-center"
                  data-paused={isPaused || reducedMotion}
                >
                  <a
                    href={item.url}
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onMouseEnter={() => setActiveItem(item.id)}
                    onMouseLeave={() => setActiveItem(null)}
                    onFocus={() => setActiveItem(item.id)}
                    onBlur={() => setActiveItem(null)}
                    aria-label={`Visit Shaik Rohit's ${item.name} (${item.handle})`}
                    className={`group/node relative flex items-center gap-1.5 rounded-xl border border-[var(--border-light)] bg-[var(--surface-card)] px-2.5 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-2 sm:hover:scale-110 ${
                      isHovered ? 'scale-105 border-blue-500 shadow-md shadow-blue-500/20' : ''
                    }`}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 sm:rounded-xl"
                      style={{
                        backgroundColor: `${item.accentColor}18`,
                        color: item.accentColor,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                          {item.name}
                        </span>
                        <ArrowUpRight className="h-2.5 w-2.5 text-[var(--text-muted)] opacity-0 transition-opacity group-hover/node:opacity-100" />
                      </div>
                      <span className="hidden text-[10px] leading-tight text-[var(--text-muted)] sm:inline-block">
                        {item.handle}
                      </span>
                    </div>

                    {/* Popout badge on hover */}
                    <span
                      className={`pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[9px] font-medium text-blue-600 shadow transition-all duration-200 dark:text-blue-400 ${
                        isHovered ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                      }`}
                    >
                      {item.badgeText}
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        Hover to inspect • Click to navigate to verified profiles
      </p>

      {/* Scoped CSS for hardware-accelerated 360 rotation & counter-rotation */}
      <style>{`
        .social-orbit-container {
          --orbit-distance: -95px;
        }
        @media (min-width: 360px) {
          .social-orbit-container {
            --orbit-distance: -110px;
          }
        }
        @media (min-width: 480px) {
          .social-orbit-container {
            --orbit-distance: -130px;
          }
        }
        @media (min-width: 640px) {
          .social-orbit-container {
            --orbit-distance: -150px;
          }
        }

        .social-orbit-track {
          animation: socialOrbitSpin 36s linear infinite;
        }

        .social-orbit-node-inner {
          animation: socialOrbitCounter 36s linear infinite;
        }

        @keyframes socialOrbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes socialOrbitCounter {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        /* Hover & Focus Pauses */
        .social-orbit-container:hover .social-orbit-track,
        .social-orbit-container:hover .social-orbit-node-inner,
        .social-orbit-container:focus-within .social-orbit-track,
        .social-orbit-container:focus-within .social-orbit-node-inner,
        .social-orbit-track[data-paused="true"],
        .social-orbit-node-inner[data-paused="true"] {
          animation-play-state: paused !important;
        }

        /* Prefers-reduced-motion fallback */
        @media (prefers-reduced-motion: reduce) {
          .social-orbit-track,
          .social-orbit-node-inner {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SocialOrbit;
