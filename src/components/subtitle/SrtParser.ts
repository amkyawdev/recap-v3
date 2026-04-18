import { SubtitleLine } from '@/types/subtitle';

export function parseSRT(content: string): SubtitleLine[] {
  const lines: SubtitleLine[] = [];
  const blocks = content.trim().split(/\n\n+/);

  for (const block of blocks) {
    const parts = block.split('\n');
    if (parts.length < 3) continue;

    const idLine = parts[0].trim();
    const timeLine = parts[1].trim();
    const textLines = parts.slice(2);

    const id = parseInt(idLine, 10) || lines.length + 1;
    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/
    );

    if (!timeMatch) continue;

    const startTime = timeMatch[1].replace(',', ',');
    const endTime = timeMatch[2].replace(',', ',');
    const text = textLines.join('\n');

    lines.push({ id, startTime, endTime, text });
  }

  return lines;
}

export function parseSRTFile(file: File): Promise<SubtitleLine[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = parseSRT(content);
        resolve(lines);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}