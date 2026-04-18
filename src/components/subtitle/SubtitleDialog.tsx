'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubtitleStyle } from '@/types/subtitle';

interface SubtitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  style: SubtitleStyle;
  onChange: (style: SubtitleStyle) => void;
}

const fontOptions = [
  { value: 'pyidaungsu', label: 'Pyidaungsu' },
  { value: 'notoMyanmar', label: 'Noto Sans Myanmar' },
  { value: 'masterpiece', label: 'Masterpiece' },
  { value: 'zawgyi', label: 'Zawgyi' },
];

export default function SubtitleDialog({ isOpen, onClose, style, onChange }: SubtitleDialogProps) {
  const [localStyle, setLocalStyle] = useState<SubtitleStyle>(style);

  const handleChange = <K extends keyof SubtitleStyle>(key: K, value: SubtitleStyle[K]) => {
    const newStyle = { ...localStyle, [key]: value };
    setLocalStyle(newStyle);
    onChange(newStyle);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed w-72 p-3 bg-white rounded-xl shadow-2xl z-50"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            <h3 className="text-sm font-semibold mb-3">Subtitle Style</h3>

            {/* Side */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">Side</label>
              <select
                value={localStyle.side}
                onChange={(e) => handleChange('side', e.target.value as SubtitleStyle['side'])}
                className="w-full p-1.5 text-sm border rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            {/* Layout */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">Position</label>
              <select
                value={localStyle.layout}
                onChange={(e) => handleChange('layout', e.target.value as SubtitleStyle['layout'])}
                className="w-full p-1.5 text-sm border rounded"
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            {/* Colour */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">Text Colour</label>
              <input
                type="color"
                value={localStyle.colour}
                onChange={(e) => handleChange('colour', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>

            {/* Background */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">Background</label>
              <input
                type="color"
                value={localStyle.backgroundColour}
                onChange={(e) => handleChange('backgroundColour', e.target.value)}
                className="w-full h-8 cursor-pointer"
              />
            </div>

            {/* Background Opacity */}
            <div className="mb-2">
              <label className="text-xs text-gray-600 block mb-1">
                Background Opacity: {Math.round(localStyle.backgroundOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={localStyle.backgroundOpacity * 100}
                onChange={(e) => handleChange('backgroundOpacity', parseInt(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            {/* Font */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Myanmar Font</label>
              <select
                value={localStyle.font}
                onChange={(e) => handleChange('font', e.target.value as SubtitleStyle['font'])}
                className="w-full p-1.5 text-sm border rounded"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">
                Font Size: {localStyle.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={localStyle.fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={onClose}
              className="w-full py-1.5 bg-strawberry-500 text-white rounded text-sm hover:bg-strawberry-600 transition"
            >
              Done
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}