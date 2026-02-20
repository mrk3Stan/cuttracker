import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, AlertTriangle } from 'lucide-react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import { useTheme } from '../contexts/ThemeContext';
import PROFILE from '../data/profile';
import { today, lastNDays, shortDate } from '../utils/dates';

export default function NutritionTracker({
  data,
  todayNutrition,
  weekCalAvg,
  logNutrition,
}) {
  const { isDark } = useTheme();
  const [calInput, setCalInput] = useState('');
  const [protInput, setProtInput] = useState('');

  useEffect(() => {
    const todayData = data.nutrition[today()];
    if (todayData) {
      setCalInput(String(todayData.calories || ''));
      setProtInput(String(todayData.protein || ''));
    }
  }, [data.nutrition]);

  const handleSave = () => logNutrition(calInput, protInput);

  const protPct = (todayNutrition.protein / PROFILE.protGoal) * 100;
  const protReached = todayNutrition.protein >= PROFILE.protGoal;

  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Nutrition</h1>
      <p className={`${textMuted} text-sm mb-4`}>
        Target: {PROFILE.calGoal} kcal · {PROFILE.protGoal}g protein
      </p>

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>Log Today</h2>
        <div className="space-y-3">
          <div>
            <label className={`text-xs ${textMuted} mb-1 block`}>Calories</label>
            <div className="flex gap-2">
              <input
                type="number" inputMode="numeric" value={calInput}
                onChange={(e) => setCalInput(e.target.value)} placeholder="1800"
                className={`flex-1 rounded-xl h-12 px-4 text-lg border focus:border-blue-500 focus:outline-none ${inputBg}`}
              />
              <span className={`flex items-center ${textMuted}`}>kcal</span>
            </div>
          </div>
          <div>
            <label className={`text-xs ${textMuted} mb-1 block`}>Protein</label>
            <div className="flex gap-2">
              <input
                type="number" inputMode="numeric" value={protInput}
                onChange={(e) => setProtInput(e.target.value)} placeholder="130"
                className={`flex-1 rounded-xl h-12 px-4 text-lg border focus:border-blue-500 focus:outline-none ${inputBg}`}
              />
              <span className={`flex items-center ${textMuted}`}>g</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-colors text-white"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </Card>

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>Protein Progress</h2>
        <div className="flex items-end justify-between mb-2">
          <span className={`text-3xl font-bold ${protReached ? 'text-emerald-400' : ''}`}>
            {todayNutrition.protein}g
          </span>
          <span className={`${textMuted} text-sm`}>/ {PROFILE.protGoal}g</span>
        </div>
        <ProgressBar pct={protPct} color={protReached ? 'bg-emerald-500' : 'bg-blue-500'} />
        {protReached && (
          <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
            <Check size={14} /> Protein target hit!
          </p>
        )}
      </Card>

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>Weekly Average</h2>
        {weekCalAvg ? (
          <div>
            <span className={`text-3xl font-bold ${
              weekCalAvg < PROFILE.calWarningMin ? 'text-amber-400' : weekCalAvg > 2000 ? 'text-red-400' : ''
            }`}>
              {weekCalAvg}
            </span>
            <span className={`${textMuted} ml-1`}>kcal / day</span>
            {weekCalAvg < PROFILE.calWarningMin && (
              <div className="mt-2 bg-amber-950 border border-amber-900 rounded-xl p-3 text-amber-300 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                Too aggressive! Increase to {PROFILE.calGoal} kcal to preserve muscle.
              </div>
            )}
          </div>
        ) : (
          <p className={`${textMuted} text-sm`}>Log a few days to see your average</p>
        )}
      </Card>

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-2`}>Last 7 Days</h2>
        {lastNDays(7).map((d) => {
          const n = data.nutrition[d];
          return (
            <div key={d} className={`flex justify-between py-2 border-b ${borderColor} last:border-0 text-sm`}>
              <span className={textMuted}>{shortDate(d)}</span>
              {n ? (
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {n.calories} kcal · {n.protein}g protein
                </span>
              ) : (
                <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>—</span>
              )}
            </div>
          );
        })}
      </Card>
    </motion.div>
  );
}