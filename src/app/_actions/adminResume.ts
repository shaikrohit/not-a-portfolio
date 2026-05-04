'use server';

import { verifyAdmin } from './adminTrivia';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function uploadResume(formData: FormData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return { success: false, error: 'Unauthorized' };

  const file = formData.get('resume') as File;
  if (!file) return { success: false, error: 'No file provided' };

  if (file.type !== 'application/pdf') {
    return { success: false, error: 'File must be a PDF' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 5MB' };
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage.from('portfolio').upload('resume.pdf', buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (error) {
      // If error is RLS related, it means they are using Anon Key.
      console.error('Storage upload error:', error);
      if (error.message.includes('row-level security') || error.statusCode === '403') {
        return {
          success: false,
          error:
            'Missing Service Role Key. Please add SUPABASE_SERVICE_ROLE_KEY to your Vercel Environment Variables to upload files.',
        };
      }
      throw error;
    }

    // Get the public URL with a cache-busting timestamp
    const {
      data: { publicUrl },
    } = supabase.storage.from('portfolio').getPublicUrl('resume.pdf');

    return {
      success: true,
      url: `${publicUrl}?t=${Date.now()}`,
    };
  } catch (error: any) {
    console.error('Error uploading resume:', error);
    return { success: false, error: error.message || 'Failed to upload resume' };
  }
}

export async function getLiveResumeUrl() {
  const supabase = getAdminSupabaseClient();
  if (!supabase) return '/resume.pdf'; // Fallback to local public folder if Supabase isn't configured

  const { data } = supabase.storage.from('portfolio').getPublicUrl('resume.pdf');

  // We check if the file actually exists by doing a head request, but for simplicity we can just return the URL.
  // Actually, Supabase getPublicUrl doesn't check if it exists.
  // We'll just return it. The frontend can decide what to do.
  return data.publicUrl;
}
