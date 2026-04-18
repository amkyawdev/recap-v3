'use client';

import { SubtitleLine } from '@/types/subtitle';

interface SubtitleEditorProps {
  lines: SubtitleLine[];
  onChange: (lines: SubtitleLine[]) => void;
}

export default function SubtitleEditor({ lines, onChange }: SubtitleEditorProps) {
  const handleAdd = () => {
    const newLine: SubtitleLine = {
      id: lines.length > 0 ? Math.max(...lines.map((l) => l.id)) + 1 : 1,
      startTime: '00:00:00,000',
      endTime: '00:00:02,000',
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
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const sortedLines = [...lines].sort(
    (a, b) => parseTimestamp(a.startTime) - parseTimestamp(b.startTime)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subtitle Editor</h3>
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-strawberry-500 text-white rounded-lg text-sm font-medium hover:bg-strawberry-600"
        >
          + Add Line
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 w-12">#</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Text</th>
              <th className="p-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {sortedLines.map((line, index) => (
              <tr key={line.id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-gray-500">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.startTime}
                    onChange={(e) => handleUpdate(line.id, 'startTime', e.target.value)}
                    className="w-32 p-1.5 border rounded text-xs bg-gray-50"
                    placeholder="00:00:00,000"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.endTime}
                    onChange={(e) => handleUpdate(line.id, 'endTime', e.target.value)}
                    className="w-32 p-1.5 border rounded text-xs bg-gray-50"
                    placeholder="00:00:00,000"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => handleUpdate(line.id, 'text', e.target.value)}
                    className="w-full p-1.5 border rounded bg-gray-50"
                    placeholder="Subtitle text..."
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(line.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lines.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No subtitles yet. Click "Add Line" to start.
        </p>
      )}
    </div>
  );
}
