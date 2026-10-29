'use client';

import React, { useState } from 'react';
import type { StorageProviderType } from '@/lib/storage';
import { uploadMediaAction } from '@/app/_actions/cms';
import {
  UploadCloud,
  FileImage,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Layers,
} from 'lucide-react';

interface UploadedFileRecord {
  name: string;
  url: string;
  provider: StorageProviderType;
  bytes: number;
  uploadedAt: string;
}

export function MediaVault() {
  const [selectedProvider, setSelectedProvider] = useState<StorageProviderType>('supabase');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [recentUploads, setRecentUploads] = useState<UploadedFileRecord[]>([
    {
      name: 'resume.pdf',
      url: '/resume.pdf',
      provider: 'supabase',
      bytes: 145000,
      uploadedAt: 'Active Live Asset',
    },
    {
      name: 'og-image.png',
      url: '/og-image.png',
      provider: 'supabase',
      bytes: 280000,
      uploadedAt: 'Active Live Asset',
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadMediaAction(formData, selectedProvider);
    setIsUploading(false);

    if (res.success && res.data) {
      setMessage({
        type: 'success',
        text: `File "${file.name}" uploaded successfully via ${selectedProvider.toUpperCase()}!`,
      });

      setRecentUploads((prev) => [
        {
          name: file.name,
          url: res.data!.url,
          provider: res.data!.provider,
          bytes: res.data!.size_bytes || file.size,
          uploadedAt: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setFile(null);
    } else {
      setMessage({ type: 'error', text: res.error || 'Upload failed' });
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 border-b border-white/10 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <UploadCloud className="h-5 w-5 text-purple-400" />
          Enterprise Multi-Provider Media Vault
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Upload project screenshots, resume PDF documents, and edge assets to Cloudinary, Supabase
          Storage, or Cloudflare R2.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Provider Selector Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            id: 'supabase' as const,
            name: 'Supabase Storage',
            badge: 'Active & Authenticated',
            desc: 'Best for resumes, PDFs, and documents. Uses standard portfolio bucket.',
            icon: ShieldCheck,
            color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          },
          {
            id: 'cloudinary' as const,
            name: 'Cloudinary CDN',
            badge: 'Auto-WebP/AVIF',
            desc: 'Best for project screenshots and photos. Automatic on-the-fly transformations.',
            icon: Cloud,
            color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
          },
          {
            id: 'cloudflare_r2' as const,
            name: 'Cloudflare R2',
            badge: 'S3-Compatible Edge',
            desc: 'Zero-egress bandwidth storage for heavy binary assets and static downloads.',
            icon: Layers,
            color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          },
        ].map((prov) => {
          const isSelected = selectedProvider === prov.id;
          const Icon = prov.icon;
          return (
            <div
              key={prov.id}
              onClick={() => setSelectedProvider(prov.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${prov.color.split(' ')[0]}`} />
                  <span className="text-sm font-bold text-white">{prov.name}</span>
                </div>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{prov.desc}</p>
              <span className="mt-3 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                {prov.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="mb-8">
        <div className="rounded-2xl border-2 border-dashed border-white/20 bg-black/30 p-8 text-center transition-all hover:border-purple-500/50">
          <FileImage className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-3 text-base font-semibold text-white">
            {file ? file.name : 'Select or drag any file to upload'}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Target Provider:{' '}
            <span className="font-semibold text-purple-300">{selectedProvider.toUpperCase()}</span>{' '}
            • Max file size: 10MB
          </p>

          <input type="file" id="media-file-input" onChange={handleFileChange} className="hidden" />

          <div className="mt-5 flex justify-center gap-3">
            <label
              htmlFor="media-file-input"
              className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/20"
            >
              Browse Local Files
            </label>

            {file && (
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-2 text-xs font-semibold text-white shadow-lg hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50"
              >
                {isUploading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                Upload Now
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Recent Uploads Table */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Vault Assets & URLs
        </h3>
        <div className="space-y-2">
          {recentUploads.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-purple-400">
                  <FileImage className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="uppercase text-purple-300">{item.provider}</span>
                    <span>•</span>
                    <span>{(item.bytes / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url, `url-${idx}`)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-white/10"
                >
                  {copiedUrl === `url-${idx}` ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedUrl === `url-${idx}` ? 'Copied URL!' : 'Copy URL'}
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 p-1 text-zinc-400 hover:text-white"
                  title="Open Asset in New Tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
