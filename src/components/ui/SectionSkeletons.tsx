'use client';

import React from 'react';

export function PathSelectionSkeleton() {
  return (
    <div className="bg-[var(--surface-elevated)]/40 relative overflow-hidden px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-3 h-5 w-28 animate-pulse rounded-full bg-blue-500/10" />
          <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-[var(--surface-card)]" />
          <div className="bg-[var(--surface-card)]/60 mx-auto mt-4 h-4 w-96 max-w-full animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-10 w-64 animate-pulse rounded-lg bg-[var(--surface-card)]" />
          <div className="bg-[var(--surface-card)]/60 mt-4 h-4 w-80 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="h-96 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 md:col-span-7" />
          <div className="h-96 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 md:col-span-5" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <div className="mb-3 h-5 w-32 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-10 w-80 animate-pulse rounded-lg bg-[var(--surface-card)]" />
          <div className="bg-[var(--surface-card)]/60 mt-3 h-4 w-96 max-w-full animate-pulse rounded" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function EducationSkeleton() {
  return (
    <div className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="mb-3 h-5 w-32 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-10 w-72 animate-pulse rounded-lg bg-[var(--surface-card)]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6" />
          <div className="h-64 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6" />
        </div>
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="mb-3 h-5 w-32 animate-pulse rounded-full bg-blue-500/10" />
          <div className="h-10 w-80 animate-pulse rounded-lg bg-[var(--surface-card)]" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 h-5 w-28 animate-pulse rounded-full bg-blue-500/10" />
            <div className="h-10 w-72 animate-pulse rounded-lg bg-[var(--surface-card)]" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-xl bg-[var(--surface-card)]" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 h-5 w-32 animate-pulse rounded-full bg-blue-500/10" />
            <div className="h-10 w-80 animate-pulse rounded-lg bg-[var(--surface-card)]" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-36 animate-pulse rounded-xl bg-[var(--surface-card)]" />
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8" />
      </div>
    </div>
  );
}

export function TriviaSkeleton() {
  return (
    <div className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-3 h-5 w-28 animate-pulse rounded-full bg-purple-500/10" />
          <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-[var(--surface-card)]" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8" />
      </div>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-32 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mx-auto mb-4 h-5 w-36 animate-pulse rounded-full bg-blue-500/10" />
          <div className="mx-auto h-12 w-96 max-w-full animate-pulse rounded-lg bg-[var(--surface-card)]" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-96 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 lg:col-span-7" />
          <div className="h-96 animate-pulse rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 lg:col-span-5" />
        </div>
      </div>
    </div>
  );
}
