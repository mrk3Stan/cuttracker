import React from 'react';
import { fmt } from '../utils/calculations';

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="font-semibold">
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
}