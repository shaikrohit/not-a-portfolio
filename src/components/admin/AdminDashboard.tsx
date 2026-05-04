'use client';

import { useEffect, useState } from 'react';
import {
  getAllTriviaScores,
  editTriviaScore,
  logoutAdmin,
  adminApproveScore,
  adminDeleteScore,
} from '@/app/_actions/adminTrivia';
import { useRouter } from 'next/navigation';

interface TriviaScore {
  id: string;
  username: string;
  score: number;
  created_at: string;
  is_approved: boolean;
}

export default function AdminDashboard() {
  const [scores, setScores] = useState<TriviaScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'live'>('pending');
  const [editingScore, setEditingScore] = useState<TriviaScore | null>(null);

  const [editUsername, setEditUsername] = useState('');
  const [editScoreValue, setEditScoreValue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    const { data, error } = await getAllTriviaScores();
    if (!error && data) {
      setScores(data as TriviaScore[]);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  const handleApprove = async (id: string) => {
    const res = await adminApproveScore(id);
    if (res.success) {
      fetchScores();
    } else {
      alert(res.error || 'Failed to approve');
    }
  };

  const handleDelete = async (id: string) => {
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

    setIsSubmitting(true);
    const res = await editTriviaScore(editingScore.id, editUsername, editScoreValue);
    setIsSubmitting(false);

    if (res.success) {
      setEditingScore(null);
      fetchScores();
    } else {
      alert(res.error || 'Failed to edit');
    }
  };

  const pendingScores = scores.filter((s) => !s.is_approved);
  const liveScores = scores.filter((s) => s.is_approved);

  const displayScores = activeTab === 'pending' ? pendingScores : liveScores;

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'pending'
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
            onClick={() => setActiveTab('live')}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'live'
                ? 'border border-cyan-500/30 bg-cyan-500/20 text-cyan-300'
                : 'border border-transparent bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Live Leaderboard
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          Logout
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    Loading scores...
                  </td>
                </tr>
              ) : displayScores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    No {activeTab} scores found.
                  </td>
                </tr>
              ) : (
                displayScores.map((score) => (
                  <tr
                    key={score.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-medium text-white">{score.username}</td>
                    <td className="px-6 py-4 font-bold text-purple-400">{score.score} pts</td>
                    <td className="px-6 py-4">{new Date(score.created_at).toLocaleDateString()}</td>
                    <td className="space-x-3 px-6 py-4 text-right">
                      {activeTab === 'pending' && (
                        <button
                          onClick={() => handleApprove(score.id)}
                          className="text-emerald-400 transition-colors hover:text-emerald-300"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(score)}
                        className="text-cyan-400 transition-colors hover:text-cyan-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(score.id)}
                        className="text-red-400 transition-colors hover:text-red-300"
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

      {/* Edit Modal */}
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
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">Score</label>
                <input
                  type="number"
                  value={editScoreValue}
                  onChange={(e) => setEditScoreValue(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-white focus:border-purple-500/50 focus:outline-none"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 py-2 font-medium text-white transition-all hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingScore(null)}
                  className="rounded-xl bg-white/10 px-6 py-2 font-medium text-white transition-all hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
