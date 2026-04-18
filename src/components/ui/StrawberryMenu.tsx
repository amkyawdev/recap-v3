'use client';

import { motion } from 'framer-motion';

interface StrawberryMenuProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export default function StrawberryMenu({ onClick, isOpen = false }: StrawberryMenuProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-strawberry-400 to-strawberry-600 text-white rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      style={{
        boxShadow: '0 4px 15px rgba(233, 0, 77, 0.4)',
      }}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Strawberry shape */}
        <path d="M12 2C9 2 6 4 6 7c0 2 1 4 2 6-1 1-1 2-1 3 0 2 2 4 5 4s5-2 5-4c0-1 0-2-1-3 1-2 2-4 2-6 0-3-3-5-6-5zm0 2c2 0 4 1.5 4 3 0 1.5-1 3-2 5-1-2-2-3.5-2-5 0-1.5 2-3 4-3z" />
        {/* Leaf on top */}
        <path
          d="M12 2l-1 2h2l-1-2z"
          fill="#4ade80"
        />
      </svg>
    </motion.button>
  );
}