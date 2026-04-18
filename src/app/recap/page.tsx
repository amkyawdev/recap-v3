'use client';

import { useState } from 'react';
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    <div className="min-h-screen bg-gray-100">
      <SideMenu />
      <MobileButton />

      <div className="ml-0 md:ml-16 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recap - Subtitle Editor</h1>
          <p className="text-gray-500 mt-1">Edit subtitles and combine with video</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (SRT/TXT)</label>
                  <input
                    type="file"
                    accept=".srt,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-strawberry-50 file:text-strawberry-700 hover:file:bg-strawberry-100 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* File Status */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${lines.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-gray-600">Subtitles: {lines.length} lines</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className={`w-2 h-2 rounded-full ${videoUrl ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                  <span className="text-gray-600">Video: {videoUrl ? 'Loaded' : 'Not loaded'}</span>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDialogOpen(true)}
                  className="w-full px-4 py-2.5 bg-strawberry-500 text-white rounded-lg font-medium hover:bg-strawberry-600"
                >
                  Style Options
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  disabled={lines.length === 0}
                  className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900"
                >
                  Export SRT
                </motion.button>

                {videoUrl && lines.length > 0 && (
                  <RewrapMuxer
                    videoUrl={videoUrl}
                    srtContent={lines.map(l => `${l.id}\n${l.startTime} --> ${l.endTime}\n${l.text}\n`).join('\n')}
                    onComplete={(url) => setMuxedVideoUrl(url)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Editor & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            {(videoUrl || muxedVideoUrl) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h2>
                {muxedVideoUrl ? (
                  <div>
                    <video controls className="w-full rounded-lg bg-black" src={muxedVideoUrl} />
                    <div className="mt-4 flex gap-3">
                      <a
                        href={muxedVideoUrl}
                        download="video-with-subtitles.mp4"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Video
                      </a>
                      <button
                        onClick={() => setMuxedVideoUrl('')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <video controls className="w-full rounded-lg bg-black" src={videoUrl} />
                )}
              </div>
            )}

            {/* Subtitle Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <SubtitleEditor lines={lines} onChange={setLines} />
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