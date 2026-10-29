'use client';

import React, { useState } from 'react';
import type { AllPortfolioContent } from '@/types/cms';
import { X, Smartphone, Monitor, ExternalLink } from 'lucide-react';

interface LivePreviewModalProps {
  content: AllPortfolioContent;
  onClose: () => void;
}

export function LivePreviewModal({ content, onClose }: LivePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTab, setPreviewTab] = useState<
    'profile' | 'projects' | 'experience' | 'education' | 'skills' | 'achievements'
  >('projects');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">In-Admin Real-Time Preview</h3>
            <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              Live Mocking
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Device Toggle */}
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  device === 'desktop' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  device === 'mobile' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10"
            >
              Open Live Site
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section Sub-Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 bg-black/40 px-6 py-2.5">
          {[
            { id: 'profile', label: 'Hero & Profile' },
            { id: 'projects', label: `Projects (${content.projects.length})` },
            { id: 'experience', label: `Experience (${content.experience.length})` },
            { id: 'education', label: 'Education' },
            { id: 'skills', label: `Skills (${content.skills.length})` },
            { id: 'achievements', label: `Honors (${content.achievements.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPreviewTab(tab.id as any)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                previewTab === tab.id
                  ? 'border border-purple-500/30 bg-purple-500/20 text-purple-300'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Preview Frame */}
        <div className="flex flex-1 justify-center overflow-y-auto bg-zinc-900/60 p-6">
          <div
            className={`w-full transition-all duration-300 ${
              device === 'mobile'
                ? 'max-w-sm rounded-3xl border-4 border-zinc-700 bg-black p-4 shadow-2xl'
                : 'max-w-4xl rounded-2xl border border-white/10 bg-black/50 p-6'
            }`}
          >
            {previewTab === 'profile' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <h1 className="text-3xl font-bold text-white">{content.profile.full_name}</h1>
                  <p className="mt-1 text-sm font-medium text-blue-400">
                    {content.profile.professional_title}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">{content.profile.headline}</p>
                  <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-zinc-300">
                    {content.profile.bio}
                  </p>
                  <div className="mt-4 flex justify-center gap-3 text-xs text-zinc-400">
                    <span>{content.profile.location}</span>
                    <span>•</span>
                    <span>{content.profile.email}</span>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'projects' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {content.projects.map((p) => (
                  <div
                    key={p.slug || p.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{p.title}</h4>
                      {p.is_featured && (
                        <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{p.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tech_stack?.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 text-[11px] text-zinc-500">
                      ★ {p.stars_count} stars • {p.commits_count} commits
                    </div>
                  </div>
                ))}
              </div>
            )}

            {previewTab === 'experience' && (
              <div className="space-y-4">
                {content.experience.map((e) => (
                  <div key={e.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white">{e.role}</h4>
                        <p className="text-xs text-indigo-400">{e.company}</p>
                      </div>
                      <span className="text-xs text-zinc-400">{e.period}</span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-300">{e.description}</p>
                    {e.achievements?.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-400">
                        {e.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {previewTab === 'education' && (
              <div className="space-y-4">
                {content.education.map((edu) => (
                  <div key={edu.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white">{edu.institution}</h4>
                        <p className="text-xs text-emerald-400">
                          {edu.degree} ({edu.period})
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
                        {edu.grade}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">{edu.location}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {edu.coursework?.map((c, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {previewTab === 'skills' && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {content.skills.map((s) => (
                  <div
                    key={s.id || s.name}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{s.name}</span>
                      <span className="text-[10px] text-cyan-400">{s.proficiency}</span>
                    </div>
                    <span className="text-[10px] uppercase text-zinc-500">{s.category}</span>
                  </div>
                ))}
              </div>
            )}

            {previewTab === 'achievements' && (
              <div className="space-y-3">
                {content.achievements.map((a) => (
                  <div
                    key={a.id || a.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-white">{a.title}</h4>
                      <span className="text-xs text-amber-400">{a.badge}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{a.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
