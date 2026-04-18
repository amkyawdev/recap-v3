import { SubtitleLine } from '@/types/subtitle';

export function parseSRT(content: string): SubtitleLine[] {
  const lines: SubtitleLine[] = [];
  
  const normalized = content.trim();
  const allLines = normalized.split('\n');
  
  let currentSubtitle: Partial<SubtitleLine> = {};
  let inSubtitle = false;
  
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a subtitle number (just digits)
    if (/^\d+$/.test(line)) {
      // Save previous subtitle if exists
      if (inSubtitle && currentSubtitle.startTime && currentSubtitle.endTime && currentSubtitle.text) {
        lines.push(currentSubtitle as SubtitleLine);
      }
      // Start new subtitle
      currentSubtitle = { id: parseInt(line, 10) };
      inSubtitle = true;
    }
    // Check if this is a timestamp line
    else if (line.includes('-->')) {
      const timeMatch = line.match(
        /(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/
      );
      if (timeMatch) {
        currentSubtitle.startTime = timeMatch[1].replace('.', ',');
        currentSubtitle.endTime = timeMatch[2].replace('.', ',');
      }
    }
    // Otherwise it's text
    else {
      if (!currentSubtitle.text) {
        currentSubtitle.text = line;
      } else {
        currentSubtitle.text += '\n' + line;
      }
    }
  }
  
  // Don't forget the last subtitle
  if (inSubtitle && currentSubtitle.startTime && currentSubtitle.endTime && currentSubtitle.text) {
    lines.push(currentSubtitle as SubtitleLine);
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
