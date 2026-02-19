const STORAGE_KEY = 'cuttracker_data';

// The shape of our stored data
const DEFAULT_DATA = {
  weights: {},      // { "2026-02-19": 59.8, ... }
  workouts: [],     // [{ date, name, exercises: [{ name, sets: [{ weight, reps }] }] }]
  nutrition: {},    // { "2026-02-19": { calories: 1800, protein: 135 }, ... }
  sleep: {},        // { "2026-02-19": { hours: 5.5, energy: 3 }, ... }
  steps: {},        // { "2026-02-19": 13200, ... }
};

// Load data from localStorage, falling back to defaults
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so new fields are always present
      return { ...DEFAULT_DATA, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load data from localStorage:', e);
  }
  return { ...DEFAULT_DATA };
}

// Save data to localStorage
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data to localStorage:', e);
  }
}

// Clear all data
export function clearData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
  }
}

export { DEFAULT_DATA };