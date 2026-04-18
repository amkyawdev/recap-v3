'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/recap', label: 'Recap', icon: '📝' },
  { href: '/preview-movie', label: 'Preview', icon: '🎬' },
  { href: '/language-translate', label: 'Translate', icon: '🌐' },
  { href: '/docs', label: 'Docs', icon: '📄' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function SideMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      className="fixed left-0 top-0 h-full z-40 bg-gray-900 text-white overflow-hidden"
      initial={{ width: 48 }}
      animate={{ width: isExpanded ? 200 : 48 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-3 py-2 mx-2 rounded-lg smooth-transition ${
              pathname === item.href
                ? 'bg-strawberry-500 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}