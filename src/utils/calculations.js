import PROFILE from '../data/profile';

// Format a number to N decimal places
export function fmt(num, decimals = 1) {
  return Number(num).toFixed(decimals);
}

// Calculate estimated body fat percentage from current weight
// Formula: BF% = (1 - LeanMass / CurrentWeight) × 100
export function calcBodyFat(currentWeight) {
  return (1 - PROFILE.leanMass / currentWeight) * 100;
}

// Calculate lean mass based on current weight and body fat
export function calcLeanMass(currentWeight, bodyFatPct) {
  return currentWeight * (1 - bodyFatPct / 100);
}

// Calculate fat mass
export function calcFatMass(currentWeight, bodyFatPct) {
  return currentWeight * (bodyFatPct / 100);
}

// Calculate progress percentage toward a target weight
export function calcProgress(currentWeight, targetWeight) {
  const totalToLose = PROFILE.startWeight - targetWeight;
  const lostSoFar = PROFILE.startWeight - currentWeight;
  if (totalToLose <= 0) return 100;
  return Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
}

// Calculate projection for reaching a target weight
// Returns { weeks, date } where date is a formatted string
export function calcProjection(currentWeight, targetWeight) {
  const remaining = currentWeight - targetWeight;
  if (remaining <= 0) return { weeks: 0, date: 'Reached!', reached: true };
  const weeks = remaining / PROFILE.weeklyLossRate;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.round(weeks * 7));
  const dateStr = futureDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
  return { weeks: Math.ceil(weeks), date: dateStr, reached: false };
}

// Calculate total volume for an exercise (sum of weight × reps across all sets)
export function calcVolume(sets) {
  return sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
}

// Calculate the average of an array of numbers
export function calcAverage(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}