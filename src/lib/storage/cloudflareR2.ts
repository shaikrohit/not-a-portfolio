import type { IStorageProvider, UploadResult } from './types';

export class CloudflareR2StorageProvider implements IStorageProvider {
  name = 'cloudflare_r2' as const;

  async upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType = 'application/octet-stream',
    folder = 'assets'
  ): Promise<UploadResult> {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || 'portfolio';
    const publicDomain =
      process.env.R2_PUBLIC_URL || `https://${bucketName}.${accountId}.r2.cloudflarestorage.com`;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Cloudflare R2 is not configured. Please supply R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in environment.'
      );
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = folder
      ? `${folder}/${Date.now()}_${cleanFilename}`
      : `${Date.now()}_${cleanFilename}`;

    // Cloudflare R2 standard endpoint
    const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${objectKey}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
      },
      body: Buffer.from(file),
    });

    if (!response.ok) {
      throw new Error(`R2 upload failed: ${response.statusText}`);
    }

    const publicUrl = `${publicDomain}/${objectKey}`;

    return {
      url: publicUrl,
      provider: 'cloudflare_r2',
      publicId: objectKey,
      bytes: file.length,
      format: mimeType.split('/')[1] || 'bin',
    };
  }

  async delete(_publicId: string): Promise<boolean> {
    return true;
  }

  optimizeUrl(url: string): string {
    return url;
  }
}
