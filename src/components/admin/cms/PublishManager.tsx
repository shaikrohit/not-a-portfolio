'use client';

import React, { useState } from 'react';
import type { CMSContentDraft } from '@/types/cms';
import {
  publishAllDraftsAction,
  publishDraftAction,
  discardDraftAction,
  emergencyResetToDefaultsAction,
} from '@/app/_actions/cms';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface PublishManagerProps {
  drafts: CMSContentDraft[];
  onRefresh: () => void;
  onOpenPreview: () => void;
}

export function PublishManager({ drafts, onRefresh, onOpenPreview }: PublishManagerProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePublishAll = async () => {
    setIsPublishing(true);
    setMessage(null);
    const res = await publishAllDraftsAction();
    setIsPublishing(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: 'All staged drafts have been published live and Next.js cache revalidated!',
      });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to publish drafts' });
    }
  };

  const handlePublishSingle = async (section: string) => {
    setIsPublishing(true);
    setMessage(null);
    const res = await publishDraftAction(section);
    setIsPublishing(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Section "${section}" published live successfully!` });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to publish draft' });
    }
  };

  const handleDiscard = async (section: string) => {
    if (!confirm(`Discard pending draft for section "${section}"?`)) return;

    const res = await discardDraftAction(section);
    if (res.success) {
      setMessage({ type: 'success', text: `Draft for "${section}" discarded.` });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to discard' });
    }
  };

  const handleEmergencyReset = async () => {
    if (
      !confirm(
        'EMERGENCY FACTORY RESET: This will reset all portfolio sections (Profile, Projects, Career, Education, Skills, Honors) back to verified factory defaults in src/content/config.ts. Are you sure?'
      )
    ) {
      return;
    }

    setIsResetting(true);
    setMessage(null);
    const res = await emergencyResetToDefaultsAction('all');
    setIsResetting(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: 'EMERGENCY RESET COMPLETE: All portfolio sections restored to verified factory defaults!',
      });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Emergency reset failed' });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Rocket className="h-5 w-5 text-purple-400" />
            Publishing Pipeline & Disaster Recovery
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Review staged drafts, preview changes before pushing live, and execute emergency factory
            resets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            <Eye className="h-4 w-4" />
            Live Preview
          </button>

          <button
            type="button"
            onClick={handlePublishAll}
            disabled={isPublishing || drafts.length === 0}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:from-purple-500 hover:to-cyan-500 disabled:opacity-40"
          >
            {isPublishing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            Publish All Changes ({drafts.length})
          </button>
        </div>
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

      {/* Staged Drafts Section */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Staged Modifications ({drafts.length} pending)
        </h3>

        {drafts.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-black/30 p-8 text-center text-sm text-zinc-500">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
            All sections are in sync with live production. No pending drafts.
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => (
              <div
                key={d.section}
                className="flex items-center justify-between rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase text-white">{d.section}</span>
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                      Staged Draft
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">
                    Staged at{' '}
                    {d.updated_at ? new Date(d.updated_at).toLocaleTimeString() : 'Recently'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePublishSingle(d.section)}
                    disabled={isPublishing}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Publish This Section
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDiscard(d.section)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20"
                    title="Discard Draft"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Factory Reset Box */}
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">Emergency Factory Reset</h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              If unexpected database errors or corrupted records ever occur, execute a 1-click
              Emergency Reset. This wipes out CMS table anomalies and seamlessly restores all
              sections back to verified static defaults from{' '}
              <code className="text-zinc-300">src/content/config.ts</code>.
            </p>

            <button
              type="button"
              onClick={handleEmergencyReset}
              disabled={isResetting}
              className="mt-4 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/20 hover:bg-red-500 disabled:opacity-50"
            >
              {isResetting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              Execute Emergency Factory Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
