import { useState, useEffect, useMemo } from 'react';
import { loadData, saveData, clearData, DEFAULT_DATA } from '../utils/storage';
import { lastNDays, today } from '../utils/dates';
import {
  calcBodyFat,
  calcLeanMass,
  calcAverage,
  calcVolume,
} from '../utils/calculations';
import { calcRecoveryScore } from '../utils/recovery';  // ← ADD THIS
import PROFILE from '../data/profile';
import WORKOUTS from '../data/workouts';

export default function useAppData() {
  const [data, setData] = useState(() => loadData());
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const currentWeight = useMemo(() => {
    const dates = Object.keys(data.weights).sort().reverse();
    return dates.length > 0 ? data.weights[dates[0]] : PROFILE.startWeight;
  }, [data.weights]);

  const weekAvgWeight = useMemo(() => {
    const vals = lastNDays(7).map((d) => data.weights[d]).filter(Boolean);
    return vals.length > 0 ? calcAverage(vals) : currentWeight;
  }, [data.weights, currentWeight]);

  const bodyFat = useMemo(() => calcBodyFat(currentWeight), [currentWeight]);
  const leanMass = useMemo(
    () => calcLeanMass(currentWeight, bodyFat),
    [currentWeight, bodyFat]
  );

  const todayNutrition = data.nutrition[today()] || { calories: 0, protein: 0 };
  const todaySteps = data.steps[today()] || 0;
  const todaySleep = data.sleep[today()] || null;

  // ← ADD THIS: Compute today's recovery score
  const recoveryScore = useMemo(
    () => calcRecoveryScore(today(), data),
    [data]
  );

  const weekCalAvg = useMemo(() => {
    const vals = lastNDays(7).map((d) => data.nutrition[d]?.calories).filter(Boolean);
    return vals.length > 0 ? Math.round(calcAverage(vals)) : null;
  }, [data.nutrition]);

  const alerts = useMemo(() => {
    const result = [];

    const sleep3 = lastNDays(PROFILE.sleepWarningDays)
      .map((d) => data.sleep[d]?.hours)
      .filter((h) => h !== undefined);
    if (
      sleep3.length >= PROFILE.sleepWarningDays &&
      sleep3.every((h) => h < PROFILE.sleepMinHours)
    ) {
      result.push({
        type: 'amber',
        msg: `Sleep under ${PROFILE.sleepMinHours}hrs for ${PROFILE.sleepWarningDays}+ days. Reduce volume by 1 set per exercise this week.`,
      });
    }

    const sleep7 = lastNDays(7).map((d) => data.sleep[d]?.hours).filter((h) => h !== undefined);
    const avgSleep = sleep7.length > 0 ? calcAverage(sleep7) : 8;
    if (avgSleep < PROFILE.sleepDeloadHours) {
      result.push({
        type: 'red',
        msg: 'Average sleep under 5 hours. Consider taking a deload week.',
      });
    }

    const weights14 = lastNDays(14).map((d) => data.weights[d]).filter(Boolean);
    if (weights14.length >= 4) {
      const half = Math.floor(weights14.length / 2);
      const avg1 = calcAverage(weights14.slice(0, half));
      const avg2 = calcAverage(weights14.slice(half));
      if (Math.abs(avg2 - avg1) < 0.15) {
        result.push({
          type: 'blue',
          msg: 'Weight has been stable for ~2 weeks. Consider reducing carbs by 25g/day.',
        });
      }
    }

    if (weekCalAvg && weekCalAvg < PROFILE.calWarningMin) {
      result.push({
        type: 'amber',
        msg: `Weekly calorie average is ${weekCalAvg} kcal — too aggressive. Increase toward ${PROFILE.calGoal} kcal.`,
      });
    }

    const checkDecline = (wkName) => {
      const sessions = data.workouts.filter((w) => w.name === wkName);
      if (sessions.length >= 3) {
        const vols = sessions.slice(-3).map((s) =>
          s.exercises.reduce((sum, ex) => sum + calcVolume(ex.sets), 0)
        );
        return vols[2] < vols[1] && vols[1] < vols[0];
      }
      return false;
    };
    if (Object.keys(WORKOUTS).some(checkDecline)) {
      result.push({
        type: 'amber',
        msg: 'Strength has been declining. Consider increasing carbs slightly.',
      });
    }

    return result;
  }, [data, weekCalAvg]);

  const logWeight = (value) => {
    const v = parseFloat(value);
    if (v > 0) {
      setData((prev) => ({
        ...prev,
        weights: { ...prev.weights, [today()]: v },
      }));
      showToast('Weight saved');
    }
  };

  const logNutrition = (calories, protein) => {
    setData((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [today()]: {
          calories: parseInt(calories) || 0,
          protein: parseInt(protein) || 0,
        },
      },
    }));
    showToast('Nutrition saved');
  };

  const logSleep = (hours, energy) => {
    const h = parseFloat(hours);
    if (h >= 0) {
      setData((prev) => ({
        ...prev,
        sleep: { ...prev.sleep, [today()]: { hours: h, energy } },
      }));
      showToast('Sleep saved');
    }
  };

  const logSteps = (steps) => {
    const s = parseInt(steps);
    if (s >= 0) {
      setData((prev) => ({
        ...prev,
        steps: { ...prev.steps, [today()]: s },
      }));
      showToast('Steps saved');
    }
  };

  const saveWorkout = (name, exercises) => {
    setData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, { date: today(), name, exercises }],
    }));
    showToast('Workout saved');
  };

  const resetAll = () => {
    clearData();
    setData({ ...DEFAULT_DATA });
    showToast('All data cleared');
  };

  return {
    data,
    toastMsg,
    currentWeight,
    weekAvgWeight,
    bodyFat,
    leanMass,
    todayNutrition,
    todaySteps,
    todaySleep,
    weekCalAvg,
    alerts,
    recoveryScore,  // ← ADD THIS
    logWeight,
    logNutrition,
    logSleep,
    logSteps,
    saveWorkout,
    resetAll,
  };
}