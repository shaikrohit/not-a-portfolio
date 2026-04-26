/**
 * Server Actions for Analytics
 *
 * Server-side functions for tracking and data management.
 * These run on the server and can safely access database.
 */

'use server';

import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Track a new visitor session
 */
export async function trackSession(data: {
  id: string;
  visitorType: string | null;
  country: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { error } = await supabase.from('visitor_sessions').insert({
      id: data.id,
      visitor_type: data.visitorType,
      country: data.country,
      pages_visited: [],
      time_spent_seconds: 0,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error tracking session:', error);
    return { success: false, error: 'Failed to track session' };
  }
}

/**
 * Update session with visited pages
 */
export async function updatePages(
  sessionId: string,
  pages: string[]
): Promise<{ success: boolean }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { success: false };
  }

  try {
    await supabase
      .from('visitor_sessions')
      .update({
        pages_visited: pages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Update session time spent
 */
export async function updateTimeSpent(
  sessionId: string,
  seconds: number
): Promise<{ success: boolean }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { success: false };
  }

  try {
    await supabase
      .from('visitor_sessions')
      .update({
        time_spent_seconds: seconds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Submit a contact message
 */
export async function submitContactMessage(data: {
  sessionId?: string;
  visitorType: string;
  message: string;
  email?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }

  // Basic validation
  if (!data.message.trim()) {
    return { success: false, error: 'Message is required' };
  }

  if (data.message.length > 5000) {
    return { success: false, error: 'Message too long' };
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { success: false, error: 'Invalid email format' };
  }

  try {
    const { error } = await supabase.from('visitor_messages').insert({
      session_id: data.sessionId ?? null,
      visitor_type: data.visitorType,
      message: data.message.trim(),
      email: data.email?.trim() ?? null,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting message:', error);
    return { success: false, error: 'Failed to submit message' };
  }
}

/**
 * Get analytics summary (for public dashboard)
 */
export async function getPublicAnalytics(): Promise<{
  totalVisitors: number;
  visitorsByType: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
  averageTimeSpent: number;
} | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Return mock data for development
    return {
      totalVisitors: 150,
      visitorsByType: {
        developer: 42,
        recruiter: 18,
        student: 27,
        explorer: 63,
      },
      topCountries: [
        { country: 'United States', count: 45 },
        { country: 'United Kingdom', count: 22 },
        { country: 'Germany', count: 18 },
        { country: 'India', count: 15 },
        { country: 'Canada', count: 12 },
      ],
      averageTimeSpent: 245,
    };
  }

  try {
    // Get all-time analytics
    const { data: sessions, error } = await supabase
      .from('visitor_sessions')
      .select('visitor_type, country, time_spent_seconds');

    if (error) throw error;

    const visitorsByType: Record<string, number> = {};
    const countryCount: Record<string, number> = {};
    let totalTime = 0;

    for (const session of sessions ?? []) {
      // Count by type
      const type = session.visitor_type ?? 'explorer';
      visitorsByType[type] = (visitorsByType[type] ?? 0) + 1;

      // Count by country
      const country = session.country ?? 'Unknown';
      countryCount[country] = (countryCount[country] ?? 0) + 1;

      // Sum time
      totalTime += session.time_spent_seconds ?? 0;
    }

    const topCountries = Object.entries(countryCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalVisitors: sessions?.length ?? 0,
      visitorsByType,
      topCountries,
      averageTimeSpent:
        sessions && sessions.length > 0 ? Math.round(totalTime / sessions.length) : 0,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}
