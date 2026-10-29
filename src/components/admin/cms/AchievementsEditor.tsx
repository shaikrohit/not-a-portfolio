'use client';

import React, { useState } from 'react';
import type { CMSAchievement } from '@/types/cms';
import {
  saveAchievementAction,
  deleteAchievementAction,
  saveDraftAction,
} from '@/app/_actions/cms';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';

interface AchievementsEditorProps {
  initialAchievements: CMSAchievement[];
  onRefresh: () => void;
}

const EMPTY_ACH: CMSAchievement = {
  id: '',
  title: '',
  issuer: '',
  date: '',
  badge: '',
  description: '',
  verification_url: '',
  sort_order: 99,
  is_published: true,
};

export function AchievementsEditor({ initialAchievements, onRefresh }: AchievementsEditorProps) {
  const [achievements, setAchievements] = useState<CMSAchievement[]>(initialAchievements);
  const [editingAch, setEditingAch] = useState<CMSAchievement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    const newAch = {
      ...EMPTY_ACH,
      id: crypto.randomUUID(),
      sort_order: achievements.length + 1,
    };
    setEditingAch(newAch);
  };

  const openEditModal = (ach: CMSAchievement) => {
    setEditingAch({ ...ach });
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;

    setIsSubmitting(true);
    setMessage(null);

    const res = await saveAchievementAction(editingAch);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: `Achievement "${editingAch.title}" saved successfully!`,
      });
      setEditingAch(null);
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save achievement' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteAchievementAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Achievement "${title}" deleted.` });
      setAchievements((prev) => prev.filter((a) => a.id !== id));
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= achievements.length) return;

    const updated = [...achievements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved!);

    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setAchievements(reordered);

    for (const item of reordered) {
      await saveAchievementAction(item);
    }
    onRefresh();
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await saveDraftAction('achievements', achievements);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Achievements staged in drafts successfully!' });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save draft' });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Trophy className="h-5 w-5 text-amber-400" />
            Honors & Accolades Editor
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Showcase hackathon victories, academic awards, and verified technical recognitions.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-yellow-500"
        >
          <Plus className="h-4 w-4" />
          Add Achievement
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

      <div className="space-y-3">
        {achievements.map((ach, index) => (
          <div
            key={ach.id || ach.title}
            className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-amber-500/30 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Move Up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === achievements.length - 1}
                  className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{ach.title}</h3>
                  {ach.badge && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-400">
                      {ach.badge}
                    </span>
                  )}
                  {ach.date && <span className="text-xs text-zinc-500">{ach.date}</span>}
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{ach.description}</p>
                {ach.issuer && (
                  <p className="mt-0.5 text-[11px] text-zinc-500">Issuer: {ach.issuer}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {ach.verification_url && (
                <a
                  href={ach.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-amber-400"
                  title="Verify Link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => openEditModal(ach)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ach.id, ach.title)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 text-sm font-semibold text-purple-300 transition-all hover:bg-purple-500/20 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          Stage Honors in Drafts
        </button>
      </div>

      {/* Edit Modal */}
      {editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingAch(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-xl font-bold text-white">
              {editingAch.id && achievements.some((a) => a.id === editingAch.id)
                ? 'Edit Achievement'
                : 'Add Achievement'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Award / Milestone Title
                </label>
                <input
                  type="text"
                  value={editingAch.title}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="e.g. 1st Prize — Regional Technical Innovation"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Badge Tagline
                  </label>
                  <input
                    type="text"
                    value={editingAch.badge}
                    onChange={(e) => setEditingAch({ ...editingAch, badge: e.target.value })}
                    placeholder="Hackathon Champion"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Year / Date
                  </label>
                  <input
                    type="text"
                    value={editingAch.date}
                    onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                    placeholder="2025"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={editingAch.issuer}
                  onChange={(e) => setEditingAch({ ...editingAch, issuer: e.target.value })}
                  placeholder="Regional Technical Hackathon"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Description & Context
                </label>
                <textarea
                  rows={3}
                  value={editingAch.description}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Verification / Proof URL
                </label>
                <input
                  type="url"
                  value={editingAch.verification_url}
                  onChange={(e) =>
                    setEditingAch({ ...editingAch, verification_url: e.target.value })
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAch(null)}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
