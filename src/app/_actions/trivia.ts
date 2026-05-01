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
      is_approved: false,
    });
    console.log(`[TRIVIA] New score submitted by ${cleanUsername}: ${score}. Approval required.`);
    return { success: true };
  }

  try {
    const { data, error } = await supabase.from('trivia_scores').insert({
      username: cleanUsername,
      score,
      is_approved: false,
    }).select().single();
    
    if (error) throw error;

    // --- EMAIL NOTIFICATION LOGIC ---
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const adminSecret = process.env.TRIVIA_ADMIN_SECRET || 'change-me';
    const resendKey = process.env.RESEND_API_KEY;

    const approveUrl = `${appUrl}/api/trivia/approve?id=${data.id}&secret=${adminSecret}`;
    const declineUrl = `${appUrl}/api/trivia/decline?id=${data.id}&secret=${adminSecret}`;

    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Trivia <onboarding@resend.dev>',
          to: 'shaik.rohit.official@gmail.com',
          subject: `🏆 New Trivia Score: ${cleanUsername} (${score} pts)`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #111827;">New Leaderboard Submission</h2>
              <p style="color: #4b5563; font-size: 16px;">Someone just crushed the trivia game!</p>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">User</p>
                <p style="margin: 0 0 10px 0; font-size: 20px; font-weight: bold; color: #111827;">${cleanUsername}</p>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Score</p>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #7c3aed;">${score} pts</p>
              </div>
              <div style="display: flex; gap: 10px;">
                <a href="${approveUrl}" style="background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Approve Score</a>
                <a href="${declineUrl}" style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-left: 10px;">Decline</a>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">If you decline, the record will be permanently deleted from the database.</p>
            </div>
          `,
        }),
      });
    } else {
      console.log('--- RESEND_API_KEY missing. Printing approval link instead ---');
      console.log(`Approve: ${approveUrl}`);
      console.log(`Decline: ${declineUrl}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: 'Failed to submit score' };
  }
}

export async function getTriviaLeaderboard() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return memoryScores
      .filter(s => (s as any).is_approved)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  try {
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('id, username, score, created_at')
      .eq('is_approved', true) // Only show approved scores
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function approveTriviaScore(id: string, secret: string) {
  if (secret !== (process.env.TRIVIA_ADMIN_SECRET || 'change-me')) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase
      .from('trivia_scores')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error approving score:', error);
    return { success: false, error: 'Failed to approve' };
  }
}

export async function declineTriviaScore(id: string, secret: string) {
  if (secret !== (process.env.TRIVIA_ADMIN_SECRET || 'change-me')) {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = getSupabaseClient();
  if (!supabase) return { success: false };

  try {
    const { error } = await supabase
      .from('trivia_scores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error declining score:', error);
    return { success: false, error: 'Failed to decline' };
  }
}

