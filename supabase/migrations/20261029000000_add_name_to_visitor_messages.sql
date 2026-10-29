-- Migration: Add name column to visitor_messages
-- Created: 2026-10-29
-- Milestone: Milestone 1 (Contact & Backend Integration)

ALTER TABLE visitor_messages
ADD COLUMN IF NOT EXISTS name TEXT;

COMMENT ON COLUMN visitor_messages.name IS 'Full name of the contact form submitter';
