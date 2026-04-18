'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { VideoFile } from '@/types/subtitle';
import { useAlarm } from '@/components/ui/AlarmToast';

interface VideoUploaderProps {
  onUpload: (video: VideoFile) => void;
}

export default function VideoUploader({ onUpload }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { addAlarm } = useAlarm();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith('video/')) {
        addAlarm('error', 'Please upload a video file');
        return;
      }

      setUploading(true);
      try {
        const url = URL.createObjectURL(file);
        onUpload({
          name: file.name,
          url,
          size: file.size,
        });
        addAlarm('success', 'Video uploaded successfully');
      } catch (error) {
        addAlarm('error', 'Failed to upload video');
      } finally {
        setUploading(false);
      }
    },
    [onUpload, addAlarm]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mkv', '.avi', '.mov', '.webm'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
        isDragActive ? 'border-strawberry-500 bg-strawberry-50' : 'border-gray-300 hover:border-strawberry-400'
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin w-8 h-8 border-2 border-strawberry-500 border-t-transparent rounded-full" />
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop video here' : 'Drag & drop video or click to select'}
          </p>
          <p className="text-xs text-gray-400 mt-1">.mp4, .mkv, .avi, .mov, .webm</p>
        </div>
      )}
    </div>
  );
}