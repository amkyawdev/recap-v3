'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';

const docs = [
  {
    title: 'Getting Started',
    content: 'Welcome to Recap App! This application helps you edit subtitles and preview movies with your custom subtitles.',
  },
  {
    title: 'Supported Formats',
    content: 'SRT, TXT, SVC, BIN for subtitles. MP4, MKV, AVI, MOV, WEBM for videos. PNG, JPG, GIF, WEBP for logos.',
  },
  {
    title: 'Myanmar Fonts',
    content: 'Choose from 4 Myanmar fonts: Pyidaungsu, Noto Sans Myanmar, Masterpiece, Zawgyi. Font selection is in the Style Options dialog.',
  },
  {
    title: 'File Upload',
    content: 'Drag & drop files or click to browse. Max video size depends on browser memory. FFmpeg processes everything client-side.',
  },
  {
    title: 'Subtitle Extraction',
    content: 'If your video has embedded subtitles, click "Extract Subtitles" to extract them. Falls back to manual SRT upload.',
  },
  {
    title: 'Video Combining',
    content: 'Use "Combine Video + SRT" to mux your subtitles into the video file. Uses FFmpeg WASM for client-side processing.',
  },
  {
    title: 'Export',
    content: 'Click "Export SRT" to download your edited subtitles as an .srt file.',
  },
  {
    title: 'Styling Options',
    content: 'Click "Style Options" to customize subtitle position (left/center/right), layout (top/middle/bottom), colours, and font size.',
  },
];

export default function DocsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MobileButton />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Documentation</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc, index) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <h2 className="font-semibold text-gray-900 mb-2">{doc.title}</h2>
                <p className="text-sm text-gray-600">{doc.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}