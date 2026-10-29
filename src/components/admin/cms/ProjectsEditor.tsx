'use client';

import React, { useState } from 'react';
import type { CMSProject } from '@/types/cms';
import {
  saveProjectAction,
  deleteProjectAction,
  syncGitHubStatsForProjectsAction,
  saveDraftAction,
} from '@/app/_actions/cms';
import {
  FolderGit2,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  GitFork,
  ExternalLink,
  Github,
  Check,
  FileText,
  X,
} from 'lucide-react';

interface ProjectsEditorProps {
  initialProjects: CMSProject[];
  onRefresh: () => void;
}

const EMPTY_PROJECT: CMSProject = {
  id: '',
  slug: '',
  title: '',
  tagline: '',
  long_description: '',
  problem_solved: '',
  architecture_notes: '',
  tech_stack: [],
  github_url: '',
  live_url: '',
  thumbnail_url: '',
  stars_count: 0,
  forks_count: 0,
  commits_count: 0,
  is_featured: false,
  sort_order: 99,
  is_published: true,
};

export function ProjectsEditor({ initialProjects, onRefresh }: ProjectsEditorProps) {
  const [projects, setProjects] = useState<CMSProject[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [techStackInput, setTechStackInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openAddModal = () => {
    const newProj = {
      ...EMPTY_PROJECT,
      id: crypto.randomUUID(),
      sort_order: projects.length + 1,
    };
    setEditingProject(newProj);
    setTechStackInput('');
  };

  const openEditModal = (p: CMSProject) => {
    setEditingProject({ ...p });
    setTechStackInput(p.tech_stack?.join(', ') || '');
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSubmitting(true);
    setMessage(null);

    const parsedTechStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectToSave: CMSProject = {
      ...editingProject,
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tech_stack: parsedTechStack,
    };

    const res = await saveProjectAction(projectToSave);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Project "${projectToSave.title}" saved successfully!` });
      setEditingProject(null);
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save project' });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    setIsSubmitting(true);
    const res = await deleteProjectAction(id);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: `Project "${title}" deleted.` });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete project' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved!);

    // Reassign sort_order
    const reordered = updated.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setProjects(reordered);

    // Save batch or update
    for (const p of reordered) {
      await saveProjectAction(p);
    }
    onRefresh();
  };

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    setMessage(null);
    const res = await syncGitHubStatsForProjectsAction();
    setIsSyncing(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: `Live GitHub stars, forks, and metrics synced for ${res.updatedCount || 0} projects!`,
      });
      onRefresh();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to sync with GitHub' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    const res = await saveDraftAction('projects', projects);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'All projects staged in drafts successfully!' });
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
            <FolderGit2 className="h-5 w-5 text-purple-400" />
            Projects Showcase Studio
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your verified repositories, live architectures, star counters, and tech tags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncGitHub}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync GitHub Stars & Forks
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-500/20 hover:from-purple-500 hover:to-cyan-500"
          >
            <Plus className="h-4 w-4" />
            Add New Project
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

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div
            key={project.id || project.slug}
            className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-purple-500/30 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3 sm:items-center">
              {/* Order Buttons */}
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
                  disabled={index === projects.length - 1}
                  className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Move Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-white">{project.title}</h3>
                  {project.is_featured && (
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-purple-300">
                      Featured
                    </span>
                  )}
                  {!project.is_published && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
                      Draft / Hidden
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{project.tagline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    {project.stars_count} stars
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3 text-cyan-400" />
                    {project.forks_count} forks
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="line-clamp-1 max-w-xs text-zinc-400">
                    {project.tech_stack?.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white"
                  title="View on GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-cyan-400"
                  title="View Live Site"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => openEditModal(project)}
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id, project.title)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                title="Delete Project"
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
          Stage Projects in Drafts
        </button>
      </div>

      {/* Edit / Add Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="mb-4 text-xl font-bold text-white">
              {editingProject.id && projects.some((p) => p.id === editingProject.id)
                ? 'Edit Project'
                : 'Add New Project'}
            </h3>

            <form onSubmit={handleModalSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Slug / Identifier
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="e.g. smart-fifa-2026"
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Tagline / Short Summary
                </label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, tagline: e.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Long Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.long_description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, long_description: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Problem Solved
                  </label>
                  <input
                    type="text"
                    value={editingProject.problem_solved}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, problem_solved: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Architecture Notes
                  </label>
                  <input
                    type="text"
                    value={editingProject.architecture_notes}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, architecture_notes: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="React, Docker, TypeScript, Tailwind CSS"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.github_url}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, github_url: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.live_url}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, live_url: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3.5 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Stars Count
                  </label>
                  <input
                    type="number"
                    value={editingProject.stars_count}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        stars_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Forks Count
                  </label>
                  <input
                    type="number"
                    value={editingProject.forks_count}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        forks_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Commits Count
                  </label>
                  <input
                    type="number"
                    value={editingProject.commits_count}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        commits_count: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, is_featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/10 bg-black/50 text-purple-600 focus:ring-0"
                  />
                  Featured in Highlights
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, is_published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/10 bg-black/50 text-purple-600 focus:ring-0"
                  />
                  Published Live
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
