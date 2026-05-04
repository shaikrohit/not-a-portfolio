import { verifyAdmin } from '@/app/_actions/adminTrivia';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoginForm from '@/components/admin/LoginForm';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin HQ | Shaik Rohit',
  description: 'Admin command center',
};

export default async function AdminPage() {
  const isAuthenticated = await verifyAdmin();

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-purple-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-20">
        <header className="mb-12">
          <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Admin HQ
          </h1>
          <p className="mt-2 text-lg text-zinc-400">Command center for portfolio management.</p>
        </header>

        {isAuthenticated ? <AdminDashboard /> : <LoginForm />}
      </main>
    </div>
  );
}
