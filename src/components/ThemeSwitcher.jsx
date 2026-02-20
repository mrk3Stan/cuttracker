import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const OPTIONS = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'auto', label: 'Auto', icon: Monitor },
];

export default function ThemeSwitcher() {
  const { mode, setTheme, isDark } = useTheme();

  return (
    <div className={`flex rounded-xl p-1 gap-1 ${
      isDark ? 'bg-gray-800' : 'bg-gray-200'
    }`}>
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = mode === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
              isActive
                ? isDark
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label={`${opt.label} theme`}
          >
            <Icon size={14} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}