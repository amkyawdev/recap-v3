'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import AnimatedText from '@/components/ui/AnimatedText';
import MagicMenu from '@/components/ui/MagicMenu';
import SideMenu from '@/components/ui/SideMenu';
import MobileButton from '@/components/ui/MobileButton';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <SideMenu />
        <MobileButton />

        <div className="flex flex-col items-center justify-center min-h-screen py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              <AnimatedText text="Recap App" delay={0.1} />
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              <AnimatedText text="Subtitle Editing Made Easy" delay={0.3} />
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/recap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-strawberry-500 text-white rounded-lg shadow-lg hover:bg-strawberry-600"
              >
                Start Editing
              </motion.button>
            </Link>

            <Link href="/docs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300"
              >
                Documentation
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
          >
            {[
              { icon: '📝', title: 'Edit Subtitles', desc: 'Full SRT editor with add/edit/delete' },
              { icon: '🎬', title: 'Preview Movies', desc: 'Watch with your subtitles' },
              { icon: '🌐', title: 'Translate', desc: 'Link to translation services' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}