import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { fmt } from '../utils/calculations';

export default function ChartTooltip({ active, payload, label }) {
  const { isDark } = useTheme();

  if (!active || !payload?.length) return null;

  return (
    <div className={`rounded-lg px-3 py-2 text-xs shadow-lg border transition-colors ${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <p className={isDark ? 'text-gray-400 mb-1' : 'text-gray-500 mb-1'}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="font-semibold">
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
}