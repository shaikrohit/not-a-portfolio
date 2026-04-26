'use server';

import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// In-memory fallback if Supabase isn't configured yet
const memoryScores = [
  { id: '1', username: 'MemeLord', score: 100, created_at: new Date().toISOString() },
  { id: '2', username: 'GuessMaster', score: 80, created_at: new Date().toISOString() },
  { id: '3', username: 'WhoAmI', score: 60, created_at: new Date().toISOString() },
];

export async function submitTriviaScore(username: string, score: number) {
  // Sanitize username
  const cleanUsername = username.trim().slice(0, 25) || 'Anonymous';

  const supabase = getSupabaseClient();
  if (!supabase) {
    memoryScores.push({
      id: Math.random().toString(),
      username: cleanUsername,
      score,
      created_at: new Date().toISOString(),
    });
    return { success: true };
  }

  try {
    const { error } = await supabase.from('trivia_scores').insert({
      username: cleanUsername,
      score,
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: 'Failed to submit score' };
  }
}

export async function getTriviaLeaderboard() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return memoryScores.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('id, username, score, created_at')
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return memoryScores.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}
