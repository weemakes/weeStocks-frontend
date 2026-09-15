'use client';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useSyncExternalStore } from 'react';
type Theme = 'light' | 'dark' | 'system';
const eventName = 'weestox-theme';
function readTheme(): Theme {
  try { const value = localStorage.getItem('weestox-theme'); return value === 'light' || value === 'dark' ? value : 'system'; }
  catch { return 'system'; }
}
function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', dark);
}
function subscribe(callback: () => void) {
  const sync = () => { applyTheme(readTheme()); callback(); };
  window.addEventListener(eventName, sync);
  window.addEventListener('storage', sync);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', sync);
  return () => { window.removeEventListener(eventName, sync); window.removeEventListener('storage', sync); media.removeEventListener('change', sync); };
}
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'system' as Theme);
  return <div className="theme-switch" role="group" aria-label="Color theme">
    {([{ value: 'light', Icon: Sun }, { value: 'dark', Icon: Moon }, { value: 'system', Icon: Monitor }] as const).map(({ value, Icon }) =>
      <button key={value} type="button" aria-label={`${value[0].toUpperCase() + value.slice(1)} theme`} aria-pressed={theme === value} title={`${value} theme`}
        onClick={() => { try { localStorage.setItem('weestox-theme', value); } catch {} applyTheme(value); window.dispatchEvent(new Event(eventName)); }}>
        <Icon size={15} />
      </button>)}
  </div>;
}
