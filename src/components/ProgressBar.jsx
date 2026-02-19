import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({
  pct,
  color = 'bg-blue-500',
  bg = 'bg-gray-800',
}) {
  const clampedPct = Math.min(100, Math.max(0, pct));

  return (
    <div className={`w-full h-2 rounded-full ${bg} overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clampedPct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}