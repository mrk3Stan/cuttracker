import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Check, AlertTriangle } from 'lucide-react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import PROFILE from '../data/profile';
import { today, lastNDays, shortDate } from '../utils/dates';

export default function NutritionTracker({
  data,
  todayNutrition,
  weekCalAvg,
  logNutrition,
}) {
  const [calInput, setCalInput] = useState('');
  const [protInput, setProtInput] = useState('');

  // Pre-fill from today's data
  useEffect(() => {
    const todayData = data.nutrition[today()];
    if (todayData) {
      setCalInput(String(todayData.calories || ''));
      setProtInput(String(todayData.protein || ''));
    }
  }, [data.nutrition]);

  const handleSave = () => {
    logNutrition(calInput, protInput);
  };

  const protPct = (todayNutrition.protein / PROFILE.protGoal) * 100;
  const protReached = todayNutrition.protein >= PROFILE.protGoal;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Nutrition</h1>
      <p className="text-gray-500 text-sm mb-4">
        Target: {PROFILE.calGoal} kcal · {PROFILE.protGoal}g protein
      </p>

      {/* Log Form */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Log Today
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Calories
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={calInput}
                onChange={(e) => setCalInput(e.target.value)}
                placeholder="1800"
                className="flex-1 bg-gray-800 rounded-xl h-12 px-4 text-white text-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <span className="flex items-center text-gray-500">kcal</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Protein
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={protInput}
                onChange={(e) => setProtInput(e.target.value)}
                placeholder="130"
                className="flex-1 bg-gray-800 rounded-xl h-12 px-4 text-white text-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <span className="flex items-center text-gray-500">g</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </Card>

      {/* Protein Progress */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Protein Progress
        </h2>
        <div className="flex items-end justify-between mb-2">
          <span
            className={`text-3xl font-bold ${
              protReached ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {todayNutrition.protein}g
          </span>
          <span className="text-gray-500 text-sm">/ {PROFILE.protGoal}g</span>
        </div>
        <ProgressBar
          pct={protPct}
          color={protReached ? 'bg-emerald-500' : 'bg-blue-500'}
        />
        {protReached && (
          <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1">
            <Check size={14} /> Protein target hit!
          </p>
        )}
      </Card>

      {/* Weekly Calorie Average */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Weekly Average
        </h2>
        {weekCalAvg ? (
          <div>
            <span
              className={`text-3xl font-bold ${
                weekCalAvg < PROFILE.calWarningMin
                  ? 'text-amber-400'
                  : weekCalAvg > 2000
                  ? 'text-red-400'
                  : 'text-white'
              }`}
            >
              {weekCalAvg}
            </span>
            <span className="text-gray-500 ml-1">kcal / day</span>
            {weekCalAvg < PROFILE.calWarningMin && (
              <div className="mt-2 bg-amber-950 border border-amber-900 rounded-xl p-3 text-amber-300 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                Too aggressive! Increase to {PROFILE.calGoal} kcal to preserve
                muscle.
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Log a few days to see your average
          </p>
        )}
      </Card>

      {/* 7-Day Log */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Last 7 Days
        </h2>
        {lastNDays(7).map((d) => {
          const n = data.nutrition[d];
          return (
            <div
              key={d}
              className="flex justify-between py-2 border-b border-gray-800 last:border-0 text-sm"
            >
              <span className="text-gray-500">{shortDate(d)}</span>
              {n ? (
                <span className="text-gray-300">
                  {n.calories} kcal · {n.protein}g protein
                </span>
              ) : (
                <span className="text-gray-700">—</span>
              )}
            </div>
          );
        })}
      </Card>
    </motion.div>
  );
}