// Each key is the workout name displayed in the app.
// Each value is an array of exercise names in order.

const WORKOUTS = {
    'A – Push': [
      'Incline Machine Press',
      'Flat DB Press',
      'Shoulder Press',
      'Lateral Raises',
      'Triceps Pushdown',
    ],
    'B – Pull': [
      'Deadlift / RDL',
      'Lat Pulldown',
      'Chest Supported Row',
      'Face Pull',
      'DB Curl',
    ],
    'C – Legs': [
      'Smith Squat',
      'Leg Press',
      'Hamstring Curl',
      'Calf Raises',
      'Plank',
    ],
    'Abs Day 1': [
      'Leg Raises',
      'Reverse Crunch',
      'Plank',
    ],
    'Abs Day 2': [
      'Dead Bug',
      'Side Plank',
      'Hollow Hold',
    ],
  };
  
  // These are the compound lifts we track in the strength trend chart.
  export const TRACKED_LIFTS = [
    'Incline Machine Press',
    'Deadlift / RDL',
    'Smith Squat',
  ];
  
  export default WORKOUTS;