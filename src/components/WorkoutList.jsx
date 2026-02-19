import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Card from './Card';
import WORKOUTS from '../data/workouts';

export default function WorkoutList({ data, onSelectWorkout }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-1">Workouts</h1>
      <p className="text-gray-500 text-sm mb-4">
        3× gym + 2× home abs per week
      </p>

      {Object.entries(WORKOUTS).map(([name, exercises]) => {
        // Find last session date for this workout
        const lastSession = [...data.workouts]
          .reverse()
          .find((w) => w.name === name);

        return (
          <button
            key={name}
            onClick={() => onSelectWorkout(name)}
            className="w-full bg-gray-900 rounded-2xl p-4 mb-3 flex items-center justify-between active:bg-gray-800 text-left transition-colors"
          >
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-gray-500 text-sm">
                {exercises.length} exercises
              </p>
              {lastSession && (
                <p className="text-xs text-gray-600 mt-1">
                  Last: {lastSession.date}
                </p>
              )}
            </div>
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        );
      })}

      {/* Recent sessions log */}
      {data.workouts.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Recent Sessions
          </h2>
          {data.workouts
            .slice(-5)
            .reverse()
            .map((w, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b border-gray-800 last:border-0 text-sm"
              >
                <span className="text-gray-300">{w.name}</span>
                <span className="text-gray-500">{w.date}</span>
              </div>
            ))}
        </Card>
      )}
    </motion.div>
  );
}