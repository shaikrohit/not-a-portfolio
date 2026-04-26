/**
 * SUPABASE CLIENT
 * 
 * Supabase is used for:
 * - Anonymous visitor analytics
 * - Storing contact messages
 * - Live visitor statistics
 * 
 * All data is anonymized and privacy-respecting.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client (will be null if env vars not set)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Database Types
 * 
 * These match our Supabase schema.
 */
export interface DBVisitorSession {
  id: string;
  visitor_type: string | null;
  country: string | null;
  pages_visited: string[];
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface DBVisitorMessage {
  id: string;
  session_id: string | null;
  visitor_type: string;
  message: string;
  email: string | null;
  created_at: string;
}

export interface DBAnalyticsSummary {
  total_visitors: number;
  visitors_by_type: Record<string, number>;
  top_countries: Array<{ country: string; count: number }>;
  average_time_spent: number;
  this_month: {
    developers: number;
    recruiters: number;
    students: number;
    explorers: number;
  };
}

/**
 * Analytics Functions
 */

// Track a new visitor session
export async function trackVisitorSession(session: {
  id: string;
  visitorType: string | null;
  country: string | null;
}): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not configured - session tracking disabled');
    return;
  }

  try {
    await supabase.from('visitor_sessions').insert({
      id: session.id,
      visitor_type: session.visitorType,
      country: session.country,
      pages_visited: [],
      time_spent_seconds: 0,
    });
  } catch (error) {
    console.error('Error tracking session:', error);
  }
}

// Update session with page visit
export async function updateSessionPages(
  sessionId: string,
  pagesVisited: string[]
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase
      .from('visitor_sessions')
      .update({ pages_visited: pagesVisited, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error updating session pages:', error);
  }
}

// Update session time spent
export async function updateSessionTime(
  sessionId: string,
  timeSpentSeconds: number
): Promise<void> {
  if (!supabase) return;

  try {
    await supabase
      .from('visitor_sessions')
      .update({ time_spent_seconds: timeSpentSeconds, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error updating session time:', error);
  }
}

// Submit a contact message
export async function submitMessage(data: {
  sessionId?: string;
  visitorType: string;
  message: string;
  email?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.warn('Supabase not configured - message submission disabled');
    return { success: false, error: 'Database not configured' };
  }

  try {
    const { error } = await supabase.from('visitor_messages').insert({
      session_id: data.sessionId || null,
      visitor_type: data.visitorType,
      message: data.message,
      email: data.email || null,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting message:', error);
    return { success: false, error: 'Failed to submit message' };
  }
}

// Get public analytics summary
export async function getAnalyticsSummary(): Promise<DBAnalyticsSummary | null> {
  if (!supabase) {
    // Return mock data for development
    return {
      total_visitors: 150,
      visitors_by_type: {
        developer: 42,
        recruiter: 18,
        student: 27,
        explorer: 63,
      },
      top_countries: [
        { country: 'United States', count: 45 },
        { country: 'United Kingdom', count: 22 },
        { country: 'Germany', count: 18 },
        { country: 'India', count: 15 },
        { country: 'Canada', count: 12 },
      ],
      average_time_spent: 245,
      this_month: {
        developers: 42,
        recruiters: 18,
        students: 27,
        explorers: 63,
      },
    };
  }

  try {
    // Get total visitors this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: sessions, error } = await supabase
      .from('visitor_sessions')
      .select('*')
      .gte('created_at', startOfMonth.toISOString());

    if (error) throw error;

    // Process data
    const visitorsByType = sessions.reduce((acc, session) => {
      const type = session.visitor_type || 'explorer';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countryCount = sessions.reduce((acc, session) => {
      const country = session.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryCount)
      .map(([country, count]) => ({ country, count: count as number }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 5);

    const avgTime = sessions.length > 0
      ? sessions.reduce((acc, s) => acc + s.time_spent_seconds, 0) / sessions.length
      : 0;

    return {
      total_visitors: sessions.length,
      visitors_by_type: visitorsByType,
      top_countries: topCountries,
      average_time_spent: Math.round(avgTime),
      this_month: {
        developers: visitorsByType.developer || 0,
        recruiters: visitorsByType.recruiter || 0,
        students: visitorsByType.student || 0,
        explorers: visitorsByType.explorer || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}

export default supabase;
