'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MagicMenu from '@/components/ui/MagicMenu';
import SideMenu from '@/components/ui/SideMenu';

const translationLinks = [
  {
    name: 'Google Translate',
    url: 'https://translate.google.com',
    icon: '🌐',
    description: 'Google\'s free translation service',
  },
  {
    name: 'DeepL Translate',
    url: 'https://www.deepl.com/translator',
    icon: '📝',
    description: 'AI-powered translation service',
  },
  {
    name: 'MyMemory',
    url: 'https://mymemory.translated.net',
    icon: '🧠',
    description: 'Human-reviewed translations',
  },
  {
    name: 'Translate.com',
    url: 'https://www.translate.com',
    icon: '💬',
    description: 'Translation and language services',
  },
  {
    name: 'Bing Translator',
    url: 'https://www.bing.com/translator',
    icon: '🔍',
    description: 'Microsoft\'s translation service',
  },
  {
    name: 'Reverso',
    url: 'https://www.reverso.net',
    icon: '↔️',
    description: ' Translation and context',
  },
];

export default function LanguageTranslatePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MagicMenu />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Language Translate</h1>
          <p className="text-gray-600 mb-6">
            Click a service below to open in a new tab for translation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {translationLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex items-center gap-3"
              >
                <span className="text-2xl">{link.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                  <p className="text-xs text-gray-600">{link.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}