'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SubtitleLine } from '@/types/subtitle';

interface SubtitleEditorProps {
  lines: SubtitleLine[];
  onChange: (lines: SubtitleLine[]) => void;
}

export default function SubtitleEditor({ lines, onChange }: SubtitleEditorProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);

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
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Subtitle Editor</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-3 py-1 bg-strawberry-500 text-white rounded text-sm"
        >
          + Add Line
        </motion.button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left w-12">#</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Text</th>
              <th className="p-2 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLines.map((line, index) => (
              <motion.tr
                key={line.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.startTime}
                    onChange={(e) => handleUpdate(line.id, 'startTime', e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                    placeholder="00:00:00,000"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.endTime}
                    onChange={(e) => handleUpdate(line.id, 'endTime', e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                    placeholder="00:00:00,000"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => handleUpdate(line.id, 'text', e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder="Subtitle text..."
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(line.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    🗑️
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {lines.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No subtitles yet. Click &quot;Add Line&quot; to start.
        </p>
      )}
    </div>
  );
}