import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Save, AlertTriangle } from 'lucide-react';
import Card from './Card';
import Stepper from './Stepper';
import ChartTooltip from './ChartTooltip';
import { today, lastNDays, shortDate } from '../utils/dates';

export default function SleepTracker({ data, alerts, logSleep }) {
  const [hoursInput, setHoursInput] = useState('');
  const [energyInput, setEnergyInput] = useState(3);

  // Pre-fill from today
  useEffect(() => {
    const todayData = data.sleep[today()];
    if (todayData) {
      setHoursInput(String(todayData.hours || ''));
      setEnergyInput(todayData.energy || 3);
    }
  }, [data.sleep]);

  // Sleep alerts only
  const sleepAlerts = alerts.filter(
    (a) =>
      a.msg.toLowerCase().includes('sleep') ||
      a.msg.toLowerCase().includes('deload')
  );

  // Chart data
  const sleepChart = useMemo(
    () =>
      lastNDays(14)
        .filter((d) => data.sleep[d])
        .map((d) => ({
          d: shortDate(d),
          h: data.sleep[d].hours,
          e: data.sleep[d].energy,
        })),
    [data.sleep]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Sleep & Recovery</h1>
      <p className="text-gray-500 text-sm mb-4">
        Tracking recovery for training optimization
      </p>

      {/* Log Form */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Log Tonight
        </h2>
        <div className="space-y-4">
          {/* Hours */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Hours Slept
            </label>
            <Stepper
              value={hoursInput}
              onChange={setHoursInput}
              step={0.5}
              unit="hrs"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Energy Level
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setEnergyInput(n)}
                  className={`flex-1 h-12 rounded-xl font-bold text-lg transition-colors ${
                    energyInput === n
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          <button
            onClick={() => logSleep(hoursInput, energyInput)}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </Card>

      {/* Sleep Alerts */}
      {sleepAlerts.map((a, i) => (
        <Card key={i} className="border border-amber-900">
          <div className="flex items-start gap-2 text-amber-300 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            {a.msg}
          </div>
        </Card>
      ))}

      {/* Sleep Hours Chart */}
      {sleepChart.length > 2 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Sleep Trend (14d)
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepChart}>
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="h"
                  name="Hours"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Energy Chart */}
      {sleepChart.length > 2 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Energy Trend
          </h2>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepChart}>
                <XAxis
                  dataKey="d"
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={25}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="e"
                  name="Energy"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* 7-Night Log */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Last 7 Nights
        </h2>
        {lastNDays(7).map((d) => {
          const s = data.sleep[d];
          return (
            <div
              key={d}
              className="flex justify-between py-2 border-b border-gray-800 last:border-0 text-sm"
            >
              <span className="text-gray-500">{shortDate(d)}</span>
              {s ? (
                <span className="text-gray-300">
                  {s.hours}h · Energy {s.energy}/5
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