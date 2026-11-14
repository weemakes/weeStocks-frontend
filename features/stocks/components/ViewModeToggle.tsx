'use client';

import { BarChart2, AlignJustify } from 'lucide-react';

interface ViewModeToggleProps {
  view: 'chart' | 'table';
  onChange: (view: 'chart' | 'table') => void;
  className?: string;
}

export default function ViewModeToggle({ view, onChange, className = '' }: ViewModeToggleProps) {
  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900 ${className}`}
      role="group"
      aria-label="View mode toggle"
    >
      <button
        type="button"
        onClick={() => onChange('chart')}
        title="Chart view"
        aria-pressed={view === 'chart'}
        className={`rounded-md p-1.5 transition-all cursor-pointer ${
          view === 'chart'
            ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white'
            : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
        }`}
      >
        <BarChart2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange('table')}
        title="Table view"
        aria-pressed={view === 'table'}
        className={`rounded-md p-1.5 transition-all cursor-pointer ${
          view === 'table'
            ? 'bg-white text-slate-800 shadow-xs dark:bg-slate-800 dark:text-white'
            : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
        }`}
      >
        <AlignJustify className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

