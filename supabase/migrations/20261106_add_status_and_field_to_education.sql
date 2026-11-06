-- Migration: Add status and field_of_study to cms_education
-- Supports LinkedIn-style "Currently Pursuing" vs "Completed" status tracking

ALTER TABLE cms_education ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE cms_education ADD COLUMN IF NOT EXISTS field_of_study TEXT;

-- Also add credly_url to cms_profile if not present
ALTER TABLE cms_profile ADD COLUMN IF NOT EXISTS credly_url TEXT;

-- Update existing records to have appropriate status
UPDATE cms_education
SET status = 'pursuing'
WHERE grade ILIKE '%pursuing%' OR period ILIKE '%pursuing%' OR degree ILIKE '%B.Tech%';
