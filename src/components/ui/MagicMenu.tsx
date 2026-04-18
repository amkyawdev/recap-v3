'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MagicMenuProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export default function MagicMenu({ onClick, isOpen = false }: MagicMenuProps) {
  const [isActive, setIsActive] = useState(isOpen);

  const handleClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-strawberry-500 text-white rounded-full shadow-lg"
      whileTap={{ rotate: 45, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        boxShadow: '0 4px 15px rgba(233, 0, 77, 0.3)',
      }}
    >
      <motion.div
        animate={{ rotate: isActive ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isActive ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
}