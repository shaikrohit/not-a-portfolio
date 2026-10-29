'use client';

import React, { useState } from 'react';
import type { CMSSkill } from '@/types/cms';
import { saveSkillAction, deleteSkillAction, saveDraftAction } from '@/app/_actions/cms';
import { Cpu, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Check, FileText, X } from 'lucide-react';

interface SkillsEditorProps {
  initialSkills: CMSSkill[];
  onRefresh: () => void;
}

const EMPTY_SKILL: CMSSkill = {
  id: '',
  name: '',
  category: 'framework',
  proficiency: 'proficient',
  years_experience: 1,
  icon_identifier: '',
  reasoning: '',
  business_outcome: '',
  sort_order: 99,
  is_published: true,
};

export function SkillsEditor({ initialSkills, onRefresh }: SkillsEditorProps) {
  const [skills, setSkills] = useState<CMSSkill[]>(initialSkills);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingSkill, setEditingSkill] = useState<CMSSkill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  const openAddModal = () => {
    const newSkill = {
      ...EMPTY_SKILL,
      id: crypto.randomUUID(),
      sort_order: skills.length + 1,
    };
    setEditingSkill(newSkill);
  };

  const openEditModal = (skill: CMSSkill) => {
    setEditingSkill({ ...skill });
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setIsSubmitting(true);
    setMessage(null);

    const res = await saveSkillAction(editingSkill);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Skill "${editingSkill.name}" saved successfully!` });
      setEditingSkill(null);
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save skill' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteSkillAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Skill "${name}" deleted.` });
      setSkills((prev) => prev.filter((s) => s.id !== id));
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const updated = [...skills];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved!);

    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setSkills(reordered);

    for (const item of reordered) {
      await saveSkillAction(item);
    }
    onRefresh();
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await saveDraftAction('skills', skills);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Skills matrix staged in drafts successfully!' });
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
            <Cpu className="h-5 w-5 text-cyan-400" />
            Skills Constellation Matrix
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Configure technical competencies, proficiency levels, years of experience, and business
            impact.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-cyan-500 hover:to-blue-500"
        >
          <Plus className="h-4 w-4" />
          Add Technology
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

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'framework', 'language', 'tool', 'concept'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                : 'border border-transparent bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSkills.map((skill, index) => (
          <div
            key={skill.id || skill.name}
            className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-cyan-500/30 sm:flex-row sm:items-center"
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
                  disabled={index === skills.length - 1}
                  className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{skill.name}</h3>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-400">
                    {skill.category}
                  </span>
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    {skill.proficiency}
                  </span>
                  <span className="text-xs text-zinc-500">{skill.years_experience} yrs</span>
                </div>
                {skill.reasoning && (
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{skill.reasoning}</p>
                )}
                {skill.business_outcome && (
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                    Impact: {skill.business_outcome}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openEditModal(skill)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(skill.id, skill.name)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                title="Delete Skill"
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
          Stage Skills in Drafts
        </button>
      </div>

      {/* Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingSkill(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-xl font-bold text-white">
              {editingSkill.id && skills.some((s) => s.id === editingSkill.id)
                ? 'Edit Technology'
                : 'Add Technology'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Technology / Skill Name
                </label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. Next.js"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Category
                  </label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        category: e.target.value as CMSSkill['category'],
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="framework">Framework</option>
                    <option value="language">Language</option>
                    <option value="tool">Tool</option>
                    <option value="concept">Concept</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Proficiency
                  </label>
                  <select
                    value={editingSkill.proficiency}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        proficiency: e.target.value as CMSSkill['proficiency'],
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="expert">Expert</option>
                    <option value="proficient">Proficient</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Years Used
                  </label>
                  <input
                    type="number"
                    value={editingSkill.years_experience}
                    onChange={(e) =>
                      setEditingSkill({
                        ...editingSkill,
                        years_experience: parseInt(e.target.value) || 1,
                      })
                    }
                    min={0}
                    max={20}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Engineering Rationale / Why This Matters
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.reasoning}
                  onChange={(e) => setEditingSkill({ ...editingSkill, reasoning: e.target.value })}
                  placeholder="Strict static typing eliminates runtime bugs..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Business Outcome & Impact
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.business_outcome}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, business_outcome: e.target.value })
                  }
                  placeholder="Drastically reduced defect rates across production..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
