import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Card from './Card';
import ProgressBar from './ProgressBar';
import ChartTooltip from './ChartTooltip';
import PROFILE from '../data/profile';
import { TRACKED_LIFTS } from '../data/workouts';
import { lastNDays, shortDate } from '../utils/dates';
import { fmt, calcProjection, calcProgress, calcVolume } from '../utils/calculations';

export default function Projections({ data, currentWeight, bodyFat }) {
  // Calculate projections for each target
  const proj15 = calcProjection(currentWeight, PROFILE.target15);
  const proj14 = calcProjection(currentWeight, PROFILE.target14);
  const proj13 = calcProjection(currentWeight, PROFILE.target13);

  const targets = [
    {
      label: '15% BF',
      target: PROFILE.target15,
      proj: proj15,
      color: 'text-blue-400',
      bg: 'bg-blue-950 border-blue-900',
    },
    {
      label: '14% BF',
      target: PROFILE.target14,
      proj: proj14,
      color: 'text-purple-400',
      bg: 'bg-purple-950 border-purple-900',
    },
    {
      label: '13% BF',
      target: PROFILE.target13,
      proj: proj13,
      color: 'text-emerald-400',
      bg: 'bg-emerald-950 border-emerald-900',
    },
  ];

  // Weight chart for 30 days
  const weightChart = useMemo(
    () =>
      lastNDays(30)
        .filter((d) => data.weights[d])
        .map((d) => ({ d: shortDate(d), w: data.weights[d] })),
    [data.weights]
  );

  // Strength chart for tracked compound lifts
  const strengthData = useMemo(() => {
    const results = [];
    TRACKED_LIFTS.forEach((lift) => {
      data.workouts.forEach((w) => {
        const ex = w.exercises.find((e) => e.name === lift);
        if (ex) {
          // Find existing point for this date or create one
          let point = results.find((r) => r.d === shortDate(w.date));
          if (!point) {
            point = { d: shortDate(w.date) };
            results.push(point);
          }
          point[lift] = calcVolume(ex.sets);
        }
      });
    });
    return results.sort((a, b) => a.d.localeCompare(b.d));
  }, [data.workouts]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Fat Loss Forecast</h1>
      <p className="text-gray-500 text-sm mb-4">
        Based on ~350 kcal/day deficit · 0.3–0.4 kg/week
      </p>

      {/* Projected Timelines */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Projected Timeline
        </h2>
        <div className="space-y-3">
          {targets.map((t) => {
            const reached = currentWeight <= t.target;
            return (
              <div
                key={t.label}
                className={`p-4 rounded-xl border ${t.bg} ${
                  reached ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`font-bold text-lg ${t.color}`}>{t.label}</p>
                    <p className="text-gray-400 text-sm">{t.target} kg</p>
                  </div>
                  <div className="text-right">
                    {reached ? (
                      <p className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check size={16} /> Reached!
                      </p>
                    ) : (
                      <>
                        <p className="font-bold text-lg text-white">
                          {t.proj.date}
                        </p>
                        <p className="text-gray-500 text-sm">
                          ~{t.proj.weeks} weeks
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    pct={calcProgress(currentWeight, t.target)}
                    color={reached ? 'bg-emerald-500' : 'bg-gray-600'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assumptions */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Assumptions
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex justify-between">
            <span>Daily Intake</span>
            <span className="text-white">{PROFILE.calGoal} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Daily Steps</span>
            <span className="text-white">
              ~{PROFILE.stepsGoal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Deficit</span>
            <span className="text-white">
              {PROFILE.deficitLow}–{PROFILE.deficitHigh} kcal/day
            </span>
          </div>
          <div className="flex justify-between">
            <span>Weekly Fat Loss</span>
            <span className="text-white">0.3–0.4 kg</span>
          </div>
          <div className="flex justify-between">
            <span>Training</span>
            <span className="text-white">3× gym + 2× abs</span>
          </div>
        </div>
      </Card>

      {/* Weight Trend Chart */}
      {weightChart.length > 2 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Weight Trend (30d)
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChart}>
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
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

      {/* Strength Trend Chart */}
      {strengthData.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Strength Trend (Volume)
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strengthData}>
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Incline Machine Press"
                  name="Push"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="Deadlift / RDL"
                  name="Pull"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="Smith Squat"
                  name="Legs"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-amber-500 rounded-full inline-block" />{' '}
              Push
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-red-500 rounded-full inline-block" />{' '}
              Pull
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />{' '}
              Legs
            </span>
          </div>
        </Card>
      )}

      {/* Current Status */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Current Status
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Weight</p>
            <p className="text-xl font-bold">{fmt(currentWeight)} kg</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Body Fat</p>
            <p className="text-xl font-bold">{fmt(bodyFat)}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">To Lose (15%)</p>
            <p className="text-xl font-bold">
              {fmt(Math.max(0, currentWeight - PROFILE.target15))} kg
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">To Lose (14%)</p>
            <p className="text-xl font-bold">
              {fmt(Math.max(0, currentWeight - PROFILE.target14))} kg
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}