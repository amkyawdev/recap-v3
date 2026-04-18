'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';
import SubtitleEditor from '@/components/subtitle/SubtitleEditor';
import SubtitleDialog from '@/components/subtitle/SubtitleDialog';
import MultiFileUpload from '@/components/file/MultiFileUpload';
import RewrapMuxer from '@/components/file/RewrapMuxer';
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
  const [videoUrl, setVideoUrl] = useState('');
  const [muxedVideoUrl, setMuxedVideoUrl] = useState('');

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
      const textLines = text.split('\n').filter((l) => l.trim());
      const srtLines: SubtitleLine[] = textLines.map((text, index) => ({
        id: index + 1,
        startTime: formatTime(index * 3),
        endTime: formatTime((index + 1) * 3),
        text: text.trim(),
      }));
      setLines(srtLines);
      setFilename(file.name.replace('.txt', '.srt'));
    } else if (['mp4', 'webm', 'mkv', 'avi'].includes(ext || '')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleVideoUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recap - Subtitle Editor</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
              <MultiFileUpload onUpload={handleFileUpload} />
              <p className="text-xs text-gray-500 mt-1">Upload SRT, TXT, or Video files</p>
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

          {/* Video Section */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Video & Mux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Video: {videoUrl ? 'Loaded' : 'No video'}</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setVideoUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-strawberry-50 file:text-strawberry-700 hover:file:bg-strawberry-100"
                />
              </div>
              <div className="flex items-center gap-2">
                {videoUrl && lines.length > 0 && (
                  <RewrapMuxer
                    videoUrl={videoUrl}
                    srtContent={lines.map(l => `${l.id}\n${l.startTime} --> ${l.endTime}\n${l.text}\n`).join('\n')}
                    onComplete={(url) => {
                      setMuxedVideoUrl(url);
                    }}
                  />
                )}
              </div>
            </div>

            {/* Video Preview */}
            {(videoUrl || muxedVideoUrl) && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Video Preview</h3>
                {muxedVideoUrl ? (
                  <div>
                    <video controls className="w-full max-w-2xl rounded-lg" src={muxedVideoUrl} />
                    <a
                      href={muxedVideoUrl}
                      download="video-with-subtitles.mp4"
                      className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ⬇️ Download Video
                    </a>
                  </div>
                ) : (
                  <video controls className="w-full max-w-2xl rounded-lg" src={videoUrl} />
                )}
              </div>
            )}
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