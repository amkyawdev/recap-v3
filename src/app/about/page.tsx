'use client';

import { motion } from 'framer-motion';

import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';

export default function AboutPage() {
  return (
    
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MobileButton />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">About Recap App</h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="font-semibold text-lg text-gray-900 mb-2">What is Recap App?</h2>
            <p className="text-gray-600">
              Recap App is a web-based subtitle editing and video processing application. 
              Edit SRT files, preview movies with custom subtitles, and combine video with subtitles 
              — all client-side using FFmpeg WASM.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="font-semibold text-lg text-gray-900 mb-2">Tech Stack</h2>
            <ul className="text-gray-600 space-y-1">
              <li>• Next.js 14 (App Router) with TypeScript</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Framer Motion for animations</li>
              <li>• FFmpeg WASM for video processing</li>
              <li>• React Dropzone for file uploads</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="font-semibold text-lg text-gray-900 mb-2">Features</h2>
            <ul className="text-gray-600 space-y-1">
              <li>• 📝 Full SRT subtitle editor</li>
              <li>• 🎬 Video preview with subtitles</li>
              <li>• 🎨 Customizable subtitle styles</li>
              <li>• 🌐 Myanmar font selector (4 fonts)</li>
              <li>• 📦 File uploads (.srt, .txt, .svc, .bin)</li>
              <li>• 🎥 Video upload (.mp4, .mkv, .avi, .mov)</li>
              <li>• 🖼️ Logo upload</li>
              <li>• 🔧 Extract embedded subtitles</li>
              <li>• ➗ Combine video + SRT</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="font-semibold text-lg text-gray-900 mb-2">Contact</h2>
            <p className="text-gray-600">
              For questions or feedback, please open an issue on GitHub.
            </p>
          </motion.div>
        </div>
      </div>
    
  );
}