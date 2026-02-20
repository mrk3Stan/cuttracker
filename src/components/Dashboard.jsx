import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Save, Check, AlertTriangle } from 'lucide-react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import Stepper from './Stepper';
import ChartTooltip from './ChartTooltip';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import PROFILE from '../data/profile';
import { today, todayFormatted, lastNDays, shortDate } from '../utils/dates';
import { fmt, calcProgress } from '../utils/calculations';

export default function Dashboard({
  data,
  currentWeight,
  weekAvgWeight,
  bodyFat,
  leanMass,
  todayNutrition,
  todaySteps,
  alerts,
  logWeight,
  logSteps,
  resetAll,
}) {
  const { isDark } = useTheme();
  const [weightInput, setWeightInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');

  useEffect(() => {
    if (data.steps[today()]) setStepsInput(String(data.steps[today()]));
  }, [data.steps]);

  const progress15 = calcProgress(currentWeight, PROFILE.target15);

  const weightChart = useMemo(
    () =>
      lastNDays(30)
        .filter((d) => data.weights[d])
        .map((d) => ({ d: shortDate(d), w: data.weights[d] })),
    [data.weights]
  );

  const fatMass = currentWeight - leanMass;
  const hasLoggedToday = Boolean(data.weights[today()]);

  // Semantic color helpers
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const textTertiary = isDark ? 'text-gray-600' : 'text-gray-400';
  const inputBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900';
  const btnSecondary = isDark ? 'bg-gray-700' : 'bg-gray-200';
  const surfaceBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
  const chartTickColor = isDark ? '#6b7280' : '#9ca3af';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">CutTracker</h1>
          <p className={`${textMuted} text-sm`}>{todayFormatted()}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-400">{fmt(bodyFat)}%</p>
          <p className={`text-xs ${textMuted}`}>body fat</p>
        </div>
      </div>

      {/* Theme Switcher */}
      <div className="mb-3">
        <ThemeSwitcher />
      </div>

      {/* Quick Weight Log */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider`}>
            Log Weight
          </h2>
          {hasLoggedToday && (
            <span className="text-xs text-emerald-400">✓ Logged today</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Stepper
            value={weightInput}
            onChange={setWeightInput}
            step={0.1}
            unit="kg"
          />
          <button
            onClick={() => {
              logWeight(weightInput);
              setWeightInput('');
            }}
            className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl h-10 px-5 font-semibold flex items-center gap-1 transition-colors text-white"
          >
            <Save size={16} />
          </button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Current', value: `${fmt(currentWeight)}`, unit: 'kg' },
          { label: '7-Day Avg', value: `${fmt(weekAvgWeight)}`, unit: 'kg' },
          { label: 'Lean Mass', value: `${fmt(leanMass)}`, unit: 'kg' },
          { label: 'Fat Mass', value: `${fmt(fatMass)}`, unit: 'kg' },
        ].map((stat) => (
          <Card key={stat.label} className="mb-0">
            <p className={`text-xs ${textMuted} mb-1`}>{stat.label}</p>
            <p className="text-2xl font-bold">
              {stat.value}{' '}
              <span className={`text-sm ${textMuted}`}>{stat.unit}</span>
            </p>
          </Card>
        ))}
      </div>

      {/* Progress to 15% */}
      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>
          Progress to 15%
        </h2>
        <ProgressBar pct={progress15} color="bg-blue-500" />
        <div className={`flex justify-between mt-2 text-xs ${textMuted}`}>
          <span>{fmt(PROFILE.startWeight)} kg</span>
          <span className="text-blue-400 font-semibold">
            {fmt(progress15, 0)}%
          </span>
          <span>{fmt(PROFILE.target15)} kg</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { label: '15%', value: PROFILE.target15 },
            { label: '14%', value: PROFILE.target14 },
            { label: '13%', value: PROFILE.target13 },
          ].map((t) => {
            const reached = currentWeight <= t.value;
            return (
              <div
                key={t.label}
                className={`text-center p-2 rounded-xl ${
                  reached
                    ? 'bg-emerald-900 border border-emerald-700'
                    : surfaceBg
                }`}
              >
                <p className={`text-xs ${textSecondary}`}>{t.label}</p>
                <p className="font-bold">{t.value} kg</p>
                {reached && (
                  <Check size={14} className="mx-auto text-emerald-400 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today's Quick Log */}
      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>
          Today's Log
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className={`text-xs ${textMuted} mb-1`}>Steps</p>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="numeric"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                placeholder="13000"
                className={`rounded-xl h-10 w-full px-3 border focus:border-blue-500 focus:outline-none text-sm ${inputBg}`}
              />
              <button
                onClick={() => logSteps(stepsInput)}
                className={`${btnSecondary} rounded-xl h-10 w-10 flex items-center justify-center flex-shrink-0`}
              >
                <Check size={16} />
              </button>
            </div>
            {todaySteps > 0 && (
              <p className="text-xs text-emerald-400 mt-1">
                {todaySteps.toLocaleString()} steps
              </p>
            )}
          </div>
          <div>
            <p className={`text-xs ${textMuted} mb-1`}>Protein</p>
            <div className="h-10 flex items-center">
              <span
                className={`text-xl font-bold ${
                  todayNutrition.protein >= PROFILE.protGoal
                    ? 'text-emerald-400'
                    : ''
                }`}
              >
                {todayNutrition.protein}g
              </span>
              <span className={`${textMuted} text-sm ml-1`}>
                / {PROFILE.protGoal}g
              </span>
            </div>
            <ProgressBar
              pct={(todayNutrition.protein / PROFILE.protGoal) * 100}
              color={
                todayNutrition.protein >= PROFILE.protGoal
                  ? 'bg-emerald-500'
                  : 'bg-blue-500'
              }
            />
          </div>
        </div>
      </Card>

      {/* Weight Chart */}
      {weightChart.length > 2 && (
        <Card>
          <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-2`}>
            Weight Trend
          </h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChart}>
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 10, fill: chartTickColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tick={{ fontSize: 10, fill: chartTickColor }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="w"
                  name="Weight"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <Card className="border border-amber-900">
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Alerts
          </h2>
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`text-sm p-3 rounded-xl mb-2 last:mb-0 ${
                alert.type === 'red'
                  ? 'bg-red-950 text-red-300 border border-red-900'
                  : alert.type === 'amber'
                  ? 'bg-amber-950 text-amber-300 border border-amber-900'
                  : 'bg-blue-950 text-blue-300 border border-blue-900'
              }`}
            >
              {alert.msg}
            </div>
          ))}
        </Card>
      )}

      {/* Reset */}
      <button
        onClick={resetAll}
        className={`text-xs ${textTertiary} mt-4 mx-auto block hover:text-red-400 transition-colors`}
      >
        Reset All Data
      </button>
    </motion.div>
  );
}