import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen select-none transition-colors duration-300 ${
      isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {children}
      </div>
    </div>
  );
}