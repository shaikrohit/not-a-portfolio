-- Insert a new bucket for portfolio assets (like resume)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- We do not add RLS policies allowing anonymous users to INSERT or UPDATE.
-- The Next.js Server Action will use the Service Role Key to securely upload files.
-- But we do ensure the bucket is public so anyone can download the resume.
