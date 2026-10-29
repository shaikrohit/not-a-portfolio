'use client';

import React, { useState } from 'react';
import type { CMSExperience } from '@/types/cms';
import { saveExperienceAction, deleteExperienceAction, saveDraftAction } from '@/app/_actions/cms';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  FileText,
  X,
} from 'lucide-react';

interface ExperienceEditorProps {
  initialExperience: CMSExperience[];
  onRefresh: () => void;
}

const EMPTY_EXP: CMSExperience = {
  id: '',
  company: '',
  role: '',
  period: '',
  location: '',
  description: '',
  achievements: [],
  tech_used: [],
  sort_order: 99,
  is_published: true,
};

export function ExperienceEditor({ initialExperience, onRefresh }: ExperienceEditorProps) {
  const [experienceList, setExperienceList] = useState<CMSExperience[]>(initialExperience);
  const [editingExp, setEditingExp] = useState<CMSExperience | null>(null);
  const [achievementsText, setAchievementsText] = useState('');
  const [techUsedText, setTechUsedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    const newExp = {
      ...EMPTY_EXP,
      id: crypto.randomUUID(),
      sort_order: experienceList.length + 1,
    };
    setEditingExp(newExp);
    setAchievementsText('');
    setTechUsedText('');
  };

  const openEditModal = (exp: CMSExperience) => {
    setEditingExp({ ...exp });
    setAchievementsText(exp.achievements?.join('\n') || '');
    setTechUsedText(exp.tech_used?.join(', ') || '');
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    setIsSubmitting(true);
    setMessage(null);

    const parsedAchievements = achievementsText
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const parsedTech = techUsedText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const expToSave: CMSExperience = {
      ...editingExp,
      achievements: parsedAchievements,
      tech_used: parsedTech,
    };

    const res = await saveExperienceAction(expToSave);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: `Experience at "${expToSave.company}" saved successfully!`,
      });
      setEditingExp(null);
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save experience' });
    }
  };

  const handleDelete = async (id: string, company: string) => {
    if (!confirm(`Are you sure you want to delete experience at "${company}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteExperienceAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Experience at "${company}" deleted.` });
      setExperienceList((prev) => prev.filter((e) => e.id !== id));
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experienceList.length) return;

    const updated = [...experienceList];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved!);

    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setExperienceList(reordered);

    for (const item of reordered) {
      await saveExperienceAction(item);
    }
    onRefresh();
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await saveDraftAction('experience', experienceList);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Experience staged in drafts successfully!' });
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
            <Briefcase className="h-5 w-5 text-indigo-400" />
            Career & Experience Track
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Showcase your industry engineering roles, internships, and key impact milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500"
        >
          <Plus className="h-4 w-4" />
          Add Career Milestone
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
        {experienceList.map((exp, index) => (
          <div
            key={exp.id || exp.company}
            className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-indigo-500/30 sm:flex-row sm:items-center"
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
                  disabled={index === experienceList.length - 1}
                  className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{exp.role}</h3>
                  <span className="text-zinc-500">@</span>
                  <span className="font-semibold text-indigo-300">{exp.company}</span>
                  {!exp.is_published && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  {exp.period} • {exp.location || 'India'}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {exp.achievements.length} bullet achievement points configured
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openEditModal(exp)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(exp.id, exp.company)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                title="Delete Experience"
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
          Stage Career in Drafts
        </button>
      </div>

      {/* Edit Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingExp(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-xl font-bold text-white">
              {editingExp.id && experienceList.some((e) => e.id === editingExp.id)
                ? 'Edit Career Role'
                : 'Add New Career Role'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    placeholder="e.g. 2024 - Present"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="e.g. Tirupati, India"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Role Overview Description
                </label>
                <textarea
                  rows={2}
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Key Achievements (one per line)
                </label>
                <textarea
                  rows={4}
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  placeholder="Engineered conversational AI assistant workflows&#10;Developed responsive React frontends"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 font-mono text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={techUsedText}
                  onChange={(e) => setTechUsedText(e.target.value)}
                  placeholder="React, TypeScript, GenAI, Docker"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingExp.is_published}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, is_published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/10 bg-black/50 text-indigo-600 focus:ring-0"
                  />
                  Published Live
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Career Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
