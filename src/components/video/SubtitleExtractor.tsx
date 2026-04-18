'use client';

import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useAlarm } from '@/components/ui/AlarmToast';

interface SubtitleExtractorProps {
  videoUrl: string;
  onExtract: (srtContent: string) => void;
}

export default function SubtitleExtractor({ videoUrl, onExtract }: SubtitleExtractorProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addAlarm } = useAlarm();
  const ffmpeg = new FFmpeg();

  const extractSubtitles = async () => {
    setLoading(true);
    setProgress(0);

    try {
      // Load FFmpeg
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      // Write video file to FFmpeg virtual filesystem
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));

      // Try to extract subtitles
      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-s',
        's',
        'subtitles.srt',
      ]);

      // Check if subtitle was extracted
      try {
        const data = await ffmpeg.readFile('subtitles.srt');
        const content = new TextDecoder().decode(data);
        onExtract(content);
        addAlarm('success', 'Subtitles extracted successfully');
      } catch {
        addAlarm('warning', 'No embedded subtitles found. Please upload SRT manually.');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      addAlarm('error', 'Failed to extract subtitles');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <button
      onClick={extractSubtitles}
      disabled={loading}
      className="px-3 py-1.5 bg-strawberry-500 text-white rounded text-sm disabled:opacity-50"
    >
      {loading ? `Extracting... ${progress}%` : 'Extract Subtitles from Video'}
    </button>
  );
}