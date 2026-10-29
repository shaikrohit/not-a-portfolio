'use client';

import React, { useState } from 'react';
import type { CMSEducation } from '@/types/cms';
import { saveEducationAction, deleteEducationAction, saveDraftAction } from '@/app/_actions/cms';
import { GraduationCap, Plus, Edit2, Trash2, Check, FileText, X } from 'lucide-react';

interface EducationEditorProps {
  initialEducation: CMSEducation[];
  onRefresh: () => void;
}

const EMPTY_EDU: CMSEducation = {
  id: '',
  institution: '',
  degree: '',
  period: '',
  location: '',
  grade: '96%',
  coursework: [],
  honors: [],
  sort_order: 1,
  is_published: true,
};

export function EducationEditor({ initialEducation, onRefresh }: EducationEditorProps) {
  const [educationList, setEducationList] = useState<CMSEducation[]>(initialEducation);
  const [editingEdu, setEditingEdu] = useState<CMSEducation | null>(null);
  const [courseworkText, setCourseworkText] = useState('');
  const [honorsText, setHonorsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    const newEdu = {
      ...EMPTY_EDU,
      id: crypto.randomUUID(),
      sort_order: educationList.length + 1,
    };
    setEditingEdu(newEdu);
    setCourseworkText('');
    setHonorsText('');
  };

  const openEditModal = (edu: CMSEducation) => {
    setEditingEdu({ ...edu });
    setCourseworkText(edu.coursework?.join('\n') || '');
    setHonorsText(edu.honors?.join('\n') || '');
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    setIsSubmitting(true);
    setMessage(null);

    const parsedCoursework = courseworkText
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const parsedHonors = honorsText
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const eduToSave: CMSEducation = {
      ...editingEdu,
      coursework: parsedCoursework,
      honors: parsedHonors,
    };

    const res = await saveEducationAction(eduToSave);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: `Education at "${eduToSave.institution}" saved successfully!`,
      });
      setEditingEdu(null);
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save education' });
    }
  };

  const handleDelete = async (id: string, institution: string) => {
    if (!confirm(`Are you sure you want to delete education at "${institution}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteEducationAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Education at "${institution}" deleted.` });
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await saveDraftAction('education', educationList);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Education staged in drafts successfully!' });
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
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            Education & Coursework
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Configure academic degrees, scores (e.g. 96%), coursework badges, and honors.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500"
        >
          <Plus className="h-4 w-4" />
          Add Academic Program
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

      <div className="space-y-4">
        {educationList.map((edu) => (
          <div
            key={edu.id || edu.institution}
            className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-5 transition-all hover:border-emerald-500/30 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-white">{edu.institution}</h3>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  {edu.grade || '96%'}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-300">
                {edu.degree} ({edu.period})
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">{edu.location}</p>
              {edu.coursework?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {edu.coursework.map((c, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => openEditModal(edu)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(edu.id, edu.institution)}
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
          Stage Education in Drafts
        </button>
      </div>

      {/* Edit Modal */}
      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingEdu(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-xl font-bold text-white">
              {editingEdu.id && educationList.some((e) => e.id === editingEdu.id)
                ? 'Edit Academic Record'
                : 'Add Academic Record'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={editingEdu.institution}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Degree / Certification
                  </label>
                  <input
                    type="text"
                    value={editingEdu.degree}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Aggregate Grade / Percentage
                  </label>
                  <input
                    type="text"
                    value={editingEdu.grade}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder="96%"
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
                    value={editingEdu.period}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    placeholder="2023 - 2026"
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
                    value={editingEdu.location}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    placeholder="Kuppam, Andhra Pradesh, India"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Key Coursework (one per line)
                </label>
                <textarea
                  rows={4}
                  value={courseworkText}
                  onChange={(e) => setCourseworkText(e.target.value)}
                  placeholder="Data Structures & Algorithms&#10;Database Management & SQL"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 font-mono text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Honors & Accolades (one per line)
                </label>
                <textarea
                  rows={2}
                  value={honorsText}
                  onChange={(e) => setHonorsText(e.target.value)}
                  placeholder="Top percentile academic distinction"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 font-mono text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
