import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, Minus, Save, AlertTriangle, ArrowUp, ArrowDown,
  Check, Timer, X,
} from 'lucide-react';
import Card from './Card';
import WORKOUTS from '../data/workouts';
import PROFILE from '../data/profile';
import { calcVolume, fmt } from '../utils/calculations';
import { todayFormatted } from '../utils/dates';

export default function WorkoutSession({ workoutName, data, onSave, onBack }) {
  const exercises = WORKOUTS[workoutName];

  // --------------- SET STATE ---------------
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

  const [completedSets, setCompletedSets] = useState(() => {
    const initial = {};
    exercises.forEach((ex) => {
      initial[ex] = [];
    });
    return initial;
  });

  // --------------- REST TIMER ---------------
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [restTarget, setRestTarget] = useState(PROFILE.restPeriod || 90);

  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) return;
    const timeout = setTimeout(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [timerActive, timerSeconds]);

  const timerFinished = timerActive && timerSeconds === 0;
  const timerVisible = timerActive;

  const startTimer = useCallback(() => {
    setTimerSeconds(restTarget);
    setTimerActive(true);
  }, [restTarget]);

  const dismissTimer = useCallback(() => {
    setTimerActive(false);
    setTimerSeconds(0);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --------------- SET ACTIONS ---------------
  const completeSet = (exercise, setIndex) => {
    const wasCompleted = completedSets[exercise]?.[setIndex];
    setCompletedSets((prev) => {
      const updated = { ...prev };
      updated[exercise] = [...(updated[exercise] || [])];
      updated[exercise][setIndex] = !wasCompleted;
      return updated;
    });
    if (!wasCompleted) startTimer();
  };

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
    dismissTimer();
    const exerciseData = Object.entries(sets).map(([name, s]) => ({
      name,
      sets: s,
    }));
    onSave(workoutName, exerciseData);
  };

  const handleBack = () => {
    dismissTimer();
    onBack();
  };

  // --------------- RENDER ---------------
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="overflow-x-hidden"
    >
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-blue-400 mb-3 text-sm"
      >
        <ChevronLeft size={18} /> Back
      </button>

      <h1 className="text-xl font-bold mb-1">{workoutName}</h1>
      <p className="text-gray-500 text-sm mb-2">{todayFormatted()}</p>

      {/* Rest Period Setting */}
      <div className="flex items-center justify-between bg-gray-900 rounded-xl px-3 py-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Timer size={16} className="flex-shrink-0" />
          <span>Rest</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRestTarget((prev) => Math.max(15, prev - 15))}
            className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg w-8 h-8 flex items-center justify-center text-gray-400 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-white font-bold text-sm w-10 text-center">
            {restTarget}s
          </span>
          <button
            onClick={() => setRestTarget((prev) => prev + 15)}
            className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-lg w-8 h-8 flex items-center justify-center text-gray-400 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

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
              <h3 className="font-semibold text-sm sm:text-base truncate mr-2">{ex}</h3>
              {diff !== null && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 flex-shrink-0 ${
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
            <div className="grid grid-cols-[28px_1fr_1fr_36px] gap-1.5 text-xs text-gray-500 px-0.5 mb-1">
              <span>Set</span>
              <span className="text-center">kg</span>
              <span className="text-center">Reps</span>
              <span className="text-center">✓</span>
            </div>

            {/* Set rows */}
            <div className="space-y-1.5">
              {sets[ex]?.map((s, si) => {
                const isDone = completedSets[ex]?.[si];
                return (
                  <div
                    key={si}
                    className={`grid grid-cols-[28px_1fr_1fr_36px] gap-1.5 items-center transition-opacity ${
                      isDone ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="text-gray-500 text-sm text-center">
                      {si + 1}
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={s.weight || ''}
                      placeholder="0"
                      onChange={(e) =>
                        updateSet(ex, si, 'weight', e.target.value)
                      }
                      className="w-full min-w-0 bg-gray-800 rounded-lg h-10 text-center text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      value={s.reps || ''}
                      placeholder="0"
                      onChange={(e) =>
                        updateSet(ex, si, 'reps', e.target.value)
                      }
                      className="w-full min-w-0 bg-gray-800 rounded-lg h-10 text-center text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => completeSet(ex, si)}
                      className={`w-9 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-800 text-gray-600 border border-gray-700 hover:border-emerald-600'
                      }`}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add/Remove set buttons */}
            <div className="flex gap-3 mt-2">
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

      {timerVisible && <div className="h-20" />}

      {/* ============ FLOATING REST TIMER ============ */}
      <AnimatePresence>
        {timerVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-16 left-0 right-0 z-30 px-3"
          >
            <div className="max-w-lg mx-auto">
              <div
                className={`rounded-2xl px-3 py-3 flex items-center justify-between shadow-lg transition-colors duration-300 ${
                  timerFinished
                    ? 'bg-emerald-600'
                    : 'bg-gray-800 border border-blue-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Timer size={18} className={timerFinished ? 'text-white' : 'text-blue-400'} />
                  <div>
                    <p className="text-[10px] opacity-75 leading-tight">
                      {timerFinished ? 'Rest Complete!' : 'Resting…'}
                    </p>
                    <p className="text-xl font-bold font-mono leading-tight">
                      {formatTime(timerSeconds)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setTimerSeconds((prev) => Math.max(0, prev - 15))
                    }
                    className="bg-white/20 hover:bg-white/30 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors"
                  >
                    −15
                  </button>
                  <button
                    onClick={() =>
                      setTimerSeconds((prev) => prev + 15)
                    }
                    className="bg-white/20 hover:bg-white/30 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors"
                  >
                    +15
                  </button>
                  <button
                    onClick={dismissTimer}
                    className="bg-white/20 hover:bg-white/30 rounded-lg w-7 h-7 flex items-center justify-center ml-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}