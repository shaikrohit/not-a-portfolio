'use server';

import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const ADMIN_COOKIE_NAME = 'trivia_admin_auth';

// Define the type locally to avoid importing from trivia if it's not exported
interface TriviaScore {
  id: string;
  username: string;
  score: number;
  created_at: string;
  is_approved: boolean;
}

// Ensure we have a way to get the client if it's not exported
function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function loginAdmin(password: string) {
  const adminSecret = process.env.TRIVIA_ADMIN_SECRET || 'change-me';

  if (password === adminSecret) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: ADMIN_COOKIE_NAME,
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid password' };
}

export async function verifyAdmin() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return authCookie?.value === 'authenticated';
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return { success: true };
}

export async function getAllTriviaScores() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { error: 'Unauthorized', data: null };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { error: 'Supabase not configured', data: null };

  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all scores:', error);
    return { error: 'Failed to fetch scores', data: null };
  }
}

export async function editTriviaScore(id: string, newUsername: string, newScore: number) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase.rpc('edit_trivia_score_rpc', {
      score_id: id,
      new_username: newUsername,
      new_score: newScore,
    });

    if (error) throw error;
    if (!data) return { success: false, error: 'Score not found' };

    return { success: true };
  } catch (error) {
    console.error('Error editing score:', error);
    return { success: false, error: 'Failed to edit score' };
  }
}

export async function adminApproveScore(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase.rpc('approve_trivia_score_rpc', { score_id: id });
    if (error) throw error;
    if (!data) return { success: false, error: 'Score not found' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to approve' };
  }
}

export async function adminDeleteScore(id: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await supabase.rpc('decline_trivia_score_rpc', { score_id: id });
    if (error) throw error;
    if (!data) return { success: false, error: 'Score not found' };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete' };
  }
}
