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
      'Barbell Curl',
    ],
    'C – Legs': [
      'Squat',
      'Leg Press',
      'Hamstring Curl',
      'Calf Raises',
      'Plank',
    ],
    'Abs Day 1': [
      'Ab Wheel Rollouts',
      'Reverse Crunch',
      'Leg Raises',
      'Plank',
    ],
    'Abs Day 2': [
      'Ab Wheel Rollouts',
      'Dead Bug',
      'Side Plank',
      'Hollow Hold',
    ],
  };
  
  // These are the compound lifts we track in the strength trend chart.
  export const TRACKED_LIFTS = [
    'Incline Machine Press',
    'Deadlift / RDL',
    'Squat',
  ];
  
  export default WORKOUTS;