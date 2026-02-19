import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  unit = '',
}) {
  const numVal = parseFloat(value) || 0;

  const decrement = () => {
    const next = Math.max(min, numVal - step);
    // Round to avoid floating point issues
    onChange(String(Math.round(next * 100) / 100));
  };

  const increment = () => {
    const next = numVal + step;
    onChange(String(Math.round(next * 100) / 100));
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={decrement}
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl w-10 h-10 flex items-center justify-center transition-colors"
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-center rounded-xl h-10 w-20 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
      />
      <button
        onClick={increment}
        className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-xl w-10 h-10 flex items-center justify-center transition-colors"
      >
        <Plus size={16} />
      </button>
      {unit && <span className="text-gray-500 text-sm ml-1">{unit}</span>}
    </div>
  );
}