'use client';

import { useState } from 'react';
import { uploadResume, getLiveResumeUrl } from '@/app/_actions/adminResume';

export default function ResumeManager() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    const result = await uploadResume(formData);

    if (result.success) {
      setSuccess('Resume uploaded successfully!');
      setCurrentUrl(result.url || null);
      setFile(null);
      // Reset input
      const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      setError(result.error || 'Failed to upload resume.');
    }

    setIsUploading(false);
  };

  const fetchCurrentUrl = async () => {
    const url = await getLiveResumeUrl();
    setCurrentUrl(url);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-xl font-bold text-white">Resume Manager</h2>
      <p className="mb-6 text-sm text-zinc-400">
        Upload a new PDF to instantly update your resume across the live website.
      </p>

      <div className="space-y-6">
        {/* Upload Zone */}
        <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center transition-colors hover:bg-white/[0.02]">
          <input
            type="file"
            id="resume-upload"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume-upload"
            className="flex cursor-pointer flex-col items-center justify-center space-y-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            {file ? (
              <p className="font-medium text-white">{file.name}</p>
            ) : (
              <p className="text-zinc-400">Click to select a PDF (Max 5MB)</p>
            )}
          </label>
        </div>

        {/* Feedback */}
        {error && <p className="rounded-lg bg-red-400/10 p-3 text-sm text-red-400">{error}</p>}
        {success && (
          <p className="rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-400">{success}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <button
              onClick={fetchCurrentUrl}
              className="text-sm text-cyan-400 underline underline-offset-4 hover:text-cyan-300"
            >
              Get Live Resume Link
            </button>
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-4 text-sm text-zinc-400 hover:text-white"
              >
                View Live
              </a>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="rounded-xl bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Publish to Live Site'}
          </button>
        </div>
      </div>
    </div>
  );
}
