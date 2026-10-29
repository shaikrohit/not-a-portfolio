import type { IStorageProvider, StorageProviderType, UploadResult } from './types';
import { SupabaseStorageProvider } from './supabaseStorage';
import { CloudinaryStorageProvider } from './cloudinary';
import { CloudflareR2StorageProvider } from './cloudflareR2';

export * from './types';
export { SupabaseStorageProvider } from './supabaseStorage';
export { CloudinaryStorageProvider } from './cloudinary';
export { CloudflareR2StorageProvider } from './cloudflareR2';

export function getAvailableProviders(): {
  id: StorageProviderType;
  name: string;
  isConfigured: boolean;
  description: string;
}[] {
  return [
    {
      id: 'supabase',
      name: 'Supabase Storage',
      isConfigured: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ),
      description: 'Zero setup required. Ideal for documents, PDFs, and general assets.',
    },
    {
      id: 'cloudinary',
      name: 'Cloudinary CDN',
      isConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
      description: 'Auto-compress WebP/AVIF images with on-the-fly transformations.',
    },
    {
      id: 'cloudflare_r2',
      name: 'Cloudflare R2',
      isConfigured: !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID),
      description: 'Edge S3 storage with zero egress fees for large binary assets.',
    },
  ];
}

export function getStorageProvider(preferred?: StorageProviderType): IStorageProvider {
  if (preferred === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
    return new CloudinaryStorageProvider();
  }

  if (preferred === 'cloudflare_r2' && process.env.R2_ACCOUNT_ID) {
    return new CloudflareR2StorageProvider();
  }

  if (preferred === 'supabase') {
    return new SupabaseStorageProvider();
  }

  // Auto-detection fallback:
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return new CloudinaryStorageProvider();
  }

  // Default to Supabase
  return new SupabaseStorageProvider();
}

export async function uploadAsset(
  file: File,
  preferred?: StorageProviderType,
  folder = 'uploads'
): Promise<UploadResult> {
  const provider = getStorageProvider(preferred);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return provider.upload(buffer, file.name, file.type, folder);
}
