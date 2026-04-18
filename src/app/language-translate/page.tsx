'use client';


import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MagicMenu from '@/components/ui/MagicMenu';
import SideMenu from '@/components/ui/SideMenu';

const TRANSLATE_URL = 'https://srt-app-theta.vercel.app';

export default function LanguageTranslatePage() {
  const handleTranslate = () => {
    window.open(TRANSLATE_URL, '_blank');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MagicMenu />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Language Translate</h1>
          <p className="text-gray-600 mb-6">
            Click the button below to open the translation app
          </p>

          <motion.button
            onClick={handleTranslate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-strawberry-500 text-white rounded-lg shadow-lg hover:bg-strawberry-600"
          >
            🌐 Go to Translation App
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}