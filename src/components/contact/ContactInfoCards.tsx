'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Linkedin, Github, FileText, Copy, Check, ArrowUpRight } from 'lucide-react';
import { profile } from '@/content/config';

export function ContactInfoCards() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* Email Card with Copy-to-clipboard */}
        <div className="bg-[var(--surface-card)]/80 group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-4 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-[var(--surface-card)] hover:shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label={copied ? 'Email address copied' : 'Copy email address to clipboard'}
              className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:border-blue-500/40 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="font-semibold text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Direct Mail
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="mt-0.5 block truncate text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-blue-600 focus-visible:underline focus-visible:outline-none dark:hover:text-blue-400"
              title={profile.email}
            >
              {profile.email}
            </a>
          </div>

          {/* Screen reader live notification */}
          <span className="sr-only" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>
        </div>

        {/* Location & Timezone Card */}
        <div className="bg-[var(--surface-card)]/80 group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-4 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-[var(--surface-card)] hover:shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Remote / Relocate
            </span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Location & Zone
            </span>
            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--text-primary)]">
              {profile.location}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Timezone: IST (UTC+5:30)</p>
          </div>
        </div>

        {/* Professional Profiles Card (GitHub + LinkedIn) */}
        <div className="bg-[var(--surface-card)]/80 group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-4 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-[var(--surface-card)] hover:shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Linkedin className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-[var(--text-muted)]">Profiles</span>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Verified Networks
            </span>
            <div className="mt-1 flex items-center gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-primary)] transition-colors hover:border-blue-500/40 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                aria-label="Shaik Rohit on LinkedIn (opens in new tab)"
              >
                LinkedIn
                <ArrowUpRight className="h-2.5 w-2.5 text-[var(--text-muted)]" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-primary)] transition-colors hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:hover:text-white"
                aria-label="Shaik Rohit on GitHub (opens in new tab)"
              >
                <Github className="h-2.5 w-2.5" />
                GitHub
                <ArrowUpRight className="h-2.5 w-2.5 text-[var(--text-muted)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Resume / Curriculum Vitae Card */}
        <div className="bg-[var(--surface-card)]/80 group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-4 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:bg-[var(--surface-card)] hover:shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View or download Shaik Rohit's Resume PDF (opens in new tab)"
              className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-700 transition-all hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-300"
            >
              <span>View PDF</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Curriculum Vitae
            </span>
            <p className="mt-0.5 truncate text-xs font-semibold text-[var(--text-primary)]">
              Shaik Rohit — Resume
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Updated 2026 • Verified PDF</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoCards;
