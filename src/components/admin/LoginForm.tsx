'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/_actions/adminTrivia';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginAdmin(password);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'Invalid password');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-20 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <h2 className="mb-6 text-center text-2xl font-semibold">Admin Authentication</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">Secure Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="Enter admin secret..."
            required
          />
        </div>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Access Dashboard'}
        </button>
      </form>
    </div>
  );
}
