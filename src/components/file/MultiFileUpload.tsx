'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useAlarm } from '@/components/ui/AlarmToast';

interface MultiFileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

export default function MultiFileUpload({
  onUpload,
  accept = {
    'text/plain': ['.txt', '.srt'],
    'application/octet-stream': ['.svc', '.bin'],
  },
  multiple = true,
}: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { addAlarm } = useAlarm();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setUploading(true);

      try {
        if (multiple) {
          onUpload(acceptedFiles);
          addAlarm('success', `${acceptedFiles.length} file(s) uploaded`);
        } else {
          onUpload([acceptedFiles[0]]);
          addAlarm('success', 'File uploaded');
        }
      } catch (error) {
        addAlarm('error', 'Failed to upload file(s)');
      } finally {
        setUploading(false);
      }
    },
    [onUpload, addAlarm, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
        isDragActive ? 'border-strawberry-500 bg-strawberry-50' : 'border-gray-300 hover:border-strawberry-400'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-1 text-xs text-gray-600">
            {isDragActive ? 'Drop files here' : 'Drag & drop files or click'}
          </p>
          <p className="text-xs text-gray-400 mt-1">.srt, .txt, .svc, .bin</p>
        </div>
      )}
    </motion.div>
  );
}