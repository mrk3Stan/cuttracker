import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900 rounded-2xl p-4 mb-3 ${className}`}>
      {children}
    </div>
  );
}