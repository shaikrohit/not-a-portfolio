import { createClient } from '@supabase/supabase-js';
import type { IStorageProvider, UploadResult } from './types';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export class SupabaseStorageProvider implements IStorageProvider {
  name = 'supabase' as const;
  private bucketName = 'portfolio';

  async upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType = 'application/octet-stream',
    folder = 'uploads'
  ): Promise<UploadResult> {
    const supabase = getAdminClient();
    if (!supabase) {
      throw new Error('Supabase client is not configured with environment variables.');
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = folder
      ? `${folder}/${Date.now()}_${cleanFilename}`
      : `${Date.now()}_${cleanFilename}`;

    const { error } = await supabase.storage.from(this.bucketName).upload(storagePath, file, {
      contentType: mimeType,
      upsert: true,
    });

    if (error) {
      throw new Error(`Supabase Storage upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(storagePath);

    return {
      url: data.publicUrl,
      provider: 'supabase',
      publicId: storagePath,
      bytes: file.length,
      format: mimeType.split('/')[1] || 'bin',
    };
  }

  async delete(publicId: string): Promise<boolean> {
    const supabase = getAdminClient();
    if (!supabase) return false;

    const { error } = await supabase.storage.from(this.bucketName).remove([publicId]);
    return !error;
  }

  optimizeUrl(url: string): string {
    return url;
  }
}
