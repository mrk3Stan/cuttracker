# CutTracker 🔥

A comprehensive fitness tracking progressive web app (PWA) designed for tracking fat loss progress, workouts, nutrition, and recovery during a cutting phase.

## Features

### 📊 Dashboard
- Real-time body composition tracking (weight, body fat %, lean mass, fat mass)
- Progress visualization toward body fat targets (15%, 14%, 13%)
- Quick logging for daily weight and steps
- Protein intake tracking with visual progress bars
- 30-day weight trend chart
- Smart alerts for recovery, nutrition, and training adjustments

### 💪 Workout Tracking
- Pre-configured workout splits (Push, Pull, Legs, Abs)
- Set-by-set tracking with weight and reps
- Volume comparison with previous sessions
- Automatic strength drop warnings
- Session history and recent workouts log

### 🍽️ Nutrition Tracker
- Daily calorie and protein logging
- Weekly calorie average monitoring
- Protein goal progress visualization
- 7-day nutrition history
- Alerts for aggressive calorie deficits

### 😴 Sleep & Recovery
- Sleep duration and energy level tracking
- 14-day sleep trend charts
- Energy level visualization
- Recovery alerts for inadequate sleep
- Deload recommendations based on sleep patterns

### 📈 Fat Loss Projections
- Projected timeline for body fat targets
- Weight trend analysis (30 days)
- Strength trend charts for compound lifts
- Current status overview
- Detailed assumptions breakdown

### 🧠 Smart Alerts
- **Sleep Warnings**: Alerts for consecutive poor sleep days
- **Deload Suggestions**: Recommendations when average sleep is critically low
- **Plateau Detection**: Notifications when weight stalls for 2+ weeks
- **Calorie Warnings**: Alerts for overly aggressive deficits
- **Strength Decline**: Warnings when training volume drops significantly

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 4.2.0
- **Charts**: Recharts 3.7.0
- **Animations**: Framer Motion 12.34.2
- **Icons**: Lucide React 0.574.0
- **UI Components**: Headless UI 2.2.9
- **Data Storage**: LocalStorage (client-side)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:mrk3Stan/cuttracker.git
cd cuttracker
```

2. Install dependencies:
```bash
npm install
```

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Configuration

User-specific settings are stored in 

profile.js

. Adjust these values to customize:

- Starting weight and lean mass
- Body fat targets
- Daily calorie and protein goals
- Step targets
- Weekly fat loss rate
- Alert thresholds (sleep, calories, strength)

Workout routines are configured in 

workouts.js

.

## Deployment

This app is optimized for deployment on static hosting platforms:

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### Vercel

1. Import your repository
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy!

### Other Static Hosts

Build the project and upload the `dist` folder to any static hosting service (GitHub Pages, Cloudflare Pages, etc.).

## Data Storage

All data is stored locally in the browser's `localStorage`. This means:
- ✅ Complete privacy - no server or database required
- ✅ Works offline after initial load
- ⚠️ Data is tied to the browser/device
- ⚠️ Clearing browser data will reset the app

Export/import functionality can be added if needed.

## Project Structure

```
cuttracker/
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx
│   │   ├── WorkoutSession.jsx
│   │   ├── NutritionTracker.jsx
│   │   ├── SleepTracker.jsx
│   │   ├── Projections.jsx
│   │   └── ...
│   ├── data/            # Configuration files
│   │   ├── profile.js   # User settings
│   │   └── workouts.js  # Workout definitions
│   ├── hooks/           # Custom React hooks
│   │   └── useAppData.js
│   ├── utils/           # Utility functions
│   │   ├── calculations.js
│   │   ├── dates.js
│   │   └── storage.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
└── vite.config.js       # Vite configuration
```

## Development Tips

1. **Modify User Profile**: Edit `PROFILE` constants for personalized targets
2. **Add Exercises**: Update `WORKOUTS` to add or modify exercises
3. **Customize Calculations**: Body fat and projection formulas are in `calculations.js`
4. **Add New Trackers**: Follow the pattern in existing components (Dashboard, WorkoutSession, etc.)
5. **Reset Data**: Use the "Reset All Data" button on the Dashboard or clear localStorage manually

## Browser Support

Works on all modern browsers that support:
- ES2020 JavaScript features
- CSS Grid and Flexbox
- LocalStorage API
- Service Workers (for PWA functionality)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React and Vite
- Styled with Tailwind CSS
- Charts powered by Recharts
- Icons from Lucide