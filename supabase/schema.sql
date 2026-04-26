--
-- SUPABASE DATABASE SCHEMA
-- 
-- Run this in your Supabase SQL editor to set up the required tables.
-- This schema supports the privacy-first analytics system.
--

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VISITOR SESSIONS
-- ============================================
-- Stores anonymized session data for analytics.
-- No personal information is stored.

CREATE TABLE IF NOT EXISTS visitor_sessions (
    id TEXT PRIMARY KEY,
    visitor_type TEXT CHECK (visitor_type IN ('developer', 'recruiter', 'student', 'explorer')),
    country TEXT,
    pages_visited TEXT[] DEFAULT '{}',
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient monthly queries
CREATE INDEX idx_sessions_created_at ON visitor_sessions(created_at);
CREATE INDEX idx_sessions_visitor_type ON visitor_sessions(visitor_type);

-- ============================================
-- VISITOR MESSAGES
-- ============================================
-- Stores contact form submissions.
-- Email is optional and stored only if provided.

CREATE TABLE IF NOT EXISTS visitor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT REFERENCES visitor_sessions(id) ON DELETE SET NULL,
    visitor_type TEXT NOT NULL CHECK (visitor_type IN ('developer', 'recruiter', 'student', 'explorer')),
    message TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient querying
CREATE INDEX idx_messages_created_at ON visitor_messages(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
-- Enable RLS on all tables

ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_messages ENABLE ROW LEVEL SECURITY;

-- Sessions: Allow anonymous inserts and updates (for tracking)
CREATE POLICY "Allow anonymous session insert" ON visitor_sessions
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous session update" ON visitor_sessions
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Prevent direct reads of individual sessions (privacy)
-- Use the aggregate function below instead
CREATE POLICY "Prevent direct session reads" ON visitor_sessions
    FOR SELECT
    TO anon
    USING (false);

-- Messages: Allow anonymous inserts only
CREATE POLICY "Allow anonymous message insert" ON visitor_messages
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ============================================
-- AGGREGATE FUNCTION FOR PUBLIC STATS
-- ============================================
-- This function returns only aggregated, anonymous data
-- that's safe to display publicly.

CREATE OR REPLACE FUNCTION get_public_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    start_of_month TIMESTAMP WITH TIME ZONE;
BEGIN
    start_of_month := date_trunc('month', NOW());
    
    SELECT json_build_object(
        'total_visitors', COUNT(*),
        'visitors_by_type', json_build_object(
            'developer', COUNT(*) FILTER (WHERE visitor_type = 'developer'),
            'recruiter', COUNT(*) FILTER (WHERE visitor_type = 'recruiter'),
            'student', COUNT(*) FILTER (WHERE visitor_type = 'student'),
            'explorer', COUNT(*) FILTER (WHERE visitor_type = 'explorer')
        ),
        'average_time_spent', COALESCE(AVG(time_spent_seconds), 0)::INTEGER,
        'this_month', json_build_object(
            'developers', COUNT(*) FILTER (WHERE visitor_type = 'developer'),
            'recruiters', COUNT(*) FILTER (WHERE visitor_type = 'recruiter'),
            'students', COUNT(*) FILTER (WHERE visitor_type = 'student'),
            'explorers', COUNT(*) FILTER (WHERE visitor_type = 'explorer')
        )
    )
    INTO result
    FROM visitor_sessions
    WHERE created_at >= start_of_month;
    
    RETURN result;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION get_public_analytics() TO anon;

-- ============================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_visitor_sessions_updated_at
    BEFORE UPDATE ON visitor_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CLEANUP OLD DATA (Optional)
-- ============================================
-- Uncomment to automatically delete sessions older than 90 days
-- This helps with GDPR compliance and storage costs

-- CREATE OR REPLACE FUNCTION cleanup_old_sessions()
-- RETURNS void
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     DELETE FROM visitor_sessions
--     WHERE created_at < NOW() - INTERVAL '90 days';
-- END;
-- $$;

-- Schedule daily cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-sessions', '0 3 * * *', 'SELECT cleanup_old_sessions()');

-- ============================================
-- TRIVIA LEADERBOARD
-- ============================================
-- Stores scores for the interactive trivia game

CREATE TABLE IF NOT EXISTS trivia_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering scores efficiently
CREATE INDEX idx_trivia_scores_score ON trivia_scores(score DESC);

ALTER TABLE trivia_scores ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view top scores
CREATE POLICY "Allow anonymous read of trivia scores" ON trivia_scores
    FOR SELECT
    TO anon
    USING (true);

-- Allow anonymous users to insert scores
CREATE POLICY "Allow anonymous insert of trivia scores" ON trivia_scores
    FOR INSERT
    TO anon
    WITH CHECK (true);

