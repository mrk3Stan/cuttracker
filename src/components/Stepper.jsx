import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  unit = '',
}) {
  const { isDark } = useTheme();
  const numVal = parseFloat(value) || 0;

  const decrement = () => {
    const next = Math.max(min, numVal - step);
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
        className={`rounded-xl w-10 h-10 flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700'
        }`}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`text-center rounded-xl h-10 w-20 border focus:border-blue-500 focus:outline-none ${
          isDark
            ? 'bg-gray-800 text-white border-gray-700'
            : 'bg-gray-100 text-gray-900 border-gray-300'
        }`}
      />
      <button
        onClick={increment}
        className={`rounded-xl w-10 h-10 flex items-center justify-center transition-colors ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700'
        }`}
      >
        <Plus size={16} />
      </button>
      {unit && <span className={`text-sm ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{unit}</span>}
    </div>
  );
}