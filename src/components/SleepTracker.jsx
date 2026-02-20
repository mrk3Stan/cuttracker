import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Save, AlertTriangle } from 'lucide-react';
import Card from './Card';
import Stepper from './Stepper';
import ChartTooltip from './ChartTooltip';
import { useTheme } from '../contexts/ThemeContext';
import { today, lastNDays, shortDate } from '../utils/dates';

export default function SleepTracker({ data, alerts, logSleep }) {
  const { isDark } = useTheme();
  const [hoursInput, setHoursInput] = useState('');
  const [energyInput, setEnergyInput] = useState(3);

  useEffect(() => {
    const todayData = data.sleep[today()];
    if (todayData) {
      setHoursInput(String(todayData.hours || ''));
      setEnergyInput(todayData.energy || 3);
    }
  }, [data.sleep]);

  const sleepAlerts = alerts.filter(
    (a) =>
      a.msg.toLowerCase().includes('sleep') ||
      a.msg.toLowerCase().includes('deload')
  );

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

  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const textTertiary = isDark ? 'text-gray-600' : 'text-gray-400';
  const chartTickColor = isDark ? '#6b7280' : '#9ca3af';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Sleep & Recovery</h1>
      <p className={`${textMuted} text-sm mb-4`}>
        Tracking recovery for training optimization
      </p>

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-3`}>
          Log Tonight
        </h2>
        <div className="space-y-4">
          <div>
            <label className={`text-xs ${textMuted} mb-2 block`}>Hours Slept</label>
            <Stepper value={hoursInput} onChange={setHoursInput} step={0.5} unit="hrs" />
          </div>
          <div>
            <label className={`text-xs ${textMuted} mb-2 block`}>Energy Level</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setEnergyInput(n)}
                  className={`flex-1 h-12 rounded-xl font-bold text-lg transition-colors ${
                    energyInput === n
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className={`flex justify-between text-xs ${textTertiary} mt-1 px-1`}>
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>
          <button
            onClick={() => logSleep(hoursInput, energyInput)}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-colors text-white"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </Card>

      {sleepAlerts.map((a, i) => (
        <Card key={i} className="border border-amber-900">
          <div className="flex items-start gap-2 text-amber-300 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            {a.msg}
          </div>
        </Card>
      ))}

      {sleepChart.length > 2 && (
        <Card>
          <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-2`}>
            Sleep Trend (14d)
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepChart}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: chartTickColor }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: chartTickColor }} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="h" name="Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {sleepChart.length > 2 && (
        <Card>
          <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-2`}>
            Energy Trend
          </h2>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepChart}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: chartTickColor }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: chartTickColor }} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="e" name="Energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card>
        <h2 className={`text-sm font-semibold ${textSecondary} uppercase tracking-wider mb-2`}>
          Last 7 Nights
        </h2>
        {lastNDays(7).map((d) => {
          const s = data.sleep[d];
          return (
            <div key={d} className={`flex justify-between py-2 border-b ${borderColor} last:border-0 text-sm`}>
              <span className={textMuted}>{shortDate(d)}</span>
              {s ? (
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {s.hours}h · Energy {s.energy}/5
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