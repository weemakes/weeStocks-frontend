'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun, Terminal } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
const eventName = 'weestox-theme';

function readTheme(): Theme {
  try {
    const value = localStorage.getItem('weestox-theme');
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

function isDarkMode(theme: Theme): boolean {
  if (typeof window === 'undefined') return false;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme) {
  const dark = isDarkMode(theme);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', dark);
}

function subscribe(callback: () => void) {
  const sync = () => {
    applyTheme(readTheme());
    callback();
  };
  window.addEventListener(eventName, sync);
  window.addEventListener('storage', sync);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', sync);
  return () => {
    window.removeEventListener(eventName, sync);
    window.removeEventListener('storage', sync);
    media.removeEventListener('change', sync);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'system' as Theme);
  const isDark = isDarkMode(theme);

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark';

    try {
      localStorage.setItem('weestox-theme', nextTheme);
    } catch {}

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        applyTheme(nextTheme);
        window.dispatchEvent(new Event(eventName));
      });
    } else {
      applyTheme(nextTheme);
      window.dispatchEvent(new Event(eventName));
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center h-8 w-15 rounded-full p-1 transition-all duration-300 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        isDark
          ? 'bg-slate-950 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:border-emerald-400/70'
          : 'bg-slate-200 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:border-amber-400'
      }`}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Hacker Dark mode'}
      title={isDark ? 'Hacker Mode: ON (Click for Light)' : 'Light Mode (Click for Hacker Dark)'}
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isDark ? 'opacity-20 text-slate-500 scale-75' : 'opacity-100 text-amber-500 scale-100'
          }`}
        />
        <Terminal
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isDark ? 'opacity-100 text-emerald-400 scale-100' : 'opacity-20 text-slate-400 scale-75'
          }`}
        />
      </div>

      {/* Sliding Thumb */}
      <div
        className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ease-out shadow-md ${
          isDark
            ? 'translate-x-7 bg-slate-900 border border-emerald-400/80 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            : 'translate-x-0 bg-white border border-amber-400/60 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)]'
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>

      {/* Micro Hacker Scan Dot */}
      <span
        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full transition-opacity duration-300 ${
          isDark ? 'bg-emerald-400 animate-ping opacity-75' : 'opacity-0'
        }`}
      />
    </button>
  );
}
