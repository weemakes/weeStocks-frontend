'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './useTheme';

export default function ThemeToggle() {
  const { isDark, setTheme } = useTheme();
  return <button type="button" onClick={() => setTheme(isDark ? 'light' : 'dark')}
    aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:bg-slate-800 dark:hover:text-sky-400 dark:focus-visible:ring-offset-slate-950">
    <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
  </button>;
}
