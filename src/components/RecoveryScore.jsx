import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';
import { useTheme } from '../contexts/ThemeContext';

const LEVEL_CONFIG = {
  green: {
    ringColor: 'text-emerald-400',
    bgGlow: 'bg-emerald-500',
    bgBadge: 'bg-emerald-950 border-emerald-800 text-emerald-400',
    icon: TrendingUp,
    recommendation: 'You&aposre well recovered. Go heavy, push intensity.',
  },
  amber: {
    ringColor: 'text-amber-400',
    bgGlow: 'bg-amber-500',
    bgBadge: 'bg-amber-950 border-amber-800 text-amber-400',
    icon: Minus,
    recommendation: 'Moderate recovery. Reduce volume by 1–2 sets per exercise.',
  },
  red: {
    ringColor: 'text-red-400',
    bgGlow: 'bg-red-500',
    bgBadge: 'bg-red-950 border-red-800 text-red-400',
    icon: TrendingDown,
    recommendation: 'Low recovery. Take a rest day or do light cardio only.',
  },
};

export default function RecoveryScore({ recovery }) {
  const { isDark } = useTheme();

  if (!recovery) {
    const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="text-blue-400" />
          <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
            Recovery Score
          </h2>
        </div>
        <p className={`${textMuted} text-sm`}>
          Log today's sleep to see your recovery score.
        </p>
      </Card>
    );
  }

  const { score, level, label, breakdown } = recovery;
  const config = LEVEL_CONFIG[level];
  const LevelIcon = config.icon;

  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const barBg = isDark ? 'bg-gray-800' : 'bg-gray-200';

  // SVG arc for the score ring
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const strokeColor =
    level === 'green' ? '#34d399' : level === 'amber' ? '#fbbf24' : '#f87171';

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Activity size={18} className="text-blue-400" />
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider`}>
          Recovery Score
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Circular score gauge */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={isDark ? '#1f2937' : '#e5e7eb'}
              strokeWidth="8"
            />
            <motion.circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {score}
            </motion.span>
            <span className={`text-[10px] ${textMuted}`}>/ 100</span>
          </div>
        </div>

        {/* Traffic light badge + recommendation */}
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-bold mb-2 ${config.bgBadge}`}>
            <LevelIcon size={14} />
            {label}
          </div>
          <p className={`text-xs ${textSecondary} leading-relaxed`}>
            {config.recommendation}
          </p>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="mt-4 space-y-2">
        {[
          { key: 'sleep', label: 'Sleep', max: 40, value: breakdown.sleep },
          { key: 'energy', label: 'Energy', max: 25, value: breakdown.energy },
          { key: 'nutrition', label: 'Nutrition', max: 20, value: breakdown.nutrition },
          { key: 'rest', label: 'Rest Bonus', max: 15, value: breakdown.rest },
        ].map((item) => (
          <div key={item.key}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className={textMuted}>{item.label}</span>
              <span className={textSecondary}>
                {item.value}/{item.max}
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full ${barBg} overflow-hidden`}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: strokeColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / item.max) * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}