import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Plus, Minus, Save, AlertTriangle, ArrowUp, ArrowDown,
} from 'lucide-react';
import Card from './Card';
import WORKOUTS from '../data/workouts';
import PROFILE from '../data/profile';
import { calcVolume, fmt } from '../utils/calculations';
import { todayFormatted } from '../utils/dates';

export default function WorkoutSession({ workoutName, data, onSave, onBack }) {
  const exercises = WORKOUTS[workoutName];

  // Initialize sets from last session or 3 empty sets
  const [sets, setSets] = useState(() => {
    const lastSession = [...data.workouts]
      .reverse()
      .find((w) => w.name === workoutName);

    const initial = {};
    exercises.forEach((ex) => {
      const prevExercise = lastSession?.exercises?.find((e) => e.name === ex);
      initial[ex] = prevExercise?.sets?.length
        ? prevExercise.sets.map((s) => ({ ...s }))
        : [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ];
    });
    return initial;
  });

  // Get previous session volume for comparison
  const getPrevVolume = (exerciseName) => {
    const sessions = data.workouts.filter((w) => w.name === workoutName);
    if (!sessions.length) return null;
    const lastEx = sessions[sessions.length - 1].exercises.find(
      (e) => e.name === exerciseName
    );
    return lastEx ? calcVolume(lastEx.sets) : null;
  };

  const getCurrentVolume = (exerciseName) => {
    return sets[exerciseName] ? calcVolume(sets[exerciseName]) : 0;
  };

  const updateSet = (exercise, setIndex, field, value) => {
    setSets((prev) => {
      const updated = { ...prev };
      updated[exercise] = [...updated[exercise]];
      updated[exercise][setIndex] = {
        ...updated[exercise][setIndex],
        [field]: parseFloat(value) || 0,
      };
      return updated;
    });
  };

  const addSet = (exercise) => {
    setSets((prev) => {
      const updated = { ...prev };
      const lastSet = updated[exercise][updated[exercise].length - 1] || {
        weight: 0,
        reps: 0,
      };
      updated[exercise] = [...updated[exercise], { ...lastSet }];
      return updated;
    });
  };

  const removeSet = (exercise) => {
    setSets((prev) => {
      const updated = { ...prev };
      if (updated[exercise].length > 1) {
        updated[exercise] = updated[exercise].slice(0, -1);
      }
      return updated;
    });
  };

  const handleSave = () => {
    const exerciseData = Object.entries(sets).map(([name, s]) => ({
      name,
      sets: s,
    }));
    onSave(workoutName, exerciseData);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-blue-400 mb-3 text-sm"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-xl font-bold mb-1">{workoutName}</h1>
      <p className="text-gray-500 text-sm mb-4">{todayFormatted()}</p>

      {/* Exercise Cards */}
      {exercises.map((ex) => {
        const prevVol = getPrevVolume(ex);
        const curVol = getCurrentVolume(ex);
        const diff =
          prevVol && curVol > 0 ? ((curVol - prevVol) / prevVol) * 100 : null;

        return (
          <Card key={ex}>
            {/* Exercise Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{ex}</h3>
              {diff !== null && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${
                    diff < -PROFILE.strengthDropPct
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : diff > 0
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {diff > 0 ? (
                    <ArrowUp size={12} />
                  ) : diff < 0 ? (
                    <ArrowDown size={12} />
                  ) : null}
                  {diff > 0 ? '+' : ''}
                  {fmt(diff, 0)}%
                </span>
              )}
            </div>

            {/* Strength drop warning */}
            {diff !== null && diff < -PROFILE.strengthDropPct && (
              <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                <AlertTriangle size={12} /> Volume dropped &gt;5% — check
                recovery
              </p>
            )}

            {/* Set headers */}
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 px-1 mb-1">
              <span>Set</span>
              <span className="text-center">kg</span>
              <span className="text-center">Reps</span>
            </div>

            {/* Set rows */}
            <div className="space-y-2">
              {sets[ex]?.map((s, si) => (
                <div key={si} className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 text-sm pl-1">{si + 1}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={s.weight || ''}
                    placeholder="0"
                    onChange={(e) =>
                      updateSet(ex, si, 'weight', e.target.value)
                    }
                    className="bg-gray-800 rounded-xl h-10 text-center text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={s.reps || ''}
                    placeholder="0"
                    onChange={(e) =>
                      updateSet(ex, si, 'reps', e.target.value)
                    }
                    className="bg-gray-800 rounded-xl h-10 text-center text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Add/Remove set buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addSet(ex)}
                className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300"
              >
                <Plus size={14} /> Add Set
              </button>
              {sets[ex]?.length > 1 && (
                <button
                  onClick={() => removeSet(ex)}
                  className="text-xs text-gray-500 flex items-center gap-1 hover:text-gray-400"
                >
                  <Minus size={14} /> Remove
                </button>
              )}
            </div>

            {/* Previous volume reference */}
            {prevVol !== null && (
              <p className="text-xs text-gray-600 mt-2">
                Prev volume: {prevVol} kg·reps
              </p>
            )}
          </Card>
        );
      })}

      {/* Save Workout Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-2xl h-14 font-bold text-lg flex items-center justify-center gap-2 mb-4 transition-colors"
      >
        <Save size={20} /> Save Workout
      </button>
    </motion.div>
  );
}