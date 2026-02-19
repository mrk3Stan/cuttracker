import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <div className="bg-emerald-600 text-white text-center py-3 px-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg">
            <Check size={18} />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}