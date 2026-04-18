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
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-strawberry-500 text-white rounded-full shadow-lg"
      style={{
        boxShadow: '0 4px 15px rgba(233, 0, 77, 0.3)',
      }}
    >
      {isOpen ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}