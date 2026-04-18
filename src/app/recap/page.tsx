'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';
import SubtitleEditor from '@/components/subtitle/SubtitleEditor';
import SubtitleDialog from '@/components/subtitle/SubtitleDialog';
import MultiFileUpload from '@/components/file/MultiFileUpload';
import { SubtitleLine, SubtitleStyle } from '@/types/subtitle';
import { parseSRTFile } from '@/components/subtitle/SrtParser';
import { downloadSRT } from '@/components/subtitle/SrtExporter';

const defaultStyle: SubtitleStyle = {
  side: 'center',
  layout: 'bottom',
  colour: '#ffffff',
  backgroundColour: '#000000',
  backgroundOpacity: 0.5,
  font: 'notoMyanmar',
  fontSize: 24,
};

export default function RecapPage() {
  const [lines, setLines] = useState<SubtitleLine[]>([]);
  const [style, setStyle] = useState<SubtitleStyle>(defaultStyle);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filename, setFilename] = useState('subtitles.srt');

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'srt') {
      const parsed = await parseSRTFile(file);
      setLines(parsed);
      setFilename(file.name);
    } else if (ext === 'txt') {
      const text = await file.text();
      // Simple text to SRT conversion
      const textLines = text.split('\n').filter((l) => l.trim());
      const srtLines: SubtitleLine[] = textLines.map((text, index) => ({
        id: index + 1,
        startTime: formatTime(index * 3),
        endTime: formatTime((index + 1) * 3),
        text: text.trim(),
      }));
      setLines(srtLines);
      setFilename(file.name.replace('.txt', '.srt'));
    }
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)},000`;
  };

  const pad = (n: number): string => n.toString().padStart(2, '0');

  const handleExport = () => {
    downloadSRT(lines, filename);
  };

  return (
    
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MobileButton />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Subtitle Editor</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
              <MultiFileUpload onUpload={handleFileUpload} />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Actions</h2>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDialogOpen(true)}
                  className="px-3 py-1.5 bg-strawberry-500 text-white rounded text-sm"
                >
                  🎨 Style Options
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={lines.length === 0}
                  className="px-3 py-1.5 bg-gray-700 text-white rounded text-sm disabled:opacity-50"
                >
                  💾 Export SRT
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <SubtitleEditor lines={lines} onChange={setLines} />
          </div>

          <SubtitleDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            style={style}
            onChange={setStyle}
          />
        </div>
      </div>
    
  );
}