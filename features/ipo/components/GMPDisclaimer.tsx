import React from 'react';

interface GMPDisclaimerProps {
  className?: string;
  subtle?: boolean;
}

export function GMPDisclaimer({ className = '', subtle = false }: GMPDisclaimerProps) {
  return (
    <div
      className={`rounded-xl border border-line/80 bg-panel/70 px-4 py-2.5 flex items-center gap-3 text-xs text-body shadow-sm transition-all ${className}`}
    >
      {/* Amber indicator bar */}
      <span className="w-1 h-3.5 bg-amber-500 rounded-full shrink-0" />

      {/* Disclaimer copy */}
      <p className="text-xs text-body leading-normal">
        <strong className="font-semibold text-ink">Disclaimer:</strong>{' '}
        GMP values change dynamically. This data is strictly for{' '}
        <strong className="font-semibold text-ink">educational purposes</strong>{' '}
        only and not an investment advice.
      </p>
    </div>
  );
}

export default GMPDisclaimer;
