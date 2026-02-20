import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ProgressBar({
  pct,
  color = 'bg-blue-500',
  bg,
}) {
  const { isDark } = useTheme();
  const defaultBg = bg || (isDark ? 'bg-gray-800' : 'bg-gray-200');
  const clampedPct = Math.min(100, Math.max(0, pct));

  return (
    <div className={`w-full h-2 rounded-full ${defaultBg} overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedPct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}