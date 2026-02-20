import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Card({ children, className = '' }) {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-2xl p-4 mb-3 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white shadow-sm border border-gray-200'
    } ${className}`}>
      {children}
    </div>
  );
}