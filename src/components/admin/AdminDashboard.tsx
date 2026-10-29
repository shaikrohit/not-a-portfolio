'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllTriviaScores,
  editTriviaScore,
  logoutAdmin,
  adminApproveScore,
  adminDeleteScore,
} from '@/app/_actions/adminTrivia';
import { getAdminCMSData } from '@/app/_actions/cms';
import type { AllPortfolioContent, CMSContentDraft } from '@/types/cms';
import {
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCE,
  DEFAULT_EDUCATION,
  DEFAULT_SKILLS,
  DEFAULT_ACHIEVEMENTS,
} from '@/lib/cms/getContent';

import ResumeManager from './ResumeManager';
import { ProfileEditor } from './cms/ProfileEditor';
import { ProjectsEditor } from './cms/ProjectsEditor';
import { ExperienceEditor } from './cms/ExperienceEditor';
import { EducationEditor } from './cms/EducationEditor';
import { SkillsEditor } from './cms/SkillsEditor';
import { AchievementsEditor } from './cms/AchievementsEditor';
import { MediaVault } from './cms/MediaVault';
import { PublishManager } from './cms/PublishManager';
import { LivePreviewModal } from './cms/LivePreviewModal';

import {
  User,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Cpu,
  Trophy,
  UploadCloud,
  Rocket,
  Gamepad2,
  FileText,
  Eye,
  LogOut,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface TriviaScore {
  id: string;
  username: string;
  score: number;
  created_at: string;
  is_approved: boolean;
}

type TabType =
  | 'profile'
  | 'projects'
  | 'experience'
  | 'education'
  | 'skills'
  | 'achievements'
  | 'media'
  | 'publish'
  | 'trivia'
  | 'resume';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [cmsData, setCmsData] = useState<AllPortfolioContent>({
    profile: DEFAULT_PROFILE,
    projects: DEFAULT_PROJECTS,
    experience: DEFAULT_EXPERIENCE,
    education: DEFAULT_EDUCATION,
    skills: DEFAULT_SKILLS,
    achievements: DEFAULT_ACHIEVEMENTS,
  });
  const [drafts, setDrafts] = useState<CMSContentDraft[]>([]);
  const [loadingCMS, setLoadingCMS] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Trivia states
  const [scores, setScores] = useState<TriviaScore[]>([]);
  const [loadingTrivia, setLoadingTrivia] = useState(false);
  const [triviaSubTab, setTriviaSubTab] = useState<'pending' | 'live'>('pending');
  const [editingScore, setEditingScore] = useState<TriviaScore | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editScoreValue, setEditScoreValue] = useState(0);
  const [isSubmittingTrivia, setIsSubmittingTrivia] = useState(false);

  const router = useRouter();

  const fetchCMSData = useCallback(async () => {
    setLoadingCMS(true);
    const res = await getAdminCMSData();
    if (res.success && res.data) {
      setCmsData({
        profile: res.data.profile,
        projects: res.data.projects,
        experience: res.data.experience,
        education: res.data.education,
        skills: res.data.skills,
        achievements: res.data.achievements,
      });
      setDrafts(res.data.drafts || []);
    }
    setLoadingCMS(false);
  }, []);

  const fetchScores = useCallback(async () => {
    setLoadingTrivia(true);
    const { data, error } = await getAllTriviaScores();
    if (!error && data) {
      setScores(data as TriviaScore[]);
    }
    setLoadingTrivia(false);
  }, []);

  useEffect(() => {
    fetchCMSData();
    fetchScores();
  }, [fetchCMSData, fetchScores]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  // Trivia actions
  const handleApprove = async (id: string) => {
    const res = await adminApproveScore(id);
    if (res.success) {
      fetchScores();
    } else {
      alert(res.error || 'Failed to approve');
    }
  };

  const handleDeleteScore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score forever?')) return;
    const res = await adminDeleteScore(id);
    if (res.success) {
      fetchScores();
    } else {
      alert(res.error || 'Failed to delete');
    }
  };

  const openEditModal = (score: TriviaScore) => {
    setEditingScore(score);
    setEditUsername(score.username);
    setEditScoreValue(score.score);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScore) return;

    setIsSubmittingTrivia(true);
    const res = await editTriviaScore(editingScore.id, editUsername, editScoreValue);
    setIsSubmittingTrivia(false);

    if (res.success) {
      setEditingScore(null);
      fetchScores();
    } else {
      alert(res.error || 'Failed to edit score');
    }
  };

  const pendingScores = scores.filter((s) => !s.is_approved);
  const liveScores = scores.filter((s) => s.is_approved);
  const displayScores = triviaSubTab === 'pending' ? pendingScores : liveScores;

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'profile', label: 'Profile & Hero', icon: User },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: cmsData.projects.length },
    { id: 'experience', label: 'Career', icon: Briefcase, count: cmsData.experience.length },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills Matrix', icon: Cpu, count: cmsData.skills.length },
    { id: 'achievements', label: 'Honors', icon: Trophy, count: cmsData.achievements.length },
    { id: 'media', label: 'Media Vault', icon: UploadCloud },
    {
      id: 'publish',
      label: 'Publish & Reset',
      icon: Rocket,
      count: drafts.length > 0 ? drafts.length : undefined,
    },
    {
      id: 'trivia',
      label: 'Trivia',
      icon: Gamepad2,
      count: pendingScores.length > 0 ? pendingScores.length : undefined,
    },
    { id: 'resume', label: 'Resume PDF', icon: FileText },
  ];

  return (
    <div className="w-full">
      {/* Top Action Utility Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Admin HQ Online
            </span>
          </div>

          {drafts.length > 0 ? (
            <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              {drafts.length} Staged Change{drafts.length > 1 ? 's' : ''} in Drafts
            </span>
          ) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
              Production Synchronized
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            <Eye className="h-3.5 w-3.5" />
            Real-Time Preview
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Site
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="scrollbar-none mb-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'border border-purple-500/40 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-lg shadow-purple-500/10'
                  : 'border border-transparent bg-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                    isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {loadingCMS && activeTab !== 'trivia' && activeTab !== 'resume' ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-sm text-zinc-400">
          <RefreshCw className="mx-auto mb-3 h-6 w-6 animate-spin text-purple-400" />
          Loading CMS records from Supabase...
        </div>
      ) : (
        <>
          {activeTab === 'profile' && (
            <ProfileEditor initialProfile={cmsData.profile} onRefresh={fetchCMSData} />
          )}

          {activeTab === 'projects' && (
            <ProjectsEditor initialProjects={cmsData.projects} onRefresh={fetchCMSData} />
          )}

          {activeTab === 'experience' && (
            <ExperienceEditor initialExperience={cmsData.experience} onRefresh={fetchCMSData} />
          )}

          {activeTab === 'education' && (
            <EducationEditor initialEducation={cmsData.education} onRefresh={fetchCMSData} />
          )}

          {activeTab === 'skills' && (
            <SkillsEditor initialSkills={cmsData.skills} onRefresh={fetchCMSData} />
          )}

          {activeTab === 'achievements' && (
            <AchievementsEditor
              initialAchievements={cmsData.achievements}
              onRefresh={fetchCMSData}
            />
          )}

          {activeTab === 'media' && <MediaVault />}

          {activeTab === 'publish' && (
            <PublishManager
              drafts={drafts}
              onRefresh={fetchCMSData}
              onOpenPreview={() => setPreviewOpen(true)}
            />
          )}

          {activeTab === 'resume' && <ResumeManager />}

          {activeTab === 'trivia' && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setTriviaSubTab('pending')}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    triviaSubTab === 'pending'
                      ? 'border border-purple-500/30 bg-purple-500/20 text-purple-300'
                      : 'border border-transparent bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Pending Approvals
                  {pendingScores.length > 0 && (
                    <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                      {pendingScores.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTriviaSubTab('live')}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    triviaSubTab === 'live'
                      ? 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                      : 'border border-transparent bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  Live Leaderboard
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-white/5 text-xs font-semibold uppercase text-zinc-300">
                      <tr>
                        <th className="px-6 py-4">Player</th>
                        <th className="px-6 py-4">Score</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingTrivia ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                            Loading scores...
                          </td>
                        </tr>
                      ) : displayScores.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                            No {triviaSubTab} scores found.
                          </td>
                        </tr>
                      ) : (
                        displayScores.map((score) => (
                          <tr
                            key={score.id}
                            className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                          >
                            <td className="px-6 py-4 font-medium text-white">{score.username}</td>
                            <td className="px-6 py-4 font-bold text-purple-400">
                              {score.score} pts
                            </td>
                            <td className="px-6 py-4">
                              {new Date(score.created_at).toLocaleDateString()}
                            </td>
                            <td className="space-x-3 px-6 py-4 text-right">
                              {triviaSubTab === 'pending' && (
                                <button
                                  onClick={() => handleApprove(score.id)}
                                  className="text-emerald-400 hover:text-emerald-300"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => openEditModal(score)}
                                className="text-cyan-400 hover:text-cyan-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteScore(score.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Trivia Edit Modal */}
      {editingScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-white">Edit Score</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">Score</label>
                <input
                  type="number"
                  value={editScoreValue}
                  onChange={(e) => setEditScoreValue(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-white focus:outline-none"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingTrivia}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-2 font-medium text-white hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  {isSubmittingTrivia ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingScore(null)}
                  className="rounded-xl bg-white/10 px-6 py-2 font-medium text-white hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewOpen && <LivePreviewModal content={cmsData} onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}
