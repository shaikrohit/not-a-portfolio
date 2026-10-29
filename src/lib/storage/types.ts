/**
 * MULTI-PROVIDER STORAGE TYPES
 */

export type StorageProviderType = 'cloudinary' | 'supabase' | 'cloudflare_r2';

export interface UploadResult {
  url: string;
  provider: StorageProviderType;
  publicId: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

export interface IStorageProvider {
  name: StorageProviderType;
  upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType?: string,
    folder?: string
  ): Promise<UploadResult>;
  delete(publicId: string): Promise<boolean>;
  optimizeUrl(url: string, options?: { width?: number; quality?: string; format?: string }): string;
}
