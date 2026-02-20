import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Card from './Card';
import { useTheme } from '../contexts/ThemeContext';
import WORKOUTS from '../data/workouts';

export default function WorkoutList({ data, onSelectWorkout }) {
  const { isDark } = useTheme();

  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textTertiary = isDark ? 'text-gray-600' : 'text-gray-400';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Workouts</h1>
      <p className={`${textMuted} text-sm mb-4`}>3× gym + 2× home abs per week</p>

      {Object.entries(WORKOUTS).map(([name, exercises]) => {
        const lastSession = [...data.workouts].reverse().find((w) => w.name === name);
        return (
          <button
            key={name}
            onClick={() => onSelectWorkout(name)}
            className={`w-full rounded-2xl p-4 mb-3 flex items-center justify-between text-left transition-colors ${
              isDark
                ? 'bg-gray-900 active:bg-gray-800'
                : 'bg-white border border-gray-200 shadow-sm active:bg-gray-50'
            }`}
          >
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className={`${textMuted} text-sm`}>{exercises.length} exercises</p>
              {lastSession && (
                <p className={`text-xs ${textTertiary} mt-1`}>Last: {lastSession.date}</p>
              )}
            </div>
            <ChevronRight size={20} className={textTertiary} />
          </button>
        );
      })}

      {data.workouts.length > 0 && (
        <Card>
          <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
            Recent Sessions
          </h2>
          {data.workouts.slice(-5).reverse().map((w, i) => (
            <div key={i} className={`flex justify-between py-2 border-b ${borderColor} last:border-0 text-sm`}>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{w.name}</span>
              <span className={textMuted}>{w.date}</span>
            </div>
          ))}
        </Card>
      )}
    </motion.div>
  );
}