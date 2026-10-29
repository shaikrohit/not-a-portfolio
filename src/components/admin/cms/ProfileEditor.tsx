'use client';

import React, { useState } from 'react';
import type { CMSProfile } from '@/types/cms';
import { updateProfileAction, saveDraftAction } from '@/app/_actions/cms';
import { DEFAULT_PROFILE } from '@/lib/cms/getContent';
import { Check, RefreshCw, FileText, User } from 'lucide-react';

interface ProfileEditorProps {
  initialProfile: CMSProfile;
  onRefresh: () => void;
}

export function ProfileEditor({ initialProfile, onRefresh }: ProfileEditorProps) {
  const [profile, setProfile] = useState<CMSProfile>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setMessage(null);
    const res = await saveDraftAction('profile', profile);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Profile changes saved to staged drafts!' });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save draft' });
    }
  };

  const handlePublishDirectly = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    const res = await updateProfileAction(profile);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated and published live immediately!' });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to publish profile' });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset profile fields to verified factory defaults?')) {
      setProfile(DEFAULT_PROFILE);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <User className="h-5 w-5 text-blue-400" />
            Profile & Hero Identity
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Control your global personal brand, hero taglines, bio paragraphs, and social profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset to Factory Defaults
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handlePublishDirectly} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Professional Title
            </label>
            <input
              type="text"
              name="professional_title"
              value={profile.professional_title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Headline Tagline
            </label>
            <input
              type="text"
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Bio & Narrative Summary
          </label>
          <textarea
            name="bio"
            rows={4}
            value={profile.bio}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm leading-relaxed text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Primary Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              GitHub Profile URL
            </label>
            <input
              type="url"
              name="github_url"
              value={profile.github_url}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={profile.linkedin_url}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Resume Document URL (Supabase Storage / Public)
          </label>
          <input
            type="text"
            name="resume_url"
            value={profile.resume_url}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 transition-all hover:bg-purple-500/20 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            Save Staged Draft
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Publish Changes Live
          </button>
        </div>
      </form>
    </div>
  );
}
