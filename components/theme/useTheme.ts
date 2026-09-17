'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'weestox-theme';

export function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function isDarkModeActive(theme?: Theme): boolean {
  if (typeof window === 'undefined') return true;
  const current = theme ?? readStoredTheme();
  if (current === 'dark') return true;
  if (current === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function setTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  const dark = isDarkModeActive(theme);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', dark);
  window.dispatchEvent(new Event(THEME_STORAGE_KEY));
}

function subscribeTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(THEME_STORAGE_KEY, callback);
  window.addEventListener('storage', callback);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', callback);
  return () => {
    window.removeEventListener(THEME_STORAGE_KEY, callback);
    window.removeEventListener('storage', callback);
    media.removeEventListener('change', callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readStoredTheme, () => 'system' as Theme);
  const isDark = useSyncExternalStore(
    subscribeTheme,
    () => isDarkModeActive(readStoredTheme()),
    () => true
  );

  return {
    theme,
    isDark,
    resolvedTheme: isDark ? ('dark' as const) : ('light' as const),
    setTheme,
  };
}
