import React from 'react';

interface GMPDisclaimerProps {
  className?: string;
  subtle?: boolean;
}

export function GMPDisclaimer({ className = '', subtle = false }: GMPDisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/70 px-4 py-2.5 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-xs dark:shadow-sm transition-all ${className}`}
    >
      {/* Amber indicator bar */}
      <span className="w-1 h-3.5 bg-amber-500 rounded-full shrink-0" />

      {/* Disclaimer copy */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
        <strong className="font-semibold text-slate-900 dark:text-slate-100">Disclaimer:</strong>{' '}
        GMP values change dynamically. This data is strictly for{' '}
        <strong className="font-semibold text-slate-900 dark:text-slate-100">educational purposes</strong>{' '}
        only and not an investment advice.
      </p>
    </div>
  );
}

export default GMPDisclaimer;
