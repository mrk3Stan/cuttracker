import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'cuttracker_theme';

// 'light' | 'dark' | 'auto'
const ThemeContext = createContext();

function getSystemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getTimeBasedMode() {
  const hour = new Date().getHours();
  // Light mode from 6 AM to 7 PM
  return hour >= 6 && hour < 19 ? 'light' : 'dark';
}

function resolveEffectiveTheme(mode) {
  if (mode === 'auto') return getTimeBasedMode();
  return mode;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
    } catch { /* ignore */ }
    return 'dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState(() => resolveEffectiveTheme(mode));

  // Apply the theme to <html> and update meta theme-color
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#030712');
      document.body.className = 'bg-gray-950 text-white';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f9fafb');
      document.body.className = 'bg-gray-50 text-gray-900';
    }
  }, []);

  // Persist and resolve whenever mode changes
  useEffect(() => {
    try { localStorage.setItem(THEME_STORAGE_KEY, mode); } catch { /* ignore */ }
    const resolved = resolveEffectiveTheme(mode);
    setEffectiveTheme(resolved);
    applyTheme(resolved);
  }, [mode, applyTheme]);

  // If auto mode, re-check every minute for time-of-day switch
  useEffect(() => {
    if (mode !== 'auto') return;
    const interval = setInterval(() => {
      const resolved = resolveEffectiveTheme('auto');
      setEffectiveTheme((prev) => {
        if (prev !== resolved) {
          applyTheme(resolved);
          return resolved;
        }
        return prev;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [mode, applyTheme]);

  // Also listen to OS preference changes (for auto mode)
  useEffect(() => {
    if (mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = resolveEffectiveTheme('auto');
      setEffectiveTheme(resolved);
      applyTheme(resolved);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, applyTheme]);

  const setTheme = useCallback((newMode) => {
    if (newMode === 'light' || newMode === 'dark' || newMode === 'auto') {
      setMode(newMode);
    }
  }, []);

  const isDark = effectiveTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, effectiveTheme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}