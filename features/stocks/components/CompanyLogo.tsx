'use client';

import React, { useState, useEffect } from 'react';

interface CompanyLogoProps {
  src?: string | null;
  symbol: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CompanyLogo({
  src,
  symbol,
  name,
  size = 'md',
  className = '',
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes (e.g. stock changes in modal)
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-8 h-8 text-xs rounded-lg',
    lg: 'w-10 h-10 text-sm rounded-xl',
    xl: 'w-14 h-14 text-xl rounded-2xl',
  }[size];

  const initials = (symbol || 'ST').slice(0, 2).toUpperCase();

  // If valid src and hasn't errored out
  if (src && !hasError) {
    return (
      <div
        className={`relative ${sizeClasses} shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-2xs transition-all ${className}`}
      >
        <img
          src={src}
          alt={name || symbol}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback Initials Avatar with clean styling
  return (
    <div
      className={`${sizeClasses} bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 group-hover:border-sky-500/50 group-hover:shadow-2xs transition-all shrink-0 select-none ${className}`}
      title={name || symbol}
    >
      {initials}
    </div>
  );
}
