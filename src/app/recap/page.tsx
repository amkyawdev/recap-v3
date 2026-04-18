'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';
import SubtitleEditor from '@/components/subtitle/SubtitleEditor';
import SubtitleDialog from '@/components/subtitle/SubtitleDialog';
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
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'srt') {
      try {
        const parsed = await parseSRTFile(file);
        console.log('Parsed SRT:', parsed);
        setLines(parsed);
        setFilename(file.name);
      } catch (error) {
        console.error('Error parsing SRT:', error);
      }
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
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setMuxedVideoUrl('');
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

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.replace(',', '.').split(':');
    if (parts.length !== 3) return 0;
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const getCurrentSubtitle = () => {
    for (const line of lines) {
      const start = parseTimestamp(line.startTime);
      const end = parseTimestamp(line.endTime);
      if (currentTime >= start && currentTime <= end) {
        return line.text;
      }
    }
    return null;
  };

  const currentSubtitle = getCurrentSubtitle();

  const getSubtitleStyle = () => {
    const baseStyle: React.CSSProperties = {
      color: style.colour,
      fontSize: `${style.fontSize}px`,
      fontFamily: style.font,
      textAlign: style.side as 'left' | 'center' | 'right',
    };
    
    if (style.layout === 'top') {
      baseStyle.position = 'absolute';
      baseStyle.top = '10%';
      baseStyle.left = '50%';
      baseStyle.transform = 'translateX(-50%)';
    } else if (style.layout === 'middle') {
      baseStyle.position = 'absolute';
      baseStyle.top = '50%';
      baseStyle.left = '50%';
      baseStyle.transform = 'translate(-50%, -50%)';
    } else {
      baseStyle.position = 'absolute';
      baseStyle.bottom = '10%';
      baseStyle.left = '50%';
      baseStyle.transform = 'translateX(-50%)';
    }

    if (style.backgroundColour && style.backgroundOpacity > 0) {
      baseStyle.backgroundColor = `${style.backgroundColour}${Math.round(style.backgroundOpacity * 255).toString(16).padStart(2, '0')}`;
      baseStyle.padding = '4px 12px';
      baseStyle.borderRadius = '4px';
    }

    return baseStyle;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SideMenu />
      <MobileButton />

      <div className="ml-0 md:ml-16 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recap - Subtitle Editor</h1>
          <p className="text-gray-500 mt-1">Edit subtitles and watch with live preview</p>
        </div>

        {/* Buttons Row */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer px-3 py-2 bg-strawberry-500 text-white rounded-lg text-sm font-medium hover:bg-strawberry-600 inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              SRT
              <input type="file" accept=".srt,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            
            <label className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Video
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>

            <button
              onClick={() => setDialogOpen(true)}
              className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Style
            </button>

            <button
              onClick={handleExport}
              disabled={lines.length === 0}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Export
            </button>

            {videoUrl && lines.length > 0 && (
              <RewrapMuxer
                videoUrl={videoUrl}
                srtContent={lines.map(l => `${l.id}\n${l.startTime} --> ${l.endTime}\n${l.text}`).join('\n\n')}
                onComplete={(url) => setMuxedVideoUrl(url)}
              />
            )}
          </div>

          {/* Status */}
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>Subtitles: {lines.length} lines</span>
            <span>Video: {videoUrl ? 'Loaded' : 'Not loaded'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview with Live Subtitles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
              
              {muxedVideoUrl ? (
                <div>
                  <video controls className="w-full rounded-lg bg-black" src={muxedVideoUrl} />
                  <div className="mt-4 flex gap-3">
                    <a
                      href={muxedVideoUrl}
                      download="video-with-subtitles.mp4"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Download Video
                    </a>
                    <button onClick={() => setMuxedVideoUrl('')} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                      Clear
                    </button>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full rounded-lg bg-black"
                    src={videoUrl}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  />
                  {currentSubtitle && (
                    <div style={getSubtitleStyle()} className="px-3 py-1">
                      {currentSubtitle}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Upload a video to see live preview</p>
                </div>
              )}
            </div>

            {/* Subtitle Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <SubtitleEditor lines={lines} onChange={setLines} />
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Style</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Alignment:</span>
                  <span className="font-medium capitalize">{style.side}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Position:</span>
                  <span className="font-medium capitalize">{style.layout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Font Size:</span>
                  <span className="font-medium">{style.fontSize}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Text Color:</span>
                  <span className="font-medium" style={{ color: style.colour }}>{style.colour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Background:</span>
                  <span className="font-medium" style={{ color: style.backgroundColour }}>{style.backgroundColour}</span>
                </div>
              </div>
            </div>
          </div>
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