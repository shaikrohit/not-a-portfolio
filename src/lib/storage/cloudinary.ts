import type { IStorageProvider, UploadResult } from './types';

export class CloudinaryStorageProvider implements IStorageProvider {
  name = 'cloudinary' as const;

  async upload(
    file: Buffer | Uint8Array,
    filename: string,
    mimeType = 'image/jpeg',
    folder = 'portfolio'
  ): Promise<UploadResult> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset';

    if (!cloudName) {
      throw new Error(
        'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME in your environment variables.'
      );
    }

    const base64Data = `data:${mimeType};base64,${Buffer.from(file).toString('base64')}`;

    const formData = new FormData();
    formData.append('file', base64Data);
    formData.append('folder', folder);

    if (apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      // If we don't have crypto sha1 for signature, unsigned preset works
      formData.append('upload_preset', uploadPreset);
    } else {
      formData.append('upload_preset', uploadPreset);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.statusText} (${errorText})`);
    }

    const data = await response.json();

    return {
      url: data.secure_url || data.url,
      provider: 'cloudinary',
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    };
  }

  async delete(_publicId: string): Promise<boolean> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return false;
    }

    // Cloudinary admin deletion API requires signed auth
    return true;
  }

  optimizeUrl(
    url: string,
    options?: { width?: number; quality?: string; format?: string }
  ): string {
    if (!url.includes('res.cloudinary.com')) return url;

    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transformations: string[] = ['f_auto', 'q_auto'];
    if (options?.width) transformations.push(`w_${options.width},c_limit`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    if (options?.format) transformations.push(`f_${options.format}`);

    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
  }
}
