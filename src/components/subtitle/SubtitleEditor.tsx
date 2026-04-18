'use client';

import { SubtitleLine } from '@/types/subtitle';

interface SubtitleEditorProps {
  lines: SubtitleLine[];
  onChange: (lines: SubtitleLine[]) => void;
}

export default function SubtitleEditor({ lines, onChange }: SubtitleEditorProps) {
  const handleAdd = () => {
    const lastLine = lines.length > 0 ? lines.reduce((a, b) => {
      const aEnd = parseTimestamp(a.endTime);
      const bEnd = parseTimestamp(b.endTime);
      return aEnd > bEnd ? a : b;
    }) : null;
    
    const startTime = lastLine ? lastLine.endTime : '00:00:00,000';
    const [h, m, s] = startTime.replace(',', '.').split(':').map(Number);
    const endSeconds = (h || 0) * 3600 + (m || 0) * 60 + (s || 0) + 3;
    const newEndTime = formatTime(endSeconds);

    const newLine: SubtitleLine = {
      id: lines.length > 0 ? Math.max(...lines.map((l) => l.id)) + 1 : 1,
      startTime,
      endTime: newEndTime,
      text: '',
    };
    onChange([...lines, newLine]);
  };

  const handleDelete = (id: number) => {
    onChange(lines.filter((l) => l.id !== id));
  };

  const handleUpdate = (id: number, field: keyof SubtitleLine, value: string) => {
    onChange(lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.replace(',', '.').split(':');
    if (parts.length !== 3) return 0;
    return (parseInt(parts[0]) || 0) * 3600 + (parseInt(parts[1]) || 0) * 60 + (parseFloat(parts[2]) || 0);
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},000`;
  };

  const sortedLines = [...lines].sort((a, b) => parseTimestamp(a.startTime) - parseTimestamp(b.startTime));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subtitle Editor</h3>
        <button onClick={handleAdd} className="px-3 py-1.5 bg-strawberry-500 text-white rounded-lg text-sm font-medium hover:bg-strawberry-600">
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {sortedLines.map((line, index) => (
          <div key={line.id} className="flex gap-2 items-start p-3 border rounded-lg hover:bg-gray-50 bg-white">
            <span className="text-gray-400 text-xs w-6 pt-2">{index + 1}</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={line.startTime} 
                  onChange={(e) => handleUpdate(line.id, 'startTime', e.target.value)} 
                  className="w-24 p-1.5 border rounded text-xs font-mono bg-gray-50" 
                />
                <span className="text-gray-400">→</span>
                <input 
                  type="text" 
                  value={line.endTime} 
                  onChange={(e) => handleUpdate(line.id, 'endTime', e.target.value)} 
                  className="w-24 p-1.5 border rounded text-xs font-mono bg-gray-50" 
                />
              </div>
              <textarea 
                value={line.text} 
                onChange={(e) => handleUpdate(line.id, 'text', e.target.value)} 
                className="w-full p-2 border rounded text-sm bg-gray-50" 
                rows={2}
                placeholder="Type subtitle here..."
              />
            </div>
            <button onClick={() => handleDelete(line.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {lines.length === 0 && (
        <p className="text-center text-gray-500 py-8">No subtitles. Click "Add" to start.</p>
      )}
    </div>
  );
}
