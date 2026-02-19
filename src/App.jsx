import React, { useState } from 'react';
import useAppData from './hooks/useAppData';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import WorkoutList from './components/WorkoutList';
import WorkoutSession from './components/WorkoutSession';
import NutritionTracker from './components/NutritionTracker';
import SleepTracker from './components/SleepTracker';
import Projections from './components/Projections';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const {
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
    logWeight,
    logNutrition,
    logSleep,
    logSteps,
    saveWorkout,
    resetAll,
  } = useAppData();

  // Handle tab changes — reset workout selection when leaving workout tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedWorkout(null);
  };

  // Handle saving a workout session
  const handleSaveWorkout = (name, exercises) => {
    saveWorkout(name, exercises);
    setSelectedWorkout(null);
  };

  // Render the active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard
            data={data}
            currentWeight={currentWeight}
            weekAvgWeight={weekAvgWeight}
            bodyFat={bodyFat}
            leanMass={leanMass}
            todayNutrition={todayNutrition}
            todaySteps={todaySteps}
            alerts={alerts}
            logWeight={logWeight}
            logSteps={logSteps}
            resetAll={resetAll}
          />
        );

      case 'workout':
        if (selectedWorkout) {
          return (
            <WorkoutSession
              workoutName={selectedWorkout}
              data={data}
              onSave={handleSaveWorkout}
              onBack={() => setSelectedWorkout(null)}
            />
          );
        }
        return (
          <WorkoutList
            data={data}
            onSelectWorkout={setSelectedWorkout}
          />
        );

      case 'nutrition':
        return (
          <NutritionTracker
            data={data}
            todayNutrition={todayNutrition}
            weekCalAvg={weekCalAvg}
            logNutrition={logNutrition}
          />
        );

      case 'sleep':
        return (
          <SleepTracker
            data={data}
            alerts={alerts}
            logSleep={logSleep}
          />
        );

      case 'proj':
        return (
          <Projections
            data={data}
            currentWeight={currentWeight}
            bodyFat={bodyFat}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <Toast message={toastMsg} />
      {renderScreen()}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </Layout>
  );
}