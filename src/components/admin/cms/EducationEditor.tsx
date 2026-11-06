'use client';

import React, { useState } from 'react';
import type { CMSEducation } from '@/types/cms';
import { saveEducationAction, deleteEducationAction, saveDraftAction } from '@/app/_actions/cms';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Check,
  FileText,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface EducationEditorProps {
  initialEducation: CMSEducation[];
  onRefresh: () => void;
}

const EMPTY_EDU: CMSEducation = {
  id: '',
  institution: '',
  degree: '',
  field_of_study: '',
  period: '',
  location: '',
  grade: 'Pursuing',
  status: 'pursuing',
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
    const newEdu: CMSEducation = {
      ...EMPTY_EDU,
      id: crypto.randomUUID(),
      sort_order: educationList.length + 1,
      status: 'pursuing',
      grade: 'Pursuing',
    };
    setEditingEdu(newEdu);
    setCourseworkText('');
    setHonorsText('');
  };

  const openEditModal = (edu: CMSEducation) => {
    setEditingEdu({
      ...edu,
      status:
        edu.status ||
        (edu.grade?.toLowerCase().includes('pursuing') ||
        edu.period?.toLowerCase().includes('pursuing')
          ? 'pursuing'
          : 'completed'),
    });
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

    const finalGrade =
      editingEdu.status === 'pursuing' && (!editingEdu.grade || editingEdu.grade.trim() === '')
        ? 'Pursuing'
        : editingEdu.grade || 'Completed';

    const eduToSave: CMSEducation = {
      ...editingEdu,
      grade: finalGrade,
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            Education & Coursework
          </h2>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Manage academic institutions, LinkedIn-style pursuing/completed status, grades, and
            coursework.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Academic Program
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl p-3.5 text-xs font-medium sm:text-sm ${
            message.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {educationList.map((edu) => {
          const isPursuing =
            edu.status === 'pursuing' ||
            (edu.grade && edu.grade.toLowerCase().includes('pursuing')) ||
            (edu.period && edu.period.toLowerCase().includes('pursuing'));

          return (
            <div
              key={edu.id || edu.institution}
              className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-emerald-500/30 sm:p-5 md:flex-row md:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words text-sm font-bold text-white sm:text-base">
                    {edu.institution}
                  </h3>

                  {/* LinkedIn-style Status Badges */}
                  {isPursuing ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Currently Pursuing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                      Completed ({edu.grade || 'Graduated'})
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-zinc-300 sm:text-sm">
                  <span className="font-medium text-white">{edu.degree}</span>
                  {edu.field_of_study && <span> • {edu.field_of_study}</span>}
                  <span className="text-zinc-400"> ({edu.period})</span>
                </p>

                {edu.location && <p className="mt-0.5 text-xs text-zinc-400">{edu.location}</p>}

                {edu.coursework?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {edu.coursework.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300 sm:text-[11px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex w-full shrink-0 items-center justify-end gap-2 self-end border-t border-white/5 pt-2 md:w-auto md:self-center md:border-t-0 md:pt-0">
                <button
                  type="button"
                  onClick={() => openEditModal(edu)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-white/10"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(edu.id, edu.institution)}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 transition-colors hover:bg-red-500/20 sm:p-2"
                  title="Delete"
                  aria-label="Delete education entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 transition-all hover:bg-purple-500/20 disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <FileText className="h-4 w-4" />
          Stage Education in Drafts
        </button>
      </div>

      {/* Responsive Edit/Add Modal */}
      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 backdrop-blur-md sm:p-4 md:p-6">
          <div className="relative my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={() => setEditingEdu(null)}
              className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 pr-8">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                {editingEdu.id && educationList.some((e) => e.id === editingEdu.id)
                  ? 'Edit Academic Record'
                  : 'Add Academic Record'}
              </h3>
              <p className="mt-0.5 text-xs text-zinc-400">
                Configure institution, LinkedIn-style pursuing/completed status, degree, and
                coursework.
              </p>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* LinkedIn-Style Status Toggle */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Academic Status (LinkedIn-Style)
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingEdu({
                        ...editingEdu,
                        status: 'pursuing',
                        grade:
                          editingEdu.grade === '88.5%' || editingEdu.grade === '96%'
                            ? 'Pursuing'
                            : editingEdu.grade || 'Pursuing',
                      })
                    }
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      editingEdu.status === 'pursuing'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm shadow-emerald-500/20'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        editingEdu.status === 'pursuing'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-zinc-400'
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        Currently Pursuing
                        {editingEdu.status === 'pursuing' && (
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Currently studying / in progress
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingEdu({
                        ...editingEdu,
                        status: 'completed',
                        grade: editingEdu.grade === 'Pursuing' ? '' : editingEdu.grade,
                      })
                    }
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      editingEdu.status === 'completed'
                        ? 'border-blue-500 bg-blue-500/15 text-white shadow-sm shadow-blue-500/20'
                        : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        editingEdu.status === 'completed'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-zinc-400'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Completed</div>
                      <div className="text-[11px] text-zinc-400">Graduated / course completed</div>
                    </div>
                  </button>
                </div>

                {/* Additional Checkbox for Quick LinkedIn Sync */}
                <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-2">
                  <input
                    type="checkbox"
                    id="currently-studying-checkbox"
                    checked={editingEdu.status === 'pursuing'}
                    onChange={(e) =>
                      setEditingEdu({
                        ...editingEdu,
                        status: e.target.checked ? 'pursuing' : 'completed',
                        grade: e.target.checked ? 'Pursuing' : '',
                      })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-black/50 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="currently-studying-checkbox"
                    className="cursor-pointer select-none text-xs text-zinc-300"
                  >
                    I am currently studying here (renders active pursuing badge)
                  </label>
                </div>
              </div>

              {/* Institution Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={editingEdu.institution}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="e.g. Madanapalle Institute of Technology & Science"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                />
              </div>

              {/* Degree & Field of Study Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    value={editingEdu.degree}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                    placeholder="e.g. B.Tech or Diploma (DCME)"
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Field of Study / Specialization
                  </label>
                  <input
                    type="text"
                    value={editingEdu.field_of_study || ''}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, field_of_study: e.target.value })
                    }
                    placeholder="e.g. CSE (Cyber Security)"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                  />
                </div>
              </div>

              {/* Period & Location Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Time Period *
                  </label>
                  <input
                    type="text"
                    value={editingEdu.period}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    placeholder={
                      editingEdu.status === 'pursuing' ? 'e.g. 2026 - 2029' : 'e.g. 2023 - 2026'
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Aggregate Grade / Percentage{' '}
                    {editingEdu.status === 'pursuing' ? '(Optional)' : '*'}
                  </label>
                  <input
                    type="text"
                    value={editingEdu.grade}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder={
                      editingEdu.status === 'pursuing'
                        ? 'Pursuing (or current GPA)'
                        : 'e.g. 88.5% or 9.0 CGPA'
                    }
                    required={editingEdu.status === 'completed'}
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Location
                </label>
                <input
                  type="text"
                  value={editingEdu.location}
                  onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                  placeholder="e.g. Madanapalle, Andhra Pradesh, India"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                />
              </div>

              {/* Coursework Area */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Key Academic Coursework (one per line)
                </label>
                <textarea
                  rows={3}
                  value={courseworkText}
                  onChange={(e) => setCourseworkText(e.target.value)}
                  placeholder="Cybersecurity & Defense&#10;Network Security&#10;Ethical Hacking & Penetration Testing&#10;Data Structures & Algorithms"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 font-mono text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                />
              </div>

              {/* Honors Area */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Honors, Activities & Societies (one per line)
                </label>
                <textarea
                  rows={2}
                  value={honorsText}
                  onChange={(e) => setHonorsText(e.target.value)}
                  placeholder="Second-Year B.Tech Student in Cyber Security&#10;OWASP Open-Source Security Contributor&#10;Active CTF Competitor"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 font-mono text-xs text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm"
                />
              </div>

              <div className="flex flex-col-reverse items-center justify-end gap-2.5 border-t border-white/10 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-50 sm:w-auto sm:text-sm"
                >
                  <Check className="h-4 w-4" />
                  Save Academic Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
