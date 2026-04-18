export interface SubtitleLine {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface SubtitleStyle {
  side: 'left' | 'center' | 'right';
  layout: 'top' | 'middle' | 'bottom';
  colour: string;
  backgroundColour: string;
  backgroundOpacity: number;
  font: 'pyidaungsu' | 'notoMyanmar' | 'masterpiece' | 'zawgyi';
  fontSize: number;
}

export interface SubtitleFile {
  name: string;
  content: SubtitleLine[];
  style: SubtitleStyle;
}

export interface VideoFile {
  name: string;
  url: string;
  size: number;
}

export interface LogoFile {
  name: string;
  url: string;
}

export type AlarmType = 'success' | 'error' | 'warning' | 'info';

export interface AlarmMessage {
  id: string;
  type: AlarmType;
  message: string;
  duration?: number;
}