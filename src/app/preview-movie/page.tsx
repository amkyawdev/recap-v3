'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';
import VideoUploader from '@/components/video/VideoUploader';
import LogoUploader from '@/components/video/LogoUploader';
import MultiFileUpload from '@/components/file/MultiFileUpload';
import SubtitleExtractor from '@/components/video/SubtitleExtractor';
import RewrapMuxer from '@/components/file/RewrapMuxer';
import { VideoFile, LogoFile, SubtitleLine } from '@/types/subtitle';
import { parseSRTFile } from '@/components/subtitle/SrtParser';
import { downloadSRT } from '@/components/subtitle/SrtExporter';

export default function PreviewMoviePage() {
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [logo, setLogo] = useState<LogoFile | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (v: VideoFile) => setVideo(v);
  const handleLogoUpload = (l: LogoFile) => setLogo(l);

  const handleSubtitleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const parsed = await parseSRTFile(file);
    setSubtitles(parsed);
  };

  const handleExtract = (srtContent: string) => {
    // Parse extracted SRT
    const lines = srtContent.split('\n\n');
    const parsed: SubtitleLine[] = [];
    lines.forEach((block, index) => {
      const parts = block.split('\n');
      if (parts.length >= 3) {
        const timeMatch = parts[1].match(
          /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/
        );
        if (timeMatch) {
          parsed.push({
            id: index + 1,
            startTime: timeMatch[1].replace(',', ','),
            endTime: timeMatch[2].replace(',', ','),
            text: parts.slice(2).join('\n'),
          });
        }
      }
    });
    setSubtitles(parsed);
  };

  const formatTime = (timestamp: string): number => {
    const parts = timestamp.replace(',', '.').split(':');
    if (parts.length !== 3) return 0;
    const h = parseInt(parts[0]) || 0;
    const m = parseInt(parts[1]) || 0;
    const s = parseFloat(parts[2]) || 0;
    return h * 3600 + m * 60 + s;
  };

  useEffect(() => {
    if (!videoRef.current || subtitles.length === 0) return;

    const updateSubtitle = () => {
      const currentTime = videoRef.current?.currentTime || 0;
      const index = subtitles.findIndex(
        (sub) =>
          currentTime >= formatTime(sub.startTime) &&
          currentTime <= formatTime(sub.endTime)
      );
      setCurrentSubtitle(index >= 0 ? index : -1);
    };

    videoRef.current.addEventListener('timeupdate', updateSubtitle);
    return () => videoRef.current?.removeEventListener('timeupdate', updateSubtitle);
  }, [video, subtitles]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuxComplete = (url: string) => {
    setOutputUrl(url);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <SideMenu />
        <MobileButton />

        <div className="ml-12 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Preview Movie</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <h2 className="text-sm font-semibold mb-2">Upload Video</h2>
              <VideoUploader onUpload={handleVideoUpload} />
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Upload Logo</h2>
              <LogoUploader onUpload={handleLogoUpload} />
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Upload SRT</h2>
              <MultiFileUpload onUpload={handleSubtitleUpload} accept={{ 'text/plain': ['.srt'] }} multiple={false} />
            </div>
          </div>

          {video && (
            <div className="mb-4">
              {videoRef.current && (
                <SubtitleExtractor videoUrl={video.url} onExtract={handleExtract} />
              )}
            </div>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
            {video ? (
              <>
                <video
                  ref={videoRef}
                  src={video.url}
                  className="w-full h-full"
                  playsInline
                />
                {currentSubtitle >= 0 && subtitles[currentSubtitle] && (
                  <div className="absolute bottom-20 left-0 right-0 text-center px-4">
                    <span className="inline-block px-2 py-1 bg-black/70 text-white rounded text-sm">
                      {subtitles[currentSubtitle].text}
                    </span>
                  </div>
                )}
                {logo && (
                  <div className="absolute top-4 right-4 w-20">
                    <img src={logo.url} alt="Logo" className="w-full" />
                  </div>
                )}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <span className="text-white text-5xl">
                    {isPlaying ? '⏸️' : '▶️'}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No video uploaded
              </div>
            )}
          </div>

          {video && subtitles.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => downloadSRT(subtitles)}
                className="px-3 py-1.5 bg-gray-700 text-white rounded text-sm"
              >
                💾 Export SRT
              </motion.button>
              <RewrapMuxer
                videoUrl={video.url}
                srtContent={subtitles.map((s) => `${s.id}\n${s.startTime} --> ${s.endTime}\n${s.text}`).join('\n\n')}
                onComplete={handleMuxComplete}
              />
            </motion.div>
          )}

          {outputUrl && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">
                ✅ Video processed! <a href={outputUrl} className="underline" download>Download</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}