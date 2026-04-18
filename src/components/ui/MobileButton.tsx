'use client';

import { useState } from 'react';

interface MobileButtonProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export default function MobileButton({ onClick, isOpen = false }: MobileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 flex items-center justify-center bg-strawberry-500 text-white rounded-full shadow-lg md:hidden"
      style={{
        boxShadow: '0 4px 20px rgba(233, 0, 77, 0.4)',
      }}
    >
      {isOpen ? (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </button>
  );
}