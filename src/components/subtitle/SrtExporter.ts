import { SubtitleLine } from '@/types/subtitle';

export function exportToSRT(lines: SubtitleLine[]): string {
  const sortedLines = [...lines].sort((a, b) => {
    const parseTime = (t: string) => {
      const parts = t.replace(',', '.').split(':');
      if (parts.length !== 3) return 0;
      const h = parseInt(parts[0]) || 0;
      const m = parseInt(parts[1]) || 0;
      const s = parseFloat(parts[2]) || 0;
      return h * 3600 + m * 60 + s;
    };
    return parseTime(a.startTime) - parseTime(b.startTime);
  });

  return sortedLines
    .map((line, index) => {
      return `${index + 1}\n${line.startTime} --> ${line.endTime}\n${line.text}\n`;
    })
    .join('\n');
}

export function downloadSRT(lines: SubtitleLine[], filename = 'subtitles.srt') {
  const content = exportToSRT(lines);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}