import React from 'react';
import { Home, Dumbbell, Utensils, Moon, TrendingDown } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'nutrition', label: 'Food', icon: Utensils },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'proj', label: 'Forecast', icon: TrendingDown },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
      <div className="max-w-lg mx-auto flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2.5 transition-colors ${
                isActive ? 'text-blue-400' : 'text-gray-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}