'use client';

import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useAlarm } from '@/components/ui/AlarmToast';
import { SubtitleStyle } from '@/types/subtitle';

interface LogoStyle {
  size: number;
  position: string;
  opacity: number;
}

interface RewrapMuxerProps {
  videoUrl: string;
  srtContent?: string;
  logoUrl?: string;
  logoStyle?: LogoStyle;
  subtitleStyle?: SubtitleStyle;
  onComplete: (outputUrl: string) => void;
}

export default function RewrapMuxer({ 
  videoUrl, 
  srtContent = '', 
  logoUrl = '', 
  logoStyle = { size: 15, position: 'top-right', opacity: 100 },
  subtitleStyle,
  onComplete 
}: RewrapMuxerProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addAlarm } = useAlarm();
  const ffmpeg = new FFmpeg();

  const muxVideo = async () => {
    setLoading(true);
    setProgress(0);

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100));
      });

      // Write video file
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));

      const args: string[] = ['-i', 'input.mp4'];

      // Add SRT if provided
      if (srtContent) {
        const encoder = new TextEncoder();
        await ffmpeg.writeFile('subtitles.srt', encoder.encode(srtContent));
        args.push('-i', 'subtitles.srt', '-c:s', 'srt', '-metadata:s:s', 'language=eng');
      }

      // Add logo if provided
      if (logoUrl) {
        const logoResponse = await fetch(logoUrl);
        const logoBlob = await logoResponse.blob();
        const ext = logoUrl.split('.').pop()?.toLowerCase() || 'png';
        await ffmpeg.writeFile(`logo.${ext}`, await fetchFile(logoBlob));
        
        // Position filter
        let positionFilter = '';
        const posMap: Record<string, string> = {
          'top-left': '10:10',
          'top-right': 'main_w-overlay_w-10:10',
          'bottom-left': '10:main_h-overlay_h-10',
          'bottom-right': 'main_w-overlay_w-10:main_h-overlay_h-10',
        };
        const pos = posMap[logoStyle.position] || 'main_w-overlay_w-10:10';
        
        args.push(
          '-i', `logo.${ext}`,
          '-filter_complex', `[1:v]format=rgba,colorchannelmixer=aa=${logoStyle.opacity/100}[logo];[0:v][logo]overlay=${pos}`,
          '-c:v', 'libx264', '-preset', 'fast'
        );
      } else if (srtContent) {
        args.push('-c:v', 'copy');
      }

      args.push('-c:a', 'copy', 'output.mp4');

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile('output.mp4');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const outputBlob = new Blob([data as any], { type: 'video/mp4' });
      const outputUrl = URL.createObjectURL(outputBlob);

      onComplete(outputUrl);
      addAlarm('success', 'Video processed successfully');
    } catch (error) {
      console.error('Mux error:', error);
      addAlarm('error', 'Failed to process video');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const canCombine = videoUrl && (srtContent || logoUrl);

  return (
    <button
      onClick={muxVideo}
      disabled={loading || !canCombine}
      className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {loading ? `${progress}%` : 'Export'}
    </button>
  );
}
