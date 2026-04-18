'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setLocalStyle(style);
  }, [style]);

  const handleChange = <K extends keyof SubtitleStyle>(key: K, value: SubtitleStyle[K]) => {
    const newStyle = { ...localStyle, [key]: value };
    setLocalStyle(newStyle);
    onChange(newStyle);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-md max-h-[90vh] p-6 bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Subtitle Style</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Alignment</label>
            <select
              value={localStyle.side}
              onChange={(e) => handleChange('side', e.target.value as SubtitleStyle['side'])}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Position</label>
            <select
              value={localStyle.layout}
              onChange={(e) => handleChange('layout', e.target.value as SubtitleStyle['layout'])}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50"
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Text Colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localStyle.colour}
                onChange={(e) => handleChange('colour', e.target.value)}
                className="w-10 h-10 cursor-pointer rounded-lg border"
              />
              <span className="text-sm text-gray-500">{localStyle.colour}</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localStyle.backgroundColour}
                onChange={(e) => handleChange('backgroundColour', e.target.value)}
                className="w-10 h-10 cursor-pointer rounded-lg border"
              />
              <span className="text-sm text-gray-500">{localStyle.backgroundColour}</span>
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600 block mb-1">
              Background Opacity: {Math.round(localStyle.backgroundOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localStyle.backgroundOpacity * 100}
              onChange={(e) => handleChange('backgroundOpacity', parseInt(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Myanmar Font</label>
            <select
              value={localStyle.font}
              onChange={(e) => handleChange('font', e.target.value as SubtitleStyle['font'])}
              className="w-full p-2.5 text-sm border rounded-lg bg-gray-50"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Font Size: {localStyle.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="48"
              value={localStyle.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-strawberry-500 text-white rounded-lg font-medium hover:bg-strawberry-600"
        >
          Done
        </button>
      </div>
    </div>
  );
}