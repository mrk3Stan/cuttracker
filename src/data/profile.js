// All user-specific constants live here.
// Adjust these values if the user profile changes.

const PROFILE = {
  age: 40,
  startWeight: 60.1,     // kg — starting weight
  leanMass: 48.7,         // kg — estimated lean mass (kept constant during cut)
  target15: 57.3,         // kg — weight at 15% body fat
  target14: 56.6,         // kg — weight at 14% body fat
  target13: 56.0,         // kg — weight at 13% body fat
  calGoal: 1800,          // kcal — daily calorie target
  protGoal: 130,          // grams — daily protein target
  stepsGoal: 10000,       // daily step target
  weeklyLossRate: 0.35,   // kg per week — estimated fat loss rate
  deficitLow: 300,        // kcal — low end of daily deficit
  deficitHigh: 400,       // kcal — high end of daily deficit
  calWarningMin: 1700,    // kcal — warn if weekly average falls below this
  sleepWarningDays: 3,    // consecutive days of poor sleep before alert
  sleepMinHours: 6,       // hours — threshold for poor sleep
  sleepDeloadHours: 5,    // hours — average sleep triggering deload suggestion
  strengthDropPct: 5,     // % — volume drop triggering recovery warning
  restPeriod: 90,         // seconds — default rest period between sets

  // Recovery Score thresholds
  recoveryGreenMin: 70,   // score >= 70 → green (train hard)
  recoveryAmberMin: 40,   // score 40–69 → amber (train light)
                           // score < 40 → red (rest)
  sleepIdealHours: 8,     // hours — ideal sleep for max score
};

export default PROFILE;