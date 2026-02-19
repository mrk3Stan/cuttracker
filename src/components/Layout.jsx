import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white select-none">
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {children}
      </div>
    </div>
  );
}