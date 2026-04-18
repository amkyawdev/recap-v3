'use client';

import { useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useAlarm } from '@/components/ui/AlarmToast';

interface RewrapMuxerProps {
  videoUrl: string;
  srtContent: string;
  onComplete: (outputUrl: string) => void;
}

export default function RewrapMuxer({ videoUrl, srtContent, onComplete }: RewrapMuxerProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addAlarm } = useAlarm();
  const ffmpeg = new FFmpeg();

  const muxVideo = async () => {
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

      // Write video file
      const videoResponse = await fetch(videoUrl);
      const videoBlob = await videoResponse.blob();
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob));

      // Write SRT file
      const encoder = new TextEncoder();
      await ffmpeg.writeFile('subtitles.srt', encoder.encode(srtContent));

      // Mux video + subtitles
      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-i',
        'subtitles.srt',
        '-c:v',
        'copy',
        '-c:a',
        'copy',
        '-c:s',
        'srt',
        '-metadata:s:s',
        'language=eng',
        'output.mp4',
      ]);

      // Read output
      const data = await ffmpeg.readFile('output.mp4');
      const outputBlob = new Blob([data as Uint8Array], { type: 'video/mp4' });
      const outputUrl = URL.createObjectURL(outputBlob);

      onComplete(outputUrl);
      addAlarm('success', 'Video muxed successfully');
    } catch (error) {
      console.error('Mux error:', error);
      addAlarm('error', 'Failed to mux video');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <button
      onClick={muxVideo}
      disabled={loading || !videoUrl || !srtContent}
      className="px-3 py-1.5 bg-strawberry-500 text-white rounded text-sm disabled:opacity-50"
    >
      {loading ? `Processing... ${progress}%` : 'Combine Video + SRT'}
    </button>
  );
}