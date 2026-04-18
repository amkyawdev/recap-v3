'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { LogoFile } from '@/types/subtitle';
import { useAlarm } from '@/components/ui/AlarmToast';

interface LogoUploaderProps {
  onUpload: (logo: LogoFile) => void;
}

export default function LogoUploader({ onUpload }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { addAlarm } = useAlarm();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        addAlarm('error', 'Please upload an image file');
        return;
      }

      setUploading(true);
      try {
        const url = URL.createObjectURL(file);
        onUpload({
          name: file.name,
          url,
        });
        addAlarm('success', 'Logo uploaded successfully');
      } catch (error) {
        addAlarm('error', 'Failed to upload logo');
      } finally {
        setUploading(false);
      }
    },
    [onUpload, addAlarm]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
        isDragActive ? 'border-strawberry-500 bg-strawberry-50' : 'border-gray-300 hover:border-strawberry-400'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin w-6 h-6 border-2 border-strawberry-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-xs text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-1 text-xs text-gray-600">
            {isDragActive ? 'Drop logo here' : 'Drag & drop logo or click'}
          </p>
        </div>
      )}
    </div>
  );
}