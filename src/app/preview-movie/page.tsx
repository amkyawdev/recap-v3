'use client';

import { useState, useRef, useEffect } from 'react';
import MobileButton from '@/components/ui/MobileButton';
import SideMenu from '@/components/ui/SideMenu';
import RewrapMuxer from '@/components/file/RewrapMuxer';
import { SubtitleLine, SubtitleStyle } from '@/types/subtitle';
import { parseSRTFile } from '@/components/subtitle/SrtParser';

interface LogoStyle {
  size: number;
  position: string;
  opacity: number;
}

const defaultSubtitleStyle: SubtitleStyle = {
  side: 'center',
  layout: 'bottom',
  colour: '#ffffff',
  backgroundColour: '#000000',
  backgroundOpacity: 0.5,
  font: 'notoMyanmar',
  fontSize: 24,
};

export default function PreviewMoviePage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [subtitles, setSubtitles] = useState<SubtitleLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleLine | null>(null);
  const [muxedVideoUrl, setMuxedVideoUrl] = useState('');

  const [logoStyle, setLogoStyle] = useState<LogoStyle>({
    size: 15,
    position: 'top-right',
    opacity: 100,
  });

  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>(defaultSubtitleStyle);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
      setMuxedVideoUrl('');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleSubtitleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsed = await parseSRTFile(file);
      setSubtitles(parsed);
    }
  };

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.replace(',', '.').split(':');
    if (parts.length !== 3) return 0;
    return (parseInt(parts[0]) || 0) * 3600 + (parseInt(parts[1]) || 0) * 60 + (parseFloat(parts[2]) || 0);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateSubtitle = () => {
      const time = video.currentTime;
      const sub = subtitles.find(s => time >= parseTimestamp(s.startTime) && time <= parseTimestamp(s.endTime));
      setCurrentSubtitle(sub || null);
    };

    video.addEventListener('timeupdate', updateSubtitle);
    return () => video.removeEventListener('timeupdate', updateSubtitle);
  }, [subtitles]);

  const getLogoPosition = () => {
    const positions: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    };
    return positions[logoStyle.position] || 'top-4 right-4';
  };

  const getSubtitleStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      color: subtitleStyle.colour,
      fontSize: `${subtitleStyle.fontSize}px`,
      fontFamily: subtitleStyle.font,
      textAlign: subtitleStyle.side as 'left' | 'center' | 'right',
    };

    if (subtitleStyle.layout === 'top') {
      style.position = 'absolute';
      style.top = '10%';
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    } else if (subtitleStyle.layout === 'middle') {
      style.position = 'absolute';
      style.top = '50%';
      style.transform = 'translate(-50%, -50%)';
    } else {
      style.position = 'absolute';
      style.bottom = '10%';
      style.left = '50%';
      style.transform = 'translateX(-50%)';
    }

    if (subtitleStyle.backgroundColour && subtitleStyle.backgroundOpacity > 0) {
      style.backgroundColor = `${subtitleStyle.backgroundColour}${Math.round(subtitleStyle.backgroundOpacity * 255).toString(16).padStart(2, '0')}`;
      style.padding = '4px 12px';
      style.borderRadius = '4px';
    }

    return style;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SideMenu />
      <MobileButton />

      <div className="ml-0 md:ml-16 p-4 md:p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Preview Movie</h1>
          <p className="text-gray-500 mt-1">Add logo, subtitles, and export video</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 mb-6">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 inline-flex items-center gap-1.5">
              Video
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>
            
            <label className="cursor-pointer px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 inline-flex items-center gap-1.5">
              Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>

            <label className="cursor-pointer px-3 py-2 bg-strawberry-500 text-white rounded-lg text-sm font-medium hover:bg-strawberry-600 inline-flex items-center gap-1.5">
              SRT
              <input type="file" accept=".srt,.txt" onChange={handleSubtitleUpload} className="hidden" />
            </label>

            {videoUrl && (logoUrl || subtitles.length > 0) && (
              <RewrapMuxer
                videoUrl={videoUrl}
                logoUrl={logoUrl}
                logoStyle={logoStyle}
                srtContent={subtitles.map(s => `${s.id}\n${s.startTime} --> ${s.endTime}\n${s.text}`).join('\n\n')}
                subtitleStyle={subtitleStyle}
                onComplete={(url) => setMuxedVideoUrl(url)}
              />
            )}
          </div>

          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>Video: {videoUrl ? 'Loaded' : 'None'}</span>
            <span>Logo: {logoUrl ? 'Loaded' : 'None'}</span>
            <span>Subtitles: {subtitles.length} lines</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              
              {muxedVideoUrl ? (
                <div>
                  <video controls className="w-full rounded-lg bg-black" src={muxedVideoUrl} />
                  <div className="mt-4 flex gap-3">
                    <a href={muxedVideoUrl} download="output-video.mp4" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Download Video
                    </a>
                    <button onClick={() => setMuxedVideoUrl('')} className="px-4 py-2 text-gray-600 hover:text-gray-900">Clear</button>
                  </div>
                </div>
              ) : videoUrl ? (
                <div className="relative">
                  <video ref={videoRef} controls className="w-full rounded-lg bg-black" src={videoUrl} />
                  
                  {currentSubtitle && <div style={getSubtitleStyle()}>{currentSubtitle.text}</div>}
                  
                  {logoUrl && (
                    <div className={`absolute ${getLogoPosition()}`} style={{ width: `${logoStyle.size}%`, opacity: logoStyle.opacity / 100 }}>
                      <img src={logoUrl} alt="Logo" className="w-full" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">Upload a video to see preview</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {logoUrl && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Controls</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Size: {logoStyle.size}%</label>
                    <input type="range" min="5" max="30" value={logoStyle.size} onChange={(e) => setLogoStyle({ ...logoStyle, size: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Position</label>
                    <select value={logoStyle.position} onChange={(e) => setLogoStyle({ ...logoStyle, position: e.target.value })} className="w-full p-2 border rounded-lg">
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Opacity: {logoStyle.opacity}%</label>
                    <input type="range" min="20" max="100" value={logoStyle.opacity} onChange={(e) => setLogoStyle({ ...logoStyle, opacity: parseInt(e.target.value) })} className="w-full" />
                  </div>
                </div>
              </div>
            )}

            {subtitles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subtitle Style</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Position</label>
                    <select value={subtitleStyle.layout} onChange={(e) => setSubtitleStyle({ ...subtitleStyle, layout: e.target.value as 'top' | 'middle' | 'bottom' })} className="w-full p-2 border rounded-lg">
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Alignment</label>
                    <select value={subtitleStyle.side} onChange={(e) => setSubtitleStyle({ ...subtitleStyle, side: e.target.value as 'left' | 'center' | 'right' })} className="w-full p-2 border rounded-lg">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 block mb-1">Color</label>
                      <input type="color" value={subtitleStyle.colour} onChange={(e) => setSubtitleStyle({ ...subtitleStyle, colour: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600 block mb-1">BG</label>
                      <input type="color" value={subtitleStyle.backgroundColour} onChange={(e) => setSubtitleStyle({ ...subtitleStyle, backgroundColour: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Font Size: {subtitleStyle.fontSize}px</label>
                    <input type="range" min="12" max="48" value={subtitleStyle.fontSize} onChange={(e) => setSubtitleStyle({ ...subtitleStyle, fontSize: parseInt(e.target.value) })} className="w-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
