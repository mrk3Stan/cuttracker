import PROFILE from '../data/profile';
import { daysAgo } from './dates';

/**
 * Compute a composite recovery score (0–100) for a given date.
 *
 * Weighted formula:
 *   Sleep hours    → 40 points (0–40)
 *   Energy rating  → 25 points (0–25)
 *   Calorie adequacy (previous day) → 20 points (0–20)
 *   Rest day bonus → 15 points (0 or 15)
 *
 * @param {string} dateStr  - YYYY-MM-DD date to score
 * @param {object} data     - full app data { sleep, nutrition, workouts }
 * @returns {{ score: number, level: 'green'|'amber'|'red', label: string, breakdown: object } | null}
 */
export function calcRecoveryScore(dateStr, data) {
  const sleepEntry = data.sleep[dateStr];

  // Can't compute without sleep data for the day
  if (!sleepEntry) return null;

  // --- 1. Sleep hours score (0–40) ---
  // Linear scale: 0h = 0pts, idealHours = 40pts, capped at 40
  const sleepHours = sleepEntry.hours || 0;
  const sleepScore = Math.min(40, Math.round((sleepHours / PROFILE.sleepIdealHours) * 40));

  // --- 2. Energy rating score (0–25) ---
  // Energy is 1–5, map to 0–25
  const energy = sleepEntry.energy || 1;
  const energyScore = Math.round(((energy - 1) / 4) * 25);

  // --- 3. Calorie adequacy from previous day (0–20) ---
  // Check if yesterday's calories were >= 90% of calGoal
  const yesterday = daysAgo(
    Math.round(
      (new Date(dateStr + 'T12:00:00').getTime() - new Date(daysAgo(0) + 'T12:00:00').getTime())
        / 86400000
    ) + 1
  );
  // Simpler: compute the day before dateStr directly
  const prevDate = getPreviousDay(dateStr);
  const prevNutrition = data.nutrition[prevDate];
  let nutritionScore = 10; // default: no data = neutral (half credit)
  if (prevNutrition && prevNutrition.calories > 0) {
    const ratio = prevNutrition.calories / PROFILE.calGoal;
    if (ratio >= 0.9 && ratio <= 1.1) {
      nutritionScore = 20; // within ±10% of goal = full marks
    } else if (ratio >= 0.8) {
      nutritionScore = 15; // slightly under
    } else if (ratio >= 0.7) {
      nutritionScore = 10; // moderately under
    } else {
      nutritionScore = 5;  // severely under-eating
    }
    // Over-eating penalty (> 120% of goal)
    if (ratio > 1.2) {
      nutritionScore = 12;
    }
  }

  // --- 4. Rest day bonus (0 or 15) ---
  // If the user did NOT train yesterday OR the day before, grant bonus.
  // "Consecutive training day" = trained both yesterday and day-before-yesterday
  const prevDay1 = prevDate;
  const prevDay2 = getPreviousDay(prevDay1);
  const trainedYesterday = data.workouts.some((w) => w.date === prevDay1);
  const trainedDayBefore = data.workouts.some((w) => w.date === prevDay2);

  let restScore = 0;
  if (!trainedYesterday) {
    restScore = 15; // full rest day bonus
  } else if (!trainedDayBefore) {
    restScore = 8;  // trained yesterday but had rest before that
  } else {
    restScore = 0;  // consecutive training days
  }

  // --- Total ---
  const score = Math.min(100, sleepScore + energyScore + nutritionScore + restScore);

  // --- Traffic light ---
  let level, label;
  if (score >= PROFILE.recoveryGreenMin) {
    level = 'green';
    label = 'Train Hard';
  } else if (score >= PROFILE.recoveryAmberMin) {
    level = 'amber';
    label = 'Train Light';
  } else {
    level = 'red';
    label = 'Rest Day';
  }

  return {
    score,
    level,
    label,
    breakdown: {
      sleep: sleepScore,
      energy: energyScore,
      nutrition: nutritionScore,
      rest: restScore,
    },
  };
}

/**
 * Get the YYYY-MM-DD string for the day before a given date string.
 */
function getPreviousDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}